import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web Generator (Beta) - Ventaro AI',
  description: 'Create and customize your website using our drag-and-drop editor.',
};

export default function WebGenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="web-gen-layout">
      {children}
    </div>
  );
}