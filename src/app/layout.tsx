import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter, Literata, Black_Ops_One } from 'next/font/google';
import { DocsLayout } from '@/components/DocsLayout';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const literata = Literata({
  variable: '--font-literata',
  subsets: ['latin'],
});

const blackOpsOne = Black_Ops_One({
  variable: '--font-black-ops-one',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: {
    default: 'Docs — Esy',
    template: '%s — Esy Docs',
  },
  description:
    'API, runtime, and workflow reference for Esy — the platform for producing high-quality, reviewable artifacts.',
  metadataBase: new URL('https://docs.esy.com'),
  openGraph: {
    siteName: 'Esy Docs',
    title: 'Docs — Esy',
    description:
      'API, runtime, and workflow reference for Esy — the platform for producing high-quality, reviewable artifacts.',
    url: 'https://docs.esy.com',
    type: 'website',
  },
  icons: {
    icon: '/images/favicon/favicon.svg',
    shortcut: '/images/favicon/favicon.svg',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${literata.variable} ${blackOpsOne.variable}`}>
        <DocsLayout>{children}</DocsLayout>
      </body>
    </html>
  );
}
