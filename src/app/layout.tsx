import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CookieConsent from '@/components/legal/CookieConsent';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'ToolForge AI - Discover the Best AI Tools',
    template: '%s | ToolForge AI',
  },
  description: 'Discover, compare, and choose the best AI tools for your needs. Comprehensive reviews, pricing info, and honest comparisons.',
  keywords: [
    'ai tools',
    'artificial intelligence',
    'ai software',
    'ai reviews',
    'best ai tools',
    'ai tool directory',
  ],
  authors: [{ name: 'ToolForge Team' }],
  creator: 'ToolForge AI',
  publisher: 'ToolForge AI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'ToolForge AI',
    title: 'ToolForge AI - Discover the Best AI Tools',
    description: 'Discover, compare, and choose the best AI tools for your needs.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ToolForge AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolForge AI - Discover the Best AI Tools',
    description: 'Discover, compare, and choose the best AI tools for your needs.',
    images: ['/og-image.png'],
    creator: '@toolforgeai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
        <CookieConsent />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
