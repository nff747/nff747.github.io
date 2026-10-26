import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'iKi // WebGPU & Distributed Systems Architect',
  description: 'Production WebGPU 3D graphics engines, lock-free Rust distributed storage, and zero-GC browser neural runtimes. Architecting low-latency graphics and compute.',
  keywords: [
    'WebGPU',
    'WGSL',
    'Rust',
    '3D Gaussian Splatting',
    'Distributed Systems',
    'Lock-Free Storage',
    'WebGL',
    'Systems Engineering',
  ],
  authors: [{ name: 'iKi / nff747', url: 'https://github.com/nff747' }],
  openGraph: {
    title: 'iKi // WebGPU & Distributed Systems Architect',
    description: 'Production WebGPU 3D graphics engines, lock-free Rust distributed storage, and zero-GC browser neural runtimes.',
    url: 'https://nff747.github.io',
    siteName: 'iKi Systems Matrix',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iKi // WebGPU & Distributed Systems Architect',
    description: 'Production WebGPU 3D graphics engines, lock-free Rust distributed storage, and zero-GC browser neural runtimes.',
  },
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
