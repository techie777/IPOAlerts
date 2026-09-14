'use client';

import { useEffect } from 'react';

export default function FirebaseAnalyticsInit() {
  useEffect(() => {
    // Defer analytics initialization until browser is completely idle
    const initAnalytics = () => {
      import('@/lib/firebase/clientApp').then(({ getClientAnalytics }) => {
        getClientAnalytics().catch(() => {});
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initAnalytics, { timeout: 4000 });
    } else {
      setTimeout(initAnalytics, 3000);
    }
  }, []);

  return null;
}
