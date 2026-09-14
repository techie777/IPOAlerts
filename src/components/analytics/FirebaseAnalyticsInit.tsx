'use client';

import { useEffect } from 'react';
import { getClientAnalytics } from '@/lib/firebase/clientApp';

export default function FirebaseAnalyticsInit() {
  useEffect(() => {
    getClientAnalytics().catch((err) => {
      console.warn('Firebase Analytics could not be initialized:', err);
    });
  }, []);

  return null;
}
