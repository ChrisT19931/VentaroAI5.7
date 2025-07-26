/**
 * Comprehensive Supabase Storage Manager
 * Handles 11 specialized buckets with proper routing, access control, and file organization
 */

import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';

// Types for different data structures
export interface EmailLog {
  to: string;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
}

export interface UserProfile {
  userId: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
}

export interface SystemLog {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface ChatExport {
  chatId: string;
  userId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  exportedAt: string;
}

export interface UserSettings {
  userId: string;
  theme?: 'light' | 'dark';
  notifications?: boolean;
  language?: string;
  preferences?: Record<string, any>;
}

// Utility functions
const generateTimestamp = (): string => {
  return new Date().toISOString().replace(/[:.]/g, '-');
};

const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// 1. EMAILS BUCKET - JSON logs of sent/received emails
export class EmailsStorage {
  private static bucketName = 'emails';

  /**
   * Upload email log as JSON
   * Naming: email-[timestamp].json
   */
  static async uploadEmailLog(
    emailData: EmailLog,
    userId: string,
    customFilename?: string
  ): Promise<{ filename: string; url: string }> {
    const timestamp = emailData.timestamp || new Date().toISOString();
    const filename = customFilename || `email-${generateTimestamp()}.json`;
    
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, JSON.stringify(emailData, null, 2), {
        contentType: 'application/json',
        metadata: {
          userId,
          emailTo: emailData.to,
          emailFrom: emailData.from,
          subject: emailData.subject
        }
      });

