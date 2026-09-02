import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'iKi // WebGL Performance Architect & Spatial UI Pioneer',
  description: 'Bridging complex GPU architecture with high-converting web experiences. WebGL, WebGPU, browser-native AI memory management, and spatial UI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-void min-h-screen text-slate-200 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
