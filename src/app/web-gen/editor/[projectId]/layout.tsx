import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web Editor - Ventaro',
  description: 'Create and edit your web projects with Ventaro Web Generator',
};

export default function WebGenEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}