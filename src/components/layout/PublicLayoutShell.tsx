'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import TickerStrip from '@/components/layout/TickerStrip';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    // Pure standalone Admin Command Center - zero consumer header, ticker, footer, or bottom nav!
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <TickerStrip />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
