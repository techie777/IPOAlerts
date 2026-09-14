import { getToken, deleteToken } from 'firebase/messaging';
import { getClientMessaging, getClientFirebaseConfig, isFirebaseConfigured } from './clientApp';

export type NotificationPermissionStatus =
  | 'default'
  | 'granted'
  | 'denied'
  | 'unsupported'
  | 'ios_pwa_required';

export interface SubscriptionResult {
  success: boolean;
  status: NotificationPermissionStatus;
  token?: string;
  message?: string;
}

const LOCAL_STORAGE_TOKEN_KEY = 'ipo_fcm_token';
const LOCAL_STORAGE_SUBSCRIBED_KEY = 'ipo_notifications_subscribed';

/**
 * Detects if the current visitor is on an iOS device (iPhone/iPad/iPod).
 */
export function isIosDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return (
    /iphone|ipad|ipod/.test(userAgent) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
  );
}

/**
 * Detects if the web app is running in Standalone PWA mode (required for Web Push on iOS).
 */
export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

/**
 * Checks if current browser environment supports notifications.
 */
export function getNotificationSupport(): {
  supported: boolean;
  iosPwaRequired: boolean;
  permission: NotificationPermissionStatus;
} {
  if (typeof window === 'undefined') {
    return { supported: false, iosPwaRequired: false, permission: 'unsupported' };
  }

  const isIos = isIosDevice();
  const isPwa = isStandalonePwa();

  if (isIos && !isPwa) {
    return {
      supported: false,
      iosPwaRequired: true,
      permission: 'ios_pwa_required',
    };
  }

  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    return { supported: false, iosPwaRequired: false, permission: 'unsupported' };
  }

  return {
    supported: true,
    iosPwaRequired: false,
    permission: Notification.permission as NotificationPermissionStatus,
  };
}

/**
 * Checks if the user is currently subscribed according to local storage.
 */
export function getStoredSubscriptionStatus(): { isSubscribed: boolean; token: string | null } {
  if (typeof window === 'undefined') {
    return { isSubscribed: false, token: null };
  }
  const isSubscribed = localStorage.getItem(LOCAL_STORAGE_SUBSCRIBED_KEY) === 'true';
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  return { isSubscribed: isSubscribed && !!token, token };
}

/**
 * Request browser notification permission and retrieve FCM Web Push token.
 */
export async function requestNotificationPermission(options?: {
  preferences?: Record<string, unknown>;
  topics?: string[];
}): Promise<SubscriptionResult> {
  const support = getNotificationSupport();

  if (support.iosPwaRequired) {
    return {
      success: false,
      status: 'ios_pwa_required',
      message: 'On iPhone, tap Share (⎋) → "Add to Home Screen" to enable push alerts.',
    };
  }

  if (!support.supported) {
    return {
      success: false,
      status: 'unsupported',
      message: 'Push notifications are not supported in this browser.',
    };
  }

  // If already denied, do not nag
  if (Notification.permission === 'denied') {
    return {
      success: false,
      status: 'denied',
      message: 'Notifications blocked — enable in browser settings',
    };
  }

  try {
    // Request permission from the user
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      return {
        success: false,
        status: 'denied',
        message: 'Notifications blocked — enable in browser settings',
      };
    }

    const config = getClientFirebaseConfig();

    // In local development or demo without credentials, simulate a successful token flow
    if (!isFirebaseConfigured() || !config.vapidKey) {
      const demoToken = 'demo-fcm-token-' + Date.now();
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, demoToken);
      localStorage.setItem(LOCAL_STORAGE_SUBSCRIBED_KEY, 'true');

      // Send to backend store
      await fetch('/api/save-notification-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: demoToken,
          preferences: options?.preferences,
          topics: options?.topics,
          isDemo: true,
        }),
      }).catch((e) => console.warn('Demo token save network warning:', e));

      return {
        success: true,
        status: 'granted',
        token: demoToken,
        message: 'Push alerts enabled (Demo Mode: Add Firebase credentials to .env.local for live pushes)',
      };
    }

    // Register service worker with query params to pass config dynamically
    const swUrl = `/firebase-messaging-sw.js?apiKey=${encodeURIComponent(
      config.apiKey
    )}&projectId=${encodeURIComponent(config.projectId)}&messagingSenderId=${encodeURIComponent(
      config.messagingSenderId
    )}&appId=${encodeURIComponent(config.appId)}&authDomain=${encodeURIComponent(
      config.authDomain
    )}&storageBucket=${encodeURIComponent(config.storageBucket || '')}`;

    const registration = await navigator.serviceWorker.register(swUrl, { scope: '/' });
    await navigator.serviceWorker.ready;

    const messaging = await getClientMessaging();
    if (!messaging) {
      throw new Error('Failed to obtain Firebase Messaging instance.');
    }

    const token = await getToken(messaging, {
      vapidKey: config.vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      throw new Error('No registration token available.');
    }

    // Persist token in local storage
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    localStorage.setItem(LOCAL_STORAGE_SUBSCRIBED_KEY, 'true');

    // Save token to database via backend API
    const response = await fetch('/api/save-notification-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        preferences: options?.preferences,
        topics: options?.topics,
        userAgent: navigator.userAgent,
      }),
    });

    if (!response.ok) {
      console.warn('API returned non-200 while saving token');
    }

    return {
      success: true,
      status: 'granted',
      token,
      message: 'Subscribed to IPO alerts successfully!',
    };
  } catch (err: unknown) {
    console.error('Error during notification subscription:', err);
    const errorMessage = err instanceof Error ? err.message : 'Subscription failed';
    return {
      success: false,
      status: (Notification.permission as NotificationPermissionStatus) || 'default',
      message: errorMessage,
    };
  }
}

/**
 * Turn off push notifications (unsubscribe).
 */
export async function unsubscribePushNotifications(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const { token } = getStoredSubscriptionStatus();

  try {
    if (token) {
      // Remove token from backend database
      await fetch('/api/save-notification-token', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      }).catch((e) => console.warn('Failed to delete token on backend:', e));

      // Attempt to delete token from FCM if messaging is active
      try {
        const messaging = await getClientMessaging();
        if (messaging) {
          await deleteToken(messaging);
        }
      } catch (err) {
        console.warn('Could not delete FCM client token:', err);
      }
    }

    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.setItem(LOCAL_STORAGE_SUBSCRIBED_KEY, 'false');
    return true;
  } catch (err) {
    console.error('Error unsubscribing:', err);
    return false;
  }
}
