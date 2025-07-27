import { supabase, supabaseAdmin } from '@/lib/supabase';
import { uploadFile, getSignedUrl, fileExists } from './storage';

// Email log interface
export interface EmailLog {
  to: string;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
  attachments?: string[]; // Array of attachment file paths
}

// Email file metadata interface
export interface EmailFileMetadata {
  filename: string;
  downloadUrl: string;
  createdAt: string;
  size?: number;
}

/**
 * 1. Upload Email Log to Supabase Storage
 * Uploads a JSON email log to the 'emails' bucket with timestamp-based naming
 * @param emailLog The email log object to upload
 * @returns The filename of the uploaded email log
 */
export async function uploadEmailLog(emailLog: EmailLog): Promise<string> {
  try {
    // Validate email log
    if (!emailLog.to || !emailLog.from || !emailLog.subject || !emailLog.body || !emailLog.timestamp) {
      throw new Error('Missing required email log fields: to, from, subject, body, timestamp');
    }

    // Create filename with timestamp
    const timestamp = new Date(emailLog.timestamp).getTime();
    const filename = `email-${timestamp}.json`;
    
    // Convert email log to JSON blob
    const emailBlob = new Blob([JSON.stringify(emailLog, null, 2)], {
      type: 'application/json'
    });
    
    // Create File object from blob
    const emailFile = new File([emailBlob], filename, {
      type: 'application/json'
    });

    // Upload to 'emails' bucket
    const { data, error } = await supabaseAdmin.storage
      .from('emails')
      .upload(filename, emailFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload email log: ${error.message}`);
    }

    console.log(`Email log uploaded successfully: ${filename}`);
    return filename;
  } catch (error: any) {
    console.error('Email log upload error:', error.message);
    throw error;
  }
}

/**
 * 2. List Last 10 Email Files
 * Retrieves the latest 10 email files from the 'emails' bucket
 * @returns Array of email file metadata with filenames and download URLs
 */
export async function getLatestEmailFiles(): Promise<EmailFileMetadata[]> {
  try {
    // List all files in the emails bucket
    const { data: files, error } = await supabaseAdmin.storage
      .from('emails')
      .list('', {
        limit: 100, // Get more files to sort properly
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      throw new Error(`Failed to list email files: ${error.message}`);
    }

    if (!files || files.length === 0) {
      return [];
    }

    // Filter and sort email files, take latest 10
    const emailFiles = files
      .filter((file: any) => file.name.startsWith('email-') && file.name.endsWith('.json'))
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    // Generate download URLs for each file
    const emailFileMetadata: EmailFileMetadata[] = await Promise.all(
      emailFiles.map(async (file: any) => {
        const { data: urlData } = supabaseAdmin.storage
          .from('emails')
          .getPublicUrl(file.name);

        return {
          filename: file.name,
          downloadUrl: urlData.publicUrl,
          createdAt: file.created_at,
          size: file.metadata?.size
        };
      })
    );

    return emailFileMetadata;
  } catch (error: any) {
    console.error('Error listing email files:', error.message);
    throw error;
  }
}

/**
 * 3. Retrieve Single Email Log
 * Downloads and reads the contents of a specific email JSON file
 * @param filename The filename of the email log to retrieve
 * @returns The parsed email log object
 */
export async function getEmailLog(filename: string): Promise<EmailLog> {
  try {
    // Validate filename format
    if (!filename.startsWith('email-') || !filename.endsWith('.json')) {
      throw new Error('Invalid email filename format. Expected: email-[timestamp].json');
    }

    // Download the file from Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('emails')
      .download(filename);

    if (error) {
      throw new Error(`Failed to download email log: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data received from email log download');
    }

    // Convert blob to text and parse JSON
    const emailText = await data.text();
    const emailLog: EmailLog = JSON.parse(emailText);

    // Validate the parsed email log
    if (!emailLog.to || !emailLog.from || !emailLog.subject || !emailLog.body || !emailLog.timestamp) {
      throw new Error('Invalid email log format: missing required fields');
    }

    return emailLog;
  } catch (error: any) {
    console.error('Error retrieving email log:', error.message);
    throw error;
  }
}

