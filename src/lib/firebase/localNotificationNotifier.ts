/**
 * Client-side notifier and listener for instant in-tab and native browser push alerts
 * Uses Web Notification API + Service Worker showNotification + BroadcastChannel
 */

import { playNotificationSound } from '@/lib/audioNotifier';

export interface LocalNotificationPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  category?: string;
}

const CHANNEL_NAME = 'ipo_live_alerts_channel';

/**
 * Triggers a native system notification if browser permission is granted,
 * and broadcasts to all open tabs of the web application.
 */
export async function triggerBrowserNotification(payload: LocalNotificationPayload): Promise<void> {
  if (typeof window === 'undefined') return;

  // Play crisp notification chime
  playNotificationSound();

  const title = payload.title || '🔔 IPO Alert';
  const options: NotificationOptions = {
    body: payload.body,
    icon: payload.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: { url: payload.url || '/' },
  };

  // 1. Broadcast across browser tabs
  try {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(payload);
      channel.close();
    }
  } catch {}

  // 2. Dispatch in current window
  window.dispatchEvent(new CustomEvent('ipoLiveAlert', { detail: payload }));

  // 3. Show native system notification if permission is granted
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration && 'showNotification' in registration) {
          await registration.showNotification(title, options);
          return;
        }
      }
      // Fallback to Window Notification constructor
      new Notification(title, options);
    } catch (e) {
      console.warn('Could not show native Notification:', e);
    }
  }
}

/**
 * Hook or subscriber for receiving real-time live alert broadcasts in any component.
 */
export function subscribeToLiveAlerts(callback: (payload: LocalNotificationPayload) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  let channel: BroadcastChannel | null = null;

  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data) {
          callback(event.data);
        }
      };
    }
  } catch {}

  const handleCustomEvent = (event: Event) => {
    const custom = event as CustomEvent<LocalNotificationPayload>;
    if (custom.detail) {
      callback(custom.detail);
    }
  };

  window.addEventListener('ipoLiveAlert', handleCustomEvent);

  return () => {
    window.removeEventListener('ipoLiveAlert', handleCustomEvent);
    if (channel) {
      channel.close();
    }
  };
}
