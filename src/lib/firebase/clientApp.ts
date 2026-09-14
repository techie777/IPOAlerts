import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getMessaging, isSupported, Messaging } from 'firebase/messaging';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  vapidKey: string;
}

export function getClientFirebaseConfig(): FirebaseClientConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '',
  };
}

export function isFirebaseConfigured(): boolean {
  const config = getClientFirebaseConfig();
  return Boolean(config.apiKey && config.projectId && config.messagingSenderId && config.appId);
}

let app: FirebaseApp | null = null;
let messagingPromise: Promise<Messaging | null> | null = null;

export function getClientFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;

  const config = getClientFirebaseConfig();
  if (!config.apiKey || !config.projectId) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  app = initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    ...(config.measurementId ? { measurementId: config.measurementId } : {}),
  });

  return app;
}

export async function getClientAnalytics() {
  if (typeof window === 'undefined') return null;

  try {
    const { getAnalytics, isSupported: isAnalyticsSupported } = await import('firebase/analytics');
    const supported = await isAnalyticsSupported();
    if (!supported) return null;

    const clientApp = getClientFirebaseApp();
    if (!clientApp) return null;

    return getAnalytics(clientApp);
  } catch (err) {
    console.warn('Failed to initialize Firebase Analytics:', err);
    return null;
  }
}

export async function getClientMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;

  if (messagingPromise) {
    return messagingPromise;
  }

  messagingPromise = (async () => {
    try {
      const supported = await isSupported();
      if (!supported) {
        console.warn('Firebase Messaging is not supported in this browser environment.');
        return null;
      }

      const clientApp = getClientFirebaseApp();
      if (!clientApp) {
        return null;
      }

      return getMessaging(clientApp);
    } catch (err) {
      console.warn('Failed to initialize Firebase Messaging:', err);
      return null;
    }
  })();

  return messagingPromise;
}
