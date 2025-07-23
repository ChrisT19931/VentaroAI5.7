'use client';

// Force all downloads pages to be client-side only
export const dynamic = 'force-dynamic';

export default function DownloadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}