    if (error) throw new Error(`Email upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { filename, url: urlData.publicUrl };
  }

  /**
   * List user's email logs
   */
  static async listEmailLogs(userId: string, limit = 50) {
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .list('', {
        limit,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw new Error(`Failed to list emails: ${error.message}`);
    return data;
  }

  /**
   * Download email log content
   */
  static async downloadEmailLog(filename: string): Promise<EmailLog> {
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .download(filename);

    if (error) throw new Error(`Failed to download email: ${error.message}`);
    
    const text = await data.text();
    return JSON.parse(text) as EmailLog;
  }
}

// 2. EMAIL-ATTACHMENTS BUCKET - Email attachments with user folders
export class EmailAttachmentsStorage {
  private static bucketName = 'email-attachments';
  private static allowedTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'txt', 'zip'];

  /**
   * Upload email attachment to user folder
   * Structure: userId/[timestamp]-filename.ext
   */
  static async uploadAttachment(
    file: File,
    userId: string,
    emailTimestamp?: string
  ): Promise<{ filename: string; url: string; size: number }> {
    const fileExt = getFileExtension(file.name);
    
    if (!this.allowedTypes.includes(fileExt)) {
      throw new Error(`File type .${fileExt} not allowed`);
    }

    const timestamp = emailTimestamp || generateTimestamp();
    const sanitizedName = sanitizeFilename(file.name);
    const filename = `${userId}/${timestamp}-${sanitizedName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, file, {
        metadata: {
          userId,
          originalName: file.name,
          emailTimestamp
        }
      });

    if (error) throw new Error(`Attachment upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { 
      filename, 
      url: urlData.publicUrl, 
      size: file.size 
    };
  }

  /**
   * List user's attachments
   */
  static async listUserAttachments(userId: string) {
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .list(userId, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw new Error(`Failed to list attachments: ${error.message}`);
    return data;
  }
}

// 3. USER-PROFILES BUCKET - Profile pics, cover images, bios
export class UserProfilesStorage {
  private static bucketName = 'user-profiles';

  /**
   * Upload profile image
   * Structure: userId/avatar-[timestamp].ext or userId/cover-[timestamp].ext
   */
  static async uploadProfileImage(
    file: File,
    userId: string,
    type: 'avatar' | 'cover'
  ): Promise<{ filename: string; url: string }> {
    const fileExt = getFileExtension(file.name);
    const allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!allowedImageTypes.includes(fileExt)) {
      throw new Error(`Image type .${fileExt} not allowed`);
    }

    const filename = `${userId}/${type}-${generateTimestamp()}.${fileExt}`;

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, file, {
        metadata: { userId, imageType: type }
      });

    if (error) throw new Error(`Profile image upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { filename, url: urlData.publicUrl };
  }

  /**
   * Upload profile data as JSON
   */
  static async uploadProfileData(
    profileData: UserProfile,
    userId: string
  ): Promise<{ filename: string; url: string }> {
    const filename = `${userId}/profile-${generateTimestamp()}.json`;

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, JSON.stringify(profileData, null, 2), {
        contentType: 'application/json',
        metadata: { userId }
      });

    if (error) throw new Error(`Profile data upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { filename, url: urlData.publicUrl };
  }
}

// 4. DOCUMENTS BUCKET - User uploads like resumes, proposals, IDs
export class DocumentsStorage {
  private static bucketName = 'documents';
  private static allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];

  /**
   * Upload user document
   * Structure: userId/documents/[category]/[timestamp]-filename.ext
   */
  static async uploadDocument(
    file: File,
    userId: string,
    category: 'resume' | 'proposal' | 'id' | 'contract' | 'other' = 'other',
    customFilename?: string
  ): Promise<{ filename: string; url: string }> {
    const fileExt = getFileExtension(file.name);
    
    if (!this.allowedTypes.includes(fileExt)) {
      throw new Error(`Document type .${fileExt} not allowed`);
    }

    const sanitizedName = customFilename || sanitizeFilename(file.name);
    const filename = `${userId}/documents/${category}/${generateTimestamp()}-${sanitizedName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, file, {
        metadata: {
          userId,
          category,
          originalName: file.name
        }
      });

    if (error) throw new Error(`Document upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { filename, url: urlData.publicUrl };
  }

  /**
   * List user documents by category
   */
  static async listUserDocuments(userId: string, category?: string) {
    const path = category ? `${userId}/documents/${category}` : `${userId}/documents`;
    
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .list(path, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw new Error(`Failed to list documents: ${error.message}`);
    return data;
  }
}

// 5. LOGS BUCKET - System event logs, form submissions
export class LogsStorage {
  private static bucketName = 'logs';

  /**
   * Upload system log
   * Structure: [date]/[level]/[timestamp]-log.json
   */
  static async uploadSystemLog(
    logData: SystemLog,
    adminUserId: string
  ): Promise<{ filename: string; url: string }> {
    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}/${logData.level}/${generateTimestamp()}-log.json`;

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, JSON.stringify(logData, null, 2), {
        contentType: 'application/json',
        metadata: {
          adminUserId,
          logLevel: logData.level,
          userId: logData.userId
        }
      });

    if (error) throw new Error(`Log upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { filename, url: urlData.publicUrl };
  }

  /**
   * List logs by date and level
   */
  static async listLogs(date: string, level?: string) {
    const path = level ? `${date}/${level}` : date;
    
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .list(path, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw new Error(`Failed to list logs: ${error.message}`);
    return data;
  }
}

// 6. PRODUCTS BUCKET - Product assets like images, PDFs, downloadables
export class ProductsStorage {
  private static bucketName = 'products';

  /**
   * Upload product asset
   * Structure: products/[productId]/[type]/[timestamp]-filename.ext
   */
  static async uploadProductAsset(
    file: File,
    productId: string,
    type: 'image' | 'pdf' | 'download' | 'preview',
    customFilename?: string
  ): Promise<{ filename: string; url: string }> {
    const sanitizedName = customFilename || sanitizeFilename(file.name);
    const filename = `products/${productId}/${type}/${generateTimestamp()}-${sanitizedName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, file, {
        metadata: {
          productId,
          assetType: type,
          originalName: file.name
        }
      });

    if (error) throw new Error(`Product asset upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { filename, url: urlData.publicUrl };
  }

  /**
   * List product assets
   */
  static async listProductAssets(productId: string, type?: string) {
    const path = type ? `products/${productId}/${type}` : `products/${productId}`;
    
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .list(path, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw new Error(`Failed to list product assets: ${error.message}`);
    return data;
  }
}

// 7. CHAT-EXPORTS BUCKET - AI chat transcripts, support logs
export class ChatExportsStorage {
  private static bucketName = 'chat-exports';

  /**
   * Upload chat export
   * Structure: userId/chats/[timestamp]-chat-[chatId].json
   */
  static async uploadChatExport(
    chatData: ChatExport,
    userId: string
  ): Promise<{ filename: string; url: string }> {
    const filename = `${userId}/chats/${generateTimestamp()}-chat-${chatData.chatId}.json`;

    // Optional: Encrypt sensitive chat data
    const dataToStore = {
      ...chatData,
      encrypted: false // Set to true if implementing encryption
    };

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, JSON.stringify(dataToStore, null, 2), {
        contentType: 'application/json',
        metadata: {
          userId,
          chatId: chatData.chatId,
          messageCount: chatData.messages.length
        }
      });

    if (error) throw new Error(`Chat export upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { filename, url: urlData.publicUrl };
  }

  /**
   * List user's chat exports
   */
  static async listUserChatExports(userId: string) {
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .list(`${userId}/chats`, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw new Error(`Failed to list chat exports: ${error.message}`);
    return data;
  }
}

// 8. DRAFTS BUCKET - User-saved drafts in .txt or .json
export class DraftsStorage {
  private static bucketName = 'drafts';

  /**
   * Upload user draft
   * Structure: userId/drafts/[type]/[timestamp]-[title].ext
   */
  static async uploadDraft(
    content: string,
    userId: string,
    title: string,
    type: 'text' | 'json' = 'text',
    category?: string
  ): Promise<{ filename: string; url: string }> {
    const extension = type === 'json' ? 'json' : 'txt';
    const sanitizedTitle = sanitizeFilename(title);
    const categoryPath = category ? `${category}/` : '';
    const filename = `${userId}/drafts/${categoryPath}${generateTimestamp()}-${sanitizedTitle}.${extension}`;

    const contentType = type === 'json' ? 'application/json' : 'text/plain';
    const dataToUpload = type === 'json' ? JSON.stringify(JSON.parse(content), null, 2) : content;

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, dataToUpload, {
        contentType,
        metadata: {
          userId,
          title,
          type,
          category
        }
      });

    if (error) throw new Error(`Draft upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { filename, url: urlData.publicUrl };
  }

  /**
   * List user drafts
   */
  static async listUserDrafts(userId: string, category?: string) {
    const path = category ? `${userId}/drafts/${category}` : `${userId}/drafts`;
    
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .list(path, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw new Error(`Failed to list drafts: ${error.message}`);
    return data;
  }

  /**
   * Download draft content
   */
  static async downloadDraft(filename: string): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .download(filename);

    if (error) throw new Error(`Failed to download draft: ${error.message}`);
    
    return await data.text();
  }
}

// 9. SETTINGS BUCKET - JSON settings files per user or globally
export class SettingsStorage {
  private static bucketName = 'settings';

  /**
   * Upload user settings
   * Structure: users/[userId]/settings-[timestamp].json or global/[setting-name].json
   */
  static async uploadUserSettings(
    settings: UserSettings,
    userId: string
  ): Promise<{ filename: string; url: string }> {
    const filename = `users/${userId}/settings-${generateTimestamp()}.json`;

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, JSON.stringify(settings, null, 2), {
        contentType: 'application/json',
        metadata: { userId }
      });

    if (error) throw new Error(`Settings upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { filename, url: urlData.publicUrl };
  }

  /**
   * Upload global settings (admin only)
   */
  static async uploadGlobalSettings(
    settings: Record<string, any>,
    settingName: string,
    adminUserId: string
  ): Promise<{ filename: string; url: string }> {
    const filename = `global/${settingName}.json`;

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, JSON.stringify(settings, null, 2), {
        contentType: 'application/json',
        metadata: { adminUserId, settingType: 'global' }
      });

    if (error) throw new Error(`Global settings upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { filename, url: urlData.publicUrl };
  }

  /**
   * Get latest user settings
   */
  static async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .list(`users/${userId}`, {
        limit: 1,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error || !data || data.length === 0) return null;

    const latestFile = data[0];
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from(this.bucketName)
      .download(`users/${userId}/${latestFile.name}`);

    if (downloadError) throw new Error(`Failed to download settings: ${downloadError.message}`);
    
    const text = await fileData.text();
    return JSON.parse(text) as UserSettings;
  }
}

// 10. BACKUPS BUCKET - Admin-scheduled JSON or CSV data exports
export class BackupsStorage {
  private static bucketName = 'backups';

  /**
   * Upload backup file
   * Structure: [date]/[type]/[timestamp]-backup.ext
   */
  static async uploadBackup(
    data: any,
    backupType: 'users' | 'orders' | 'products' | 'logs' | 'full',
    format: 'json' | 'csv',
    adminUserId: string
  ): Promise<{ filename: string; url: string }> {
    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}/${backupType}/${generateTimestamp()}-backup.${format}`;

    const contentType = format === 'json' ? 'application/json' : 'text/csv';
    const dataToUpload = format === 'json' ? JSON.stringify(data, null, 2) : data;

    const { data: uploadData, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, dataToUpload, {
        contentType,
        metadata: {
          adminUserId,
          backupType,
          format,
          recordCount: Array.isArray(data) ? data.length : 1
        }
      });

    if (error) throw new Error(`Backup upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { filename, url: urlData.publicUrl };
  }

  /**
   * List backups by date and type
   */
  static async listBackups(date?: string, backupType?: string) {
    let path = '';
    if (date && backupType) {
      path = `${date}/${backupType}`;
    } else if (date) {
      path = date;
    }
    
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .list(path, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw new Error(`Failed to list backups: ${error.message}`);
    return data;
  }
}

// 11. TERMS-POLICIES BUCKET - Legal docs like T&Cs, privacy policy
export class TermsPoliciesStorage {
  private static bucketName = 'terms-policies';

  /**
   * Upload legal document
   * Structure: [type]/[version]/[timestamp]-[document-name].ext
   */
  static async uploadLegalDocument(
    file: File,
    documentType: 'terms' | 'privacy' | 'cookies' | 'disclaimer' | 'other',
    version: string,
    adminUserId: string,
    customFilename?: string
  ): Promise<{ filename: string; url: string }> {
    const fileExt = getFileExtension(file.name);
    const allowedTypes = ['pdf', 'html', 'txt', 'md'];
    
    if (!allowedTypes.includes(fileExt)) {
      throw new Error(`Document type .${fileExt} not allowed for legal documents`);
    }

    const sanitizedName = customFilename || sanitizeFilename(file.name);
    const filename = `${documentType}/${version}/${generateTimestamp()}-${sanitizedName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filename, file, {
        metadata: {
          adminUserId,
          documentType,
          version,
          originalName: file.name
        }
      });

    if (error) throw new Error(`Legal document upload failed: ${error.message}`);
    
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return { filename, url: urlData.publicUrl };
  }

  /**
   * Get latest version of a legal document
   */
  static async getLatestDocument(documentType: string, version?: string) {
    const path = version ? `${documentType}/${version}` : documentType;
    
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .list(path, {
        limit: 1,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw new Error(`Failed to get legal document: ${error.message}`);
    return data && data.length > 0 ? data[0] : null;
  }

  /**
   * List all versions of a document type
   */
  static async listDocumentVersions(documentType: string) {
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .list(documentType, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw new Error(`Failed to list document versions: ${error.message}`);
    return data;
  }
}

// MASTER STORAGE ROUTER - Automatically route files to correct buckets
export class StorageRouter {
  /**
   * Auto-route file upload based on file type and context
   */
  static async autoUpload(
    file: File,
    userId: string,
    context: {
      type: 'email-attachment' | 'profile-image' | 'document' | 'product-asset' | 'draft' | 'legal';
      metadata?: Record<string, any>;
    }
  ): Promise<{ bucket: string; filename: string; url: string }> {
    switch (context.type) {
      case 'email-attachment':
        const emailResult = await EmailAttachmentsStorage.uploadAttachment(
          file,
          userId,
          context.metadata?.emailTimestamp
        );
        return { bucket: 'email-attachments', ...emailResult };

      case 'profile-image':
        const profileResult = await UserProfilesStorage.uploadProfileImage(
          file,
          userId,
          context.metadata?.imageType || 'avatar'
        );
        return { bucket: 'user-profiles', ...profileResult };

      case 'document':
        const docResult = await DocumentsStorage.uploadDocument(
          file,
          userId,
          context.metadata?.category || 'other'
        );
        return { bucket: 'documents', ...docResult };

      case 'product-asset':
        const productResult = await ProductsStorage.uploadProductAsset(
          file,
          context.metadata?.productId || 'unknown',
          context.metadata?.assetType || 'image'
        );
        return { bucket: 'products', ...productResult };

      case 'legal':
        const legalResult = await TermsPoliciesStorage.uploadLegalDocument(
          file,
          context.metadata?.documentType || 'other',
          context.metadata?.version || '1.0',
          userId
        );
        return { bucket: 'terms-policies', ...legalResult };

      default:
        throw new Error(`Unknown upload context type: ${context.type}`);
    }
  }

  /**
   * Get storage statistics across all buckets
   */
  static async getStorageStats(userId?: string) {
    const buckets = [
      'emails', 'email-attachments', 'user-profiles', 'documents',
      'logs', 'products', 'chat-exports', 'drafts', 'settings',
      'backups', 'terms-policies'
    ];

    const stats: Record<string, any> = {};

    for (const bucket of buckets) {
      try {
        const { data, error } = await supabaseAdmin.storage
          .from(bucket)
          .list('', { limit: 1000 });

        if (!error && data) {
          stats[bucket] = {
            fileCount: data.length,
            totalSize: data.reduce((sum: number, file: any) => sum + (file.metadata?.size || 0), 0)
          };
        }
      } catch (err) {
        stats[bucket] = { error: 'Failed to fetch stats' };
      }
    }

    return stats;
  }
}





// Default export for convenience
const StorageManager = {
  emails: EmailsStorage,
  emailAttachments: EmailAttachmentsStorage,
  userProfiles: UserProfilesStorage,
  documents: DocumentsStorage,
  logs: LogsStorage,
  products: ProductsStorage,
  chatExports: ChatExportsStorage,
  drafts: DraftsStorage,
  settings: SettingsStorage,
  backups: BackupsStorage,
  termsPolicies: TermsPoliciesStorage,
  router: StorageRouter
};

export default StorageManager;