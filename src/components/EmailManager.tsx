'use client';

import React, { useState, useEffect } from 'react';
import { 
  uploadEmailLog, 
  getLatestEmailFiles, 
  getEmailLog, 
  uploadEmailAttachment,
  getUserEmailAttachments,
  deleteEmailLog,
  searchEmailLogs,
  EmailLog, 
  EmailFileMetadata 
} from '@/utils/email-storage';
import { useAuth } from '@/context/AuthContext';

interface EmailManagerProps {
  className?: string;
}

export default function EmailManager({ className = '' }: EmailManagerProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'list' | 'search'>('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Upload tab state
  const [emailData, setEmailData] = useState<Partial<EmailLog>>({
    to: '',
    from: '',
    subject: '',
    body: '',
    timestamp: new Date().toISOString()
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  
  // List tab state
  const [emailFiles, setEmailFiles] = useState<EmailFileMetadata[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  
  // Search tab state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<EmailLog[]>([]);
  
  // User attachments state
  const [userAttachments, setUserAttachments] = useState<EmailFileMetadata[]>([]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Load email files when list tab is active
  useEffect(() => {
    if (activeTab === 'list') {
      loadEmailFiles();
    }
  }, [activeTab]);

  // Load user attachments when component mounts
  useEffect(() => {
    if (user?.id) {
      loadUserAttachments();
    }
  }, [user?.id]);

  const loadEmailFiles = async () => {
    try {
      setLoading(true);
      const files = await getLatestEmailFiles();
      setEmailFiles(files);
    } catch (err: any) {
      setError(`Failed to load email files: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadUserAttachments = async () => {
    if (!user?.id) return;
    
    try {
      const attachments = await getUserEmailAttachments(user.id);
      setUserAttachments(attachments || []);
    } catch (err: any) {
      console.error('Failed to load user attachments:', err.message);
      setUserAttachments([]);
    }
  };

  const handleEmailUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailData.to || !emailData.from || !emailData.subject || !emailData.body) {
      setError('Please fill in all required email fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Upload email log
      const filename = await uploadEmailLog(emailData as EmailLog);
      
      // Upload attachments if any
      const attachmentUrls: string[] = [];
      if (attachments.length > 0 && user?.id) {
        for (const file of attachments) {
          const url = await uploadEmailAttachment(file, user.id, emailData.timestamp || new Date().toISOString());
          attachmentUrls.push(url);
        }
      }
      
      setSuccess(`Email log uploaded successfully: ${filename}${attachmentUrls.length > 0 ? ` with ${attachmentUrls.length} attachments` : ''}`);
      
      // Reset form
      setEmailData({
        to: '',
        from: '',
        subject: '',
        body: '',
        timestamp: new Date().toISOString()
      });
      setAttachments([]);
      
      // Refresh user attachments
      if (user?.id) {
        loadUserAttachments();
      }
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmailSelect = async (filename: string) => {
    try {
      setLoading(true);
      const email = await getEmailLog(filename);
      setSelectedEmail(email);
    } catch (err: any) {
      setError(`Failed to load email: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailDelete = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this email log?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteEmailLog(filename);
      setSuccess('Email log deleted successfully');
      loadEmailFiles();
      if (selectedEmail) {
        setSelectedEmail(null);
      }
    } catch (err: any) {
      setError(`Failed to delete email: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      const results = await searchEmailLogs(searchTerm.trim());
      setSearchResults(results);
      if (results.length === 0) {
        setSuccess('No emails found matching your search');
      }
    } catch (err: any) {
      setError(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Email Manager</h2>
      
      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {[
          { id: 'upload', label: 'Upload Email' },
          { id: 'list', label: 'Recent Emails' },
          { id: 'search', label: 'Search Emails' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <form onSubmit={handleEmailUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From *
              </label>
              <input
                type="email"
                value={emailData.from || ''}
                onChange={(e) => setEmailData(prev => ({ ...prev, from: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To *
              </label>
              <input
                type="email"
                value={emailData.to || ''}
                onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={emailData.subject || ''}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Body *
            </label>
            <textarea
              value={emailData.body || ''}
              onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Timestamp
            </label>
            <input
              type="datetime-local"
              value={emailData.timestamp ? new Date(emailData.timestamp).toISOString().slice(0, 16) : ''}
              onChange={(e) => setEmailData(prev => ({ ...prev, timestamp: new Date(e.target.value).toISOString() }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Attachments (PDF, DOCX, JPG, PNG - Max 10MB each)
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.gif,.txt,.zip"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            
            {attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {file.name} ({formatFileSize(file.size)})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload Email Log'}
          </button>
        </form>
      )}

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Email Logs</h3>
            <button
              onClick={loadEmailFiles}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Files List */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Email Files</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {emailFiles.map((file) => (
                  <div key={file.filename} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <button
                          onClick={() => handleEmailSelect(file.filename)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          {file.filename}
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(file.createdAt).toLocaleString()}
                        </p>
                        {file.size && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={file.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 text-xs"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => handleEmailDelete(file.filename)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {emailFiles.length === 0 && !loading && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No email logs found
                  </p>
                )}
              </div>
            </div>
            
            {/* Selected Email Details */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Email Details</h4>
              {selectedEmail ? (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From:</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedEmail.from}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To:</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedEmail.to}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject:</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedEmail.subject}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timestamp:</label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedEmail.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Body:</label>
                    <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-3 rounded border max-h-40 overflow-y-auto">
                      {selectedEmail.body}
                    </div>
                  </div>
                  {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Attachments:</label>
                      <ul className="text-sm text-gray-900 dark:text-white">
                        {selectedEmail.attachments.map((attachment, index) => (
                          <li key={index} className="truncate">{attachment}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Select an email to view details
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by subject, sender, or recipient..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          
          <div className="space-y-3">
            {searchResults.map((email, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{email.subject}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(email.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span className="font-medium">From:</span> {email.from}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-medium">To:</span> {email.to}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {email.body.substring(0, 200)}...
                </p>
              </div>
            ))}
            {searchResults.length === 0 && searchTerm && !loading && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No emails found matching "{searchTerm}"
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* User Attachments Section */}
      {user?.id && userAttachments.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Attachments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {userAttachments.slice(0, 6).map((attachment) => (
              <div key={attachment.filename} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <a
                  href={attachment.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm truncate block"
                >
                  {attachment.filename}
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(attachment.createdAt).toLocaleDateString()}
                </p>
                {attachment.size && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(attachment.size)}
                  </p>
                )}
              </div>
            ))}
          </div>
          {userAttachments.length > 6 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Showing 6 of {userAttachments.length} attachments
            </p>
          )}
        </div>
      )}
    </div>
  );
}