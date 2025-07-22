'use client'

import { useState } from 'react'
// Using inline SVG icons instead of Heroicons to avoid dependency issues

interface ProtectedDownloadProps {
  productId: string
  productName: string
  fileName: string
  fileSize: string
  isPurchased?: boolean
}

export default function ProtectedDownload({ 
  productId, 
  productName, 
  fileName, 
  fileSize, 
  isPurchased = false 
}: ProtectedDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!isPurchased) {
      alert('Please complete your purchase to access this download.')
      return
    }

    setIsDownloading(true)
    
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real implementation, this would:
      // 1. Verify purchase status with backend
      // 2. Generate secure download link
      // 3. Track download for analytics
      
      const link = document.createElement('a')
      link.href = `/products/${fileName}`
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again or contact support.')
    } finally {
      setIsDownloading(false)
    }
  }

  if (!isPurchased) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-900">Protected Content</h3>
        </div>
        <p className="text-slate-600 mb-4">
          This content is available after purchase. Complete your order to get instant access to:
        </p>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">{productName}</p>
              <p className="text-sm text-slate-500">{fileSize}</p>
            </div>
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <button 
          className="w-full mt-4 bg-slate-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Purchase Now to Unlock
        </button>
      </div>
    )
  }

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-slate-900">Your Purchase</h3>
      </div>
      <p className="text-slate-600 mb-4">
        Thank you for your purchase! Your content is ready for download:
      </p>
      <div className="bg-white rounded-lg p-4 border border-emerald-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium text-slate-900">{productName}</p>
            <p className="text-sm text-slate-500">{fileSize}</p>
          </div>
          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? 'Downloading...' : 'Download Now'}
        </button>
      </div>
      <div className="mt-4 text-sm text-slate-500">
        <p>• Lifetime access to your purchase</p>
        <p>• Re-download anytime from your account</p>
        <p>• Free updates included</p>
      </div>
    </div>
  )
}