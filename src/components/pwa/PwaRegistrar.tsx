'use client';

import { useEffect } from 'react';

// Extend window interface for PWA prompt capture
declare global {
  interface Window {
    deferredPwaPrompt?: any;
    isPwaInstalled?: boolean;
  }
}

export default function PwaRegistrar() {
  useEffect(() => {
    // 1. Check if running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      window.isPwaInstalled = true;
      window.dispatchEvent(new CustomEvent('pwaAppInstalled'));
    }

    // 2. Automatically register PWA Service Worker on load
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js', { scope: '/' })
          .then((registration) => {
            console.log('[PWA] Service Worker registered with scope:', registration.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      });
    }

    // 3. Intercept and capture beforeinstallprompt (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default mini-infobar from appearing on mobile
      e.preventDefault();
      window.deferredPwaPrompt = e;
      console.log('[PWA] beforeinstallprompt captured and ready');
      // Broadcast to any UI components (banner, modal, navbar button)
      window.dispatchEvent(new CustomEvent('pwaInstallAvailable'));
    };

    // 4. Listen for app installed event
    const handleAppInstalled = () => {
      console.log('[PWA] Application successfully installed to home screen');
      window.deferredPwaPrompt = null;
      window.isPwaInstalled = true;
      window.dispatchEvent(new CustomEvent('pwaAppInstalled'));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return null;
}
