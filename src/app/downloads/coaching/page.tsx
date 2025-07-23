'use client';

import dynamicImport from 'next/dynamic';

// Force this page to be client-side only
export const dynamic = 'force-dynamic';

const CoachingContentComponent = dynamicImport(() => import('@/components/downloads/CoachingContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  )
});

export default function CoachingDownloadPage() {
  return <CoachingContentComponent />;
}