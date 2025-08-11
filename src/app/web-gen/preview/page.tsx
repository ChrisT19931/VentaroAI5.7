'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface GeneratedWebsite {
  html: string;
  css: string;
  projectName: string;
}

export default function WebGenPreviewPage() {
  const router = useRouter();
  const [website, setWebsite] = useState<GeneratedWebsite | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css'>('preview');
  const [copied, setCopied] = useState<'html' | 'css' | null>(null);

  useEffect(() => {
    // Get the generated website from localStorage
    const storedWebsite = localStorage.getItem('generatedWebsite');
    if (!storedWebsite) {
      toast.error('No generated website found');
      router.push('/web-gen/form');
      return;
    }

    try {
      const parsedWebsite = JSON.parse(storedWebsite) as GeneratedWebsite;
      setWebsite(parsedWebsite);
    } catch (error) {
      toast.error('Failed to load generated website');
      router.push('/web-gen/form');
    }
  }, [router]);

  const copyToClipboard = async (type: 'html' | 'css') => {
    if (!website) return;
    
    const content = type === 'html' ? website.html : website.css;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      toast.success(`${type.toUpperCase()} copied to clipboard`);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadFile = (type: 'html' | 'css') => {
    if (!website) return;
    
    const content = type === 'html' ? website.html : website.css;
    const fileName = type === 'html' ? 'index.html' : 'styles.css';
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`${fileName} downloaded`);
  };

  const downloadZip = async () => {
    if (!website) return;
    
    try {
      // This is a simple implementation. In a real app, you might want to use a library like JSZip
      // For now, we'll just download the files separately
      downloadFile('html');
      setTimeout(() => downloadFile('css'), 500);
      
      toast.success('Files downloaded');
    } catch (error) {
      toast.error('Failed to download files');
    }
  };

  if (!website) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading your generated website...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              {website.projectName}
            </h1>
            <p className="text-gray-400 mt-1">Your AI-generated website is ready!</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <button 
              onClick={() => router.push('/web-gen/form')} 
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              Create New Website
            </button>
            
            <button 
              onClick={downloadZip} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Files
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-gray-800 rounded-t-xl overflow-hidden border-t border-l border-r border-gray-700">
          <div className="flex border-b border-gray-700">
            <button 
              onClick={() => setActiveTab('preview')} 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              Preview
            </button>
            <button 
              onClick={() => setActiveTab('html')} 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'html' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              HTML
            </button>
            <button 
              onClick={() => setActiveTab('css')} 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'css' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              CSS
            </button>
          </div>
          
          {/* Tab content */}
          <div className="p-0">
            {activeTab === 'preview' && (
              <div className="bg-white rounded-b-xl overflow-hidden">
                <iframe 
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>${website.css}</style>
                      </head>
                      <body>${website.html}</body>
                    </html>
                  `}
                  className="w-full h-[600px] border-0"
                  title="Generated Website Preview"
                />
              </div>
            )}
            
            {activeTab === 'html' && (
              <div className="relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button 
                    onClick={() => copyToClipboard('html')} 
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                  >
                    {copied === 'html' ? 'Copied!' : 'Copy'}
                  </button>
                  <button 
                    onClick={() => downloadFile('html')} 
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                  >
                    Download
                  </button>
                </div>
                <pre className="bg-gray-900 p-4 rounded-b-xl overflow-x-auto text-gray-300 text-sm h-[600px] overflow-y-auto">
                  {website.html}
                </pre>
              </div>
            )}
            
            {activeTab === 'css' && (
              <div className="relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button 
                    onClick={() => copyToClipboard('css')} 
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                  >
                    {copied === 'css' ? 'Copied!' : 'Copy'}
                  </button>
                  <button 
                    onClick={() => downloadFile('css')} 
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                  >
                    Download
                  </button>
                </div>
                <pre className="bg-gray-900 p-4 rounded-b-xl overflow-x-auto text-gray-300 text-sm h-[600px] overflow-y-auto">
                  {website.css}
                </pre>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Need help with your website? Contact our support team at <a href="mailto:chris.t@ventarosales.com" className="text-blue-400 hover:underline">chris.t@ventarosales.com</a></p>
        </div>
      </div>
    </div>
  );
}