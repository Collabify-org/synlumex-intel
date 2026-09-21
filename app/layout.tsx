import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { IntelAI } from '@/components/marketing/intel-ai';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'SYNLUMEX INTEL — Operating System for Project Businesses',
  description:
    'Manage projects, money, and compliance in one place. Connect intake, execution, billing, and compliance into one closed loop. AI-powered. Built for EPC, energy, manufacturing, oil & gas, logistics, and mining.',
  metadataBase: new URL('https://synlumex-intel.vercel.app'),
  openGraph: {
    title: 'SYNLUMEX INTEL — Operating System for Project Businesses',
    description:
      'Manage projects, money, and compliance in one place. Connect intake, execution, billing, and compliance into one closed loop.',
    url: 'https://synlumex-intel.vercel.app',
    siteName: 'SYNLUMEX INTEL',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SYNLUMEX INTEL',
    description: 'Operating system for project-driven businesses.'
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon'
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-background font-sans">
        {children}
        <IntelAI />
      </body>
    </html>
  );
}
