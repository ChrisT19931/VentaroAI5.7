import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Published Website - Ventaro Web Generator',
  description: 'View a published website created with Ventaro Web Generator',
};

export default function PublishedWebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="published-website-container">
      {children}
    </div>
  );
}