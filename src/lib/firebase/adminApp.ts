import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

export function isFirebaseAdminConfigured(): boolean {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  return Boolean(projectId && clientEmail && privateKey);
}

export function getFirebaseAdminApp(): App | null {
  const apps = getApps();
  if (apps.length > 0 && apps[0]) {
    return apps[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  // Clean up private key if wrapped in extra quotes or accidentally prefixed
  privateKey = privateKey.trim();
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
    privateKey = privateKey.slice(1, -1);
  }
  if (privateKey.includes('"private_key":')) {
    privateKey = privateKey.replace(/"private_key":\s*"?/, '');
  }

  // Handle newline characters in escaped PEM strings
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  try {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (err) {
    console.error('Failed to initialize Firebase Admin SDK:', err);
    return null;
  }
}

export function getAdminMessaging(): Messaging | null {
  const app = getFirebaseAdminApp();
  if (!app) return null;
  try {
    return getMessaging(app);
  } catch (err) {
    console.error('Failed to get Admin Messaging instance:', err);
    return null;
  }
}

export function getAdminFirestore() {
  const app = getFirebaseAdminApp();
  if (!app) return null;
  try {
    const { getFirestore } = require('firebase-admin/firestore');
    return getFirestore(app);
  } catch (err) {
    console.error('Failed to get Admin Firestore instance:', err);
    return null;
  }
}
