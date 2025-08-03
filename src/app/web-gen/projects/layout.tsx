import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Web Projects - Ventaro',
  description: 'Manage your web projects created with Ventaro Web Generator',
};

export default function WebGenProjectsLayout({
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