/**
 * 4. Upload Email Attachments
 * Stores email attachments in the 'email-attachments' bucket organized by user ID
 * @param file The attachment file to upload
 * @param userId The user ID to organize attachments by
 * @param emailTimestamp Optional timestamp to associate with the email
 * @returns The public URL of the uploaded attachment
 */
export async function uploadEmailAttachment(
  file: File,
  userId: string,
  emailTimestamp?: string
): Promise<string> {
  try {
    // Validate file type (PDF, DOCX, JPG, PNG, etc.)
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/zip'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}. Allowed types: PDF, DOCX, DOC, JPG, PNG, GIF, TXT, ZIP`);
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Create organized path: userId/[timestamp-]filename
    const timestamp = emailTimestamp ? new Date(emailTimestamp).getTime() : new Date().getTime();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const attachmentPath = `${userId}/${timestamp}-${sanitizedFileName}`;

    // Upload to 'email-attachments' bucket
    const { data, error } = await supabaseAdmin.storage
      .from('email-attachments')
      .upload(attachmentPath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload attachment: ${error.message}`);
    }

    // Get the public URL for the uploaded attachment
    const { data: urlData } = supabaseAdmin.storage
      .from('email-attachments')
      .getPublicUrl(data.path);

    console.log(`Email attachment uploaded successfully: ${attachmentPath}`);
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Email attachment upload error:', error.message);
    throw error;
  }
}

/**
 * Get User's Email Attachments
 * Lists all attachments for a specific user
 * @param userId The user ID to get attachments for
 * @returns Array of attachment metadata
 */
export async function getUserEmailAttachments(userId: string): Promise<EmailFileMetadata[]> {
  try {
    // List files in the user's folder
    const { data: files, error } = await supabaseAdmin.storage
      .from('email-attachments')
      .list(userId, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      throw new Error(`Failed to list user attachments: ${error.message}`);
    }

    if (!files || files.length === 0) {
      return [];
    }

    // Generate download URLs for each attachment
    const attachmentMetadata: EmailFileMetadata[] = await Promise.all(
      files.map(async (file: any) => {
        const { data: urlData } = supabaseAdmin.storage
          .from('email-attachments')
          .getPublicUrl(`${userId}/${file.name}`);

        return {
          filename: file.name,
          downloadUrl: urlData.publicUrl,
          createdAt: file.created_at,
          size: file.metadata?.size
        };
      })
    );

    return attachmentMetadata;
  } catch (error: any) {
    console.error('Error listing user attachments:', error.message);
    throw error;
  }
}

/**
 * Delete Email Log
 * Removes an email log file from storage
 * @param filename The filename of the email log to delete
 * @returns Boolean indicating success
 */
export async function deleteEmailLog(filename: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.storage
      .from('emails')
      .remove([filename]);

    if (error) {
      throw new Error(`Failed to delete email log: ${error.message}`);
    }

    console.log(`Email log deleted successfully: ${filename}`);
    return true;
  } catch (error: any) {
    console.error('Error deleting email log:', error.message);
    return false;
  }
}

/**
 * Search Email Logs
 * Searches email logs by subject, sender, or recipient
 * @param searchTerm The term to search for
 * @param limit Maximum number of results to return
 * @returns Array of matching email logs
 */
export async function searchEmailLogs(searchTerm: string, limit: number = 20): Promise<EmailLog[]> {
  try {
    // Get all email files
    const emailFiles = await getLatestEmailFiles();
    const matchingEmails: EmailLog[] = [];

    // Search through email logs
    for (const fileMetadata of emailFiles.slice(0, limit * 2)) { // Get more files to search through
      try {
        const emailLog = await getEmailLog(fileMetadata.filename);
        
        // Check if search term matches subject, from, or to fields
        const searchLower = searchTerm.toLowerCase();
        if (
          emailLog.subject.toLowerCase().includes(searchLower) ||
          emailLog.from.toLowerCase().includes(searchLower) ||
          emailLog.to.toLowerCase().includes(searchLower)
        ) {
          matchingEmails.push(emailLog);
          
          if (matchingEmails.length >= limit) {
            break;
          }
        }
      } catch (error) {
        // Skip files that can't be parsed
        console.warn(`Skipping invalid email file: ${fileMetadata.filename}`);
        continue;
      }
    }

    return matchingEmails;
  } catch (error: any) {
    console.error('Error searching email logs:', error.message);
    throw error;
  }
}