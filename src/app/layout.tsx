import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import PublicLayoutShell from '@/components/layout/PublicLayoutShell';
import LiveNotificationListener from '@/components/notifications/LiveNotificationListener';
import FirebaseAnalyticsInit from '@/components/analytics/FirebaseAnalyticsInit';
import PwaRegistrar from '@/components/pwa/PwaRegistrar';
import PwaInstallPrompt from '@/components/pwa/PwaInstallPrompt';
import ScrollToTopButton from '@/components/layout/ScrollToTopButton';
import FirstTimeLanguageModal from '@/components/layout/FirstTimeLanguageModal';
import { LanguageProvider } from '@/context/LanguageContext';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['500', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4f46e5',
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ipoalerts.in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'IPO Alerts — Live GMP Tracker, Subscription Status & Allotments (2026)',
    template: '%s | IPO Alerts',
  },
  description:
    'Track live IPO Grey Market Premium (GMP), real-time bidding subscription status across QIB/NII/Retail, allotment links, and instant push alerts for Indian Mainboard and SME IPOs.',
  keywords: [
    'IPO GMP',
    'Grey Market Premium today',
    'IPO Watch alternative',
    'IPO Subscription Status',
    'IPO Allotment Status Link Intime Kfintech',
    'SME IPO GMP',
    'Upcoming IPO 2026',
    'IPO GMP live tracker',
    'Chittorgarh IPO alternative',
  ],
  authors: [{ name: 'IPOAlerts Intelligence', url: siteUrl }],
  creator: 'IPOAlerts',
  publisher: 'IPOAlerts India',
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
      'hi-IN': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'IPOAlerts',
    title: 'IPO Alerts — Live GMP Tracker, Subscription Status & Allotments (2026)',
    description:
      'Track live IPO Grey Market Premium (GMP), real-time bidding subscription status across QIB/NII/Retail, allotment links, and instant push alerts for Indian Mainboard and SME IPOs.',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'IPOAlerts Logo & Real-time Financial Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'IPO Alerts — Live GMP Tracker & Allotment Odds',
    description:
      'Real-time Indian IPO Grey Market Premium (GMP), live bidding subscription rates, and instant push notifications.',
    images: ['/icons/icon-512x512.png'],
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
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'IPO Alerts',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'IPOAlerts',
        description:
          'Real-time Indian IPO Grey Market Premium (GMP), live bidding subscription rates, and instant push notifications.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: ['en-IN', 'hi-IN'],
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'IPOAlerts',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/icons/icon-512x512.png`,
        },
        sameAs: ['https://t.me/', 'https://whatsapp.com/channel'],
      },
    ],
  };

  return (
    <html lang="en" className={`h-full ${plusJakarta.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-[#f8fafc] text-slate-900 pb-16 sm:pb-0 font-sans">
        <LanguageProvider>
          <FirstTimeLanguageModal />
          <PwaRegistrar />
          <PwaInstallPrompt />
          <ScrollToTopButton />
          <FirebaseAnalyticsInit />
          <LiveNotificationListener />
          <PublicLayoutShell>
            {children}
          </PublicLayoutShell>
        </LanguageProvider>
      </body>
    </html>
  );
}

