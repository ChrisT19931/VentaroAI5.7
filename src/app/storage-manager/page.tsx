/**
 * Storage Manager Page
 * Comprehensive interface for managing all 11 Supabase storage buckets
 */

import { Metadata } from 'next';
import StorageManagerComponent from '@/components/StorageManager';

// Force dynamic rendering to avoid prerendering issues with client components using useAuth
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Storage Manager | Ventaro Digital Store',
  description: 'Comprehensive management interface for all Supabase storage buckets including emails, attachments, profiles, documents, and more.',
  keywords: 'storage, supabase, file management, buckets, uploads, downloads'
};

export default function StorageManagerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🗄️ Supabase Storage Manager
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Comprehensive management system for all 11 specialized storage buckets
            </p>
            
            {/* Feature Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-2xl mb-2">📧</div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-300">Email System</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  JSON logs & attachments with user organization
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-2xl mb-2">👤</div>
                <h3 className="font-semibold text-green-900 dark:text-green-300">User Profiles</h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Profile images, avatars, and user data
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-2xl mb-2">📄</div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-300">Documents</h3>
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  Resumes, proposals, contracts, and IDs
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-300">Auto Router</h3>
                <p className="text-sm text-orange-700 dark:text-orange-400">
                  Intelligent file routing to correct buckets
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <StorageManagerComponent />

      {/* Technical Information */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              📋 Storage Bucket Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Bucket Information Cards */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">📧 Email System</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><strong>emails:</strong> JSON email logs (5MB)</li>
                  <li><strong>email-attachments:</strong> User attachments (10MB)</li>
                  <li><strong>Structure:</strong> userId/timestamp-file.ext</li>
                  <li><strong>Security:</strong> User-isolated access</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">👤 User Content</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><strong>user-profiles:</strong> Images & data (5MB)</li>
                  <li><strong>documents:</strong> Personal docs (20MB)</li>
                  <li><strong>drafts:</strong> Text & JSON drafts (5MB)</li>
                  <li><strong>settings:</strong> User preferences (1MB)</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🏢 Business Assets</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><strong>products:</strong> Product assets (50MB)</li>
                  <li><strong>terms-policies:</strong> Legal docs (10MB)</li>
                  <li><strong>logs:</strong> System logs (10MB)</li>
                  <li><strong>backups:</strong> Data exports (100MB)</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">💬 Communication</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><strong>chat-exports:</strong> AI chat logs (25MB)</li>
                  <li><strong>Structure:</strong> userId/chats/timestamp-chat.json</li>
                  <li><strong>Features:</strong> Optional encryption</li>
                  <li><strong>Access:</strong> User-private with RLS</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🔒 Security Features</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><strong>RLS Policies:</strong> Row Level Security</li>
                  <li><strong>User Isolation:</strong> Folder-based access</li>
                  <li><strong>File Validation:</strong> Type & size limits</li>
                  <li><strong>Admin Controls:</strong> Privileged operations</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🚀 Smart Features</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><strong>Auto Router:</strong> Intelligent file routing</li>
                  <li><strong>Naming:</strong> Timestamp-based conventions</li>
                  <li><strong>Metadata:</strong> Rich file information</li>
                  <li><strong>Statistics:</strong> Usage analytics</li>
                </ul>
              </div>
            </div>
            
            {/* API Documentation */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                🔌 API Integration
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Usage Examples</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Import Storage Manager</h4>
                    <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                      import StorageManager from '@/utils/supabase-storage-manager';
                    </code>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Upload Email Log</h4>
                    <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                      {`const result = await StorageManager.emails.uploadEmailLog(emailData, userId);`}
                    </code>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Auto-Route File Upload</h4>
                    <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                      {`const result = await StorageManager.router.autoUpload(file, userId, context);`}
                    </code>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Get Storage Statistics</h4>
                    <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                      {`const stats = await StorageManager.router.getStorageStats(userId);`}
                    </code>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Setup Instructions */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                ⚙️ Setup Instructions
              </h3>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Run the setup script: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">node scripts/setup-all-storage-buckets.js</code></li>
                  <li>Verify buckets in your Supabase dashboard</li>
                  <li>Test uploads using this interface</li>
                  <li>Check Row Level Security policies</li>
                  <li>Monitor storage usage and costs</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}