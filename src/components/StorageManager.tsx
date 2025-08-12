/**
 * Comprehensive Storage Manager Component
 * Demonstrates usage of all 11 Supabase storage buckets
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StorageManager, {
  EmailLog,
  UserProfile,
  SystemLog,
  ChatExport,
  UserSettings
} from '@/utils/supabase-storage-manager';

interface StorageStats {
  [bucket: string]: {
    fileCount: number;
    totalSize: number;
    error?: string;
  };
}

const StorageManagerComponent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('emails');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [storageStats, setStorageStats] = useState<StorageStats>({});
  const [files, setFiles] = useState<any[]>([]);

  // Form states for different bucket types
  const [emailForm, setEmailForm] = useState<EmailLog>({
    to: '',
    from: '',
    subject: '',
    body: '',
    timestamp: new Date().toISOString()
  });

  const [profileForm, setProfileForm] = useState<UserProfile>({
    userId: '',
    displayName: '',
    bio: ''
  });

  const [settingsForm, setSettingsForm] = useState<UserSettings>({
    userId: '',
    theme: 'light',
    notifications: true,
    language: 'en'
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadContext, setUploadContext] = useState({
    type: 'email-attachment' as any,
    metadata: {} as any
  });

  useEffect(() => {
    if (user?.id) {
      loadStorageStats();
      setProfileForm(prev => ({ ...prev, userId: user.id }));
      setSettingsForm(prev => ({ ...prev, userId: user.id }));
    }
  }, [user?.id]);

  const loadStorageStats = async () => {
    if (!user?.id) return;
    
    try {
      const stats = await StorageManager.router.getStorageStats(user.id);
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    }
  };

  const showMessage = (msg: string, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Email operations
  const handleEmailUpload = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const result = await StorageManager.emails.uploadEmailLog(emailForm, user.id);
      showMessage(`Email log uploaded: ${result.filename}`);
      setEmailForm({
        to: '',
        from: '',
        subject: '',
        body: '',
        timestamp: new Date().toISOString()
      });
      loadStorageStats();
    } catch (error: any) {
      showMessage(`Error: ${error.message}`, true);
    }
    setLoading(false);
  };

  const loadEmailLogs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const emailFiles = await StorageManager.emails.listEmailLogs(user.id);
      setFiles(emailFiles);
    } catch (error: any) {
      showMessage(`Error: ${error.message}`, true);
    }
    setLoading(false);
  };

  // Profile operations
  const handleProfileUpload = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await StorageManager.userProfiles.uploadProfileData(profileForm, user.id);
      showMessage(`Profile data uploaded: ${result.filename}`);
      loadStorageStats();
    } catch (error: any) {
      showMessage(`Error: ${error.message}`, true);
    }
    setLoading(false);
  };

  const handleImageUpload = async (type: 'avatar' | 'cover') => {
    if (!user || !selectedFile) return;
    setLoading(true);
    try {
      const result = await StorageManager.userProfiles.uploadProfileImage(selectedFile, user.id, type);
      showMessage(`${type} uploaded: ${result.filename}`);
      setSelectedFile(null);
      loadStorageStats();
    } catch (error: any) {
      showMessage(`Error: ${error.message}`, true);
    }
    setLoading(false);
  };

  // Document operations
  const handleDocumentUpload = async (category: string) => {
    if (!user || !selectedFile) return;
    setLoading(true);
    try {
      const result = await StorageManager.documents.uploadDocument(
        selectedFile,
        user.id,
        category as any
      );
      showMessage(`Document uploaded: ${result.filename}`);
      setSelectedFile(null);
      loadStorageStats();
    } catch (error: any) {
      showMessage(`Error: ${error.message}`, true);
    }
    setLoading(false);
  };

  // Settings operations
  const handleSettingsUpload = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await StorageManager.settings.uploadUserSettings(settingsForm, user.id);
      showMessage(`Settings uploaded: ${result.filename}`);
      loadStorageStats();
    } catch (error: any) {
      showMessage(`Error: ${error.message}`, true);
    }
    setLoading(false);
  };

  const loadUserSettings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const settings = await StorageManager.settings.getUserSettings(user.id);
      if (settings) {
        setSettingsForm(settings);
        showMessage('Settings loaded successfully');
      } else {
        showMessage('No settings found');
      }
    } catch (error: any) {
      showMessage(`Error: ${error.message}`, true);
    }
    setLoading(false);
  };

  // Draft operations
  const handleDraftUpload = async (title: string, content: string, type: 'text' | 'json') => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await StorageManager.drafts.uploadDraft(content, user.id, title, type);
      showMessage(`Draft uploaded: ${result.filename}`);
      loadStorageStats();
    } catch (error: any) {
      showMessage(`Error: ${error.message}`, true);
    }
    setLoading(false);
  };

  // Auto-router upload
  const handleAutoUpload = async () => {
    if (!user || !selectedFile) return;
    setLoading(true);
    try {
      const result = await StorageManager.router.autoUpload(selectedFile, user.id, uploadContext);
      showMessage(`File uploaded to ${result.bucket}: ${result.filename}`);
      setSelectedFile(null);
      loadStorageStats();
    } catch (error: any) {
      showMessage(`Error: ${error.message}`, true);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access the Storage Manager.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'emails', name: 'Emails', icon: '📧' },
    { id: 'attachments', name: 'Attachments', icon: '📎' },
    { id: 'profiles', name: 'Profiles', icon: '👤' },
    { id: 'documents', name: 'Documents', icon: '📄' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'drafts', name: 'Drafts', icon: '📝' },
    { id: 'auto-router', name: 'Auto Router', icon: '⚡' },
    { id: 'stats', name: 'Statistics', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🗄️ Supabase Storage Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive management for all 11 storage buckets
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-300'
              : 'bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300'
          }`}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Emails Tab */}
          {activeTab === 'emails' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                📧 Email Logs Management
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Upload Email Log</h3>
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="To"
                      value={emailForm.to}
                      onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="email"
                      placeholder="From"
                      value={emailForm.from}
                      onChange={(e) => setEmailForm({...emailForm, from: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Subject"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <textarea
                      placeholder="Email body"
                      value={emailForm.body}
                      onChange={(e) => setEmailForm({...emailForm, body: e.target.value})}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={handleEmailUpload}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Uploading...' : 'Upload Email Log'}
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Email Logs</h3>
                  <button
                    onClick={loadEmailLogs}
                    disabled={loading}
                    className="mb-4 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load Email Logs'}
                  </button>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatFileSize(file.metadata?.size || 0)} • {new Date(file.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === 'attachments' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                📎 Email Attachments
              </h2>
              
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt,.zip"
                  className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {selectedFile && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <p><strong>Selected:</strong> {selectedFile.name}</p>
                    <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
                    <p><strong>Type:</strong> {selectedFile.type}</p>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (selectedFile && user) {
                      StorageManager.emailAttachments.uploadAttachment(selectedFile, user.id)
                        .then(result => {
                          showMessage(`Attachment uploaded: ${result.filename}`);
                          setSelectedFile(null);
                          loadStorageStats();
                        })
                        .catch(error => showMessage(`Error: ${error.message}`, true));
                    }
                  }}
                  disabled={!selectedFile || loading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Upload Attachment'}
                </button>
              </div>
            </div>
          )}

          {/* Profiles Tab */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                👤 User Profiles
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Profile Data</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Display Name"
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <textarea
                      placeholder="Bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={handleProfileUpload}
                      disabled={loading}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      {loading ? 'Uploading...' : 'Upload Profile Data'}
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Profile Images</h3>
                  <div className="space-y-4">
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleImageUpload('avatar')}
                        disabled={!selectedFile || loading}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Upload Avatar
                      </button>
                      <button
                        onClick={() => handleImageUpload('cover')}
                        disabled={!selectedFile || loading}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Upload Cover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                📄 Document Management
              </h2>
              
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.txt,.rtf,.odt"
                  className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['resume', 'proposal', 'id', 'contract', 'other'].map(category => (
                    <button
                      key={category}
                      onClick={() => handleDocumentUpload(category)}
                      disabled={!selectedFile || loading}
                      className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 capitalize"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                ⚙️ User Settings
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Settings Form</h3>
                  <div className="space-y-4">
                    <select
                      value={settingsForm.theme}
                      onChange={(e) => setSettingsForm({...settingsForm, theme: e.target.value as any})}
                      className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="light">Light Theme</option>
                      <option value="dark">Dark Theme</option>
                    </select>
                    
                    <select
                      value={settingsForm.language}
                      onChange={(e) => setSettingsForm({...settingsForm, language: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settingsForm.notifications}
                        onChange={(e) => setSettingsForm({...settingsForm, notifications: e.target.checked})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-900 dark:text-white">Enable Notifications</span>
                    </label>
                    
                    <button
                      onClick={handleSettingsUpload}
                      disabled={loading}
                      className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Load Settings</h3>
                  <button
                    onClick={loadUserSettings}
                    disabled={loading}
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load My Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Drafts Tab */}
          {activeTab === 'drafts' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                📝 Draft Management
              </h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Draft title"
                  className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  id="draft-title"
                />
                <textarea
                  placeholder="Draft content"
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  id="draft-content"
                />
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      const title = (document.getElementById('draft-title') as HTMLInputElement)?.value;
                      const content = (document.getElementById('draft-content') as HTMLTextAreaElement)?.value;
                      if (title && content) {
                        handleDraftUpload(title, content, 'text');
                      }
                    }}
                    disabled={loading}
                    className="bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Save as Text
                  </button>
                  <button
                    onClick={() => {
                      const title = (document.getElementById('draft-title') as HTMLInputElement)?.value;
                      const content = (document.getElementById('draft-content') as HTMLTextAreaElement)?.value;
                      if (title && content) {
                        try {
                          JSON.parse(content); // Validate JSON
                          handleDraftUpload(title, content, 'json');
                        } catch {
                          showMessage('Invalid JSON format', true);
                        }
                      }
                    }}
                    disabled={loading}
                    className="bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 disabled:opacity-50"
                  >
                    Save as JSON
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Auto Router Tab */}
          {activeTab === 'auto-router' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                ⚡ Auto Router
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Automatically route files to the correct bucket based on type and context.
              </p>
              
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                
                <select
                  value={uploadContext.type}
                  onChange={(e) => setUploadContext({...uploadContext, type: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="email-attachment">Email Attachment</option>
                  <option value="profile-image">Profile Image</option>
                  <option value="document">Document</option>
                  <option value="product-asset">Product Asset</option>
                  <option value="legal">Legal Document</option>
                </select>
                
                <button
                  onClick={handleAutoUpload}
                  disabled={!selectedFile || loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Auto Upload'}
                </button>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                📊 Storage Statistics
              </h2>
              
              <button
                onClick={loadStorageStats}
                disabled={loading}
                className="mb-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh Stats'}
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(storageStats).map(([bucket, stats]) => (
                  <div key={bucket} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white capitalize mb-2">
                      {bucket.replace('-', ' ')}
                    </h3>
                    {stats.error ? (
                      <p className="text-red-500 text-sm">{stats.error}</p>
                    ) : (
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>Files: {stats.fileCount}</p>
                        <p>Size: {formatFileSize(stats.totalSize)}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageManagerComponent;