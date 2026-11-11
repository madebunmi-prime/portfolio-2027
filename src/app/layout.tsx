import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { JetBrains_Mono, Mona_Sans } from 'next/font/google';
import { content } from '@/content';
import './globals.css';

const mona = Mona_Sans({ subsets: ['latin'], variable: '--font-mona', display: 'swap', axes: ['wdth'] });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', weight: ['500'], display: 'swap' });

const { site } = content;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: 'website',
    url: site.url,
    images: site.ogImage ? [site.ogImage] : undefined,
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
};

export const viewport: Viewport = { themeColor: '#05041a', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.locale} className={`${mona.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
