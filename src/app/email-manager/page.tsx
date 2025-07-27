import { Metadata } from 'next';
import EmailManagerComponent from '@/components/EmailManagerPage';

// Force dynamic rendering to avoid prerendering issues with client components using useAuth
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Email Manager | Ventaro Digital Store',
  description: 'Upload, manage, and search through your email logs with secure cloud storage. Organize email attachments and maintain a comprehensive email history.',
  keywords: 'email, management, logs, attachments, storage, search'
};

export default function EmailManagerPage() {
  return <EmailManagerComponent />;
}