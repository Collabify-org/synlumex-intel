import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { IntelAI } from '@/components/marketing/intel-ai';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const BASE_URL = 'https://synlumex-intel.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'SYNLUMEX INTEL — Operating System for Project Businesses',
    template: '%s | SYNLUMEX INTEL'
  },

  description:
    'Operating system for project-driven businesses. Connect intake, execution, billing & compliance in one closed loop. AI-powered. 14-day trial.',

  keywords: [
    'project management software',
    'EPC software',
    'construction management',
    'project operating system',
    'BOQ extraction AI',
    'commercial visibility',
    'project compliance software',
    'energy project management',
    'manufacturing project software',
    'mining project software'
  ],

  authors: [{ name: 'SYNLUMEX' }],
  creator: 'SYNLUMEX',
  publisher: 'SYNLUMEX',

  alternates: {
    canonical: BASE_URL
  },

  openGraph: {
    title: 'SYNLUMEX INTEL — Operating System for Project Businesses',
    description:
      'Connect intake, execution, billing, and compliance in one closed loop. AI-powered. Built for EPC, energy, manufacturing, oil & gas, logistics, and mining.',
    url: BASE_URL,
    siteName: 'SYNLUMEX INTEL',
    type: 'website',
    locale: 'en_US'
  },

  twitter: {
    card: 'summary_large_image',
    title: 'SYNLUMEX INTEL',
    description: 'Operating system for project-driven businesses.',
    creator: '@synlumex'
  },

  icons: {
    icon: '/icon',
    apple: '/apple-icon'
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },

  category: 'business software',

  verification: {
    // Add Google Search Console verification code here once you get it
    // google: 'your-verification-code'
  }
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
