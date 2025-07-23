import React from 'react';

interface DownloadCoachingProps {
  productInfo: {
    name: string;
    fileName: string;
    fileSize: string;
  };
}

const DownloadCoaching: React.FC<DownloadCoachingProps> = ({ productInfo }) => {
  return (
    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">🚀 Your Coaching Session</h2>
      <div className="bg-white/10 rounded-lg p-4 border border-green-500/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium text-white">{productInfo.name}</p>
            <p className="text-sm text-gray-300">Booking Confirmation</p>
          </div>
          <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <div className="bg-green-900/30 p-4 rounded-lg mb-4">
          <h3 className="text-white font-medium mb-2">Booking Details</h3>
          <p className="text-gray-300 text-sm mb-1">• Session: 60-minute AI Business Strategy Session</p>
          <p className="text-gray-300 text-sm mb-1">• Purchased: Confirmed</p>
          <p className="text-gray-300 text-sm">• Status: <span className="text-green-400 font-medium">Confirmed</span></p>
        </div>
        
        <a 
          href="https://calendly.com/ventaroai/strategy-session" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors block text-center"
        >
          Schedule Your Session
        </a>
      </div>
      
      <div className="mt-4 p-4 bg-green-900/30 rounded-lg border border-green-500/20">
        <h3 className="text-md font-semibold text-white mb-2">Next Steps</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Click the button above to schedule your session at a convenient time</li>
          <li>• Prepare your business questions and goals for the session</li>
          <li>• Check your email for a calendar invitation after scheduling</li>
          <li>• Join the video call link at your scheduled time</li>
        </ul>
      </div>
    </div>
  );
};

export default DownloadCoaching;