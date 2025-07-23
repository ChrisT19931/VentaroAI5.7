import React from 'react';

interface DownloadPromptsProps {
  productInfo: {
    name: string;
    fileName: string;
    fileSize: string;
  };
  handleDownload: () => void;
}

const DownloadPrompts: React.FC<DownloadPromptsProps> = ({ productInfo, handleDownload }) => {
  return (
    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">🔮 Your AI Prompts Collection</h2>
      <div className="bg-white/10 rounded-lg p-4 border border-purple-500/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium text-white">{productInfo.name}</p>
            <p className="text-sm text-gray-300">{productInfo.fileSize}</p>
          </div>
          <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <button 
          onClick={handleDownload}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Download Prompts Now
        </button>
      </div>
      
      <div className="mt-4 p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
        <h3 className="text-md font-semibold text-white mb-2">How to Use These Prompts</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Copy and paste prompts directly into your favorite AI tools</li>
          <li>• Customize prompts by replacing [bracketed text] with your specific details</li>
          <li>• Experiment with different variations for best results</li>
          <li>• Refer to the included guide for advanced prompt techniques</li>
        </ul>
      </div>
    </div>
  );
};

export default DownloadPrompts;