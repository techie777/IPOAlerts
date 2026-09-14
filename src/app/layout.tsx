import type { Metadata, Viewport } from 'next';
import './globals.css';
import PublicLayoutShell from '@/components/layout/PublicLayoutShell';
import LiveNotificationListener from '@/components/notifications/LiveNotificationListener';
import FirebaseAnalyticsInit from '@/components/analytics/FirebaseAnalyticsInit';
import PwaRegistrar from '@/components/pwa/PwaRegistrar';
import PwaInstallPrompt from '@/components/pwa/PwaInstallPrompt';
import ScrollToTopButton from '@/components/layout/ScrollToTopButton';
import { LanguageProvider } from '@/context/LanguageContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#4f46e5',
};

export const metadata: Metadata = {
  title: 'IPO Alerts — Live GMP Tracker, Subscription Status & Allotments (2026)',
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
  ],
  authors: [{ name: 'IPOAlerts Intelligence' }],
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
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-[#f8fafc] text-slate-900 pb-16 sm:pb-0">
        <LanguageProvider>
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

