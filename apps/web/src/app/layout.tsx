import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Indigo Harts - Admin Portal',
  description: 'Cleaning service operations management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-warm-white min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
