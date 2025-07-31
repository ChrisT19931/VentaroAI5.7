import React from 'react';

interface DownloadEbookProps {
  productInfo: {
    name: string;
    fileName: string;
    fileSize: string;
  };
  handleDownload: () => void;
}

const DownloadEbook: React.FC<DownloadEbookProps> = ({ productInfo, handleDownload }) => {
  return (
    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">📖 Your E-Book</h2>
      <div className="bg-white/10 rounded-lg p-4 border border-blue-500/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium text-white">{productInfo.name}</p>
            <p className="text-sm text-gray-300">{productInfo.fileSize}</p>
          </div>
          <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <button 
          onClick={handleDownload}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Download E-Book Now
        </button>
      </div>
      
      <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/20">
        <h3 className="text-md font-semibold text-white mb-2">How to Use This E-Book</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Open the PDF file with any PDF reader</li>
          <li>• Bookmark important sections for quick reference</li>
          <li>• Follow the step-by-step guides for best results</li>
          <li>• Implement the strategies at your own pace</li>
        </ul>
      </div>
    </div>
  );
};

export default DownloadEbook;