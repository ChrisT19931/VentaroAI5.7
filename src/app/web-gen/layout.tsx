import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'AI Website Generator | Ventaro',
  description: 'Generate beautiful, responsive websites with AI in seconds',
};

export default function WebGenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-center" />
      {children}
    </>
  );
}