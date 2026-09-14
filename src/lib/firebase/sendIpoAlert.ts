import { SendResponse } from 'firebase-admin/messaging';
import { getAdminMessaging, isFirebaseAdminConfigured } from './adminApp';
import {
  getAllSubscribers,
  removeSubscribers,
  SubscriberRecord,
} from '@/data/serverNotificationStore';

export interface IpoAlertPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  tag?: string;
  category?: 'mainboard' | 'sme';
  topic?:
    | 'newIpo'
    | 'priceBand'
    | 'subscription'
    | 'gmpSurge'
    | 'allotment'
    | 'closingReminder'
    | 'broadcast'
    | string;
  customData?: Record<string, string>;
  targetTokens?: string[];
}

export interface SendIpoAlertResult {
  success: boolean;
  totalAttempted: number;
  successCount: number;
  failureCount: number;
  removedTokens: number;
  message: string;
  isDemo?: boolean;
}

/**
 * Filter subscribers based on their specific alert preferences.
 */
function shouldSendToSubscriber(subscriber: SubscriberRecord, alert: IpoAlertPayload): boolean {
  const prefs = subscriber.preferences;
  if (!prefs) return true;

  if (alert.category === 'mainboard' && prefs.mainboardAlerts === false) return false;
  if (alert.category === 'sme' && prefs.smeAlerts === false) return false;
  if (alert.topic === 'gmpSurge' && prefs.gmpSurgeAlerts === false) return false;
  if (alert.topic === 'allotment' && prefs.allotmentOutAlerts === false) return false;
  if (alert.topic === 'closingReminder' && prefs.closingDayAlerts === false) return false;
  if (alert.topic === 'subscription' && prefs.subscriptionAlerts === false) return false;

  return true;
}

/**
 * Reusable server-side function to broadcast an IPO push notification.
 * Handles token fetching, topic filtering, Firebase multicasting, and auto-cleanup of dead tokens.
 */
export async function sendIpoAlert(alert: IpoAlertPayload): Promise<SendIpoAlertResult> {
  const allSubscribers = await getAllSubscribers();

  // If specific tokens provided, use them; otherwise filter all subscribers
  const eligibleSubscribers = alert.targetTokens
    ? allSubscribers.filter((s) => alert.targetTokens!.includes(s.token))
    : allSubscribers.filter((s) => shouldSendToSubscriber(s, alert));

  const tokens = eligibleSubscribers.map((s) => s.token);

  if (tokens.length === 0) {
    return {
      success: true,
      totalAttempted: 0,
      successCount: 0,
      failureCount: 0,
      removedTokens: 0,
      message: 'No eligible subscribers registered for this alert.',
    };
  }

  // If Firebase Admin credentials are not yet configured (e.g. initial setup / demo mode)
  if (!isFirebaseAdminConfigured()) {
    console.info(
      `[sendIpoAlert:DEMO_MODE] Simulated push to ${tokens.length} subscriber(s): "${alert.title}" - "${alert.body}"`
    );
    return {
      success: true,
      totalAttempted: tokens.length,
      successCount: tokens.length,
      failureCount: 0,
      removedTokens: 0,
      isDemo: true,
      message: `Simulated alert sent to ${tokens.length} subscriber(s). (Configure FIREBASE_* env vars for live delivery)`,
    };
  }

  const messaging = getAdminMessaging();
  if (!messaging) {
    return {
      success: false,
      totalAttempted: tokens.length,
      successCount: 0,
      failureCount: tokens.length,
      removedTokens: 0,
      message: 'Firebase Admin messaging initialization failed.',
    };
  }

  const destinationUrl = alert.url || '/';
  const iconUrl = alert.icon || '/icons/icon-192x192.png';
  const tag = alert.tag || `ipo-alert-${Date.now()}`;

  const deadTokens: string[] = [];
  let totalSuccess = 0;
  let totalFailure = 0;

  // Firebase allows up to 500 tokens per sendEachForMulticast call
  const BATCH_SIZE = 500;
  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batchTokens = tokens.slice(i, i + BATCH_SIZE);

    try {
      const response = await messaging.sendEachForMulticast({
        tokens: batchTokens,
        notification: {
          title: alert.title,
          body: alert.body,
        },
        webpush: {
          headers: {
            Urgency: 'high',
            TTL: '86400',
          },
          notification: {
            title: alert.title,
            body: alert.body,
            icon: iconUrl,
            badge: '/icons/badge-72x72.png',
            tag: `${tag}-${Date.now()}`,
            requireInteraction: true,
            renotify: true,
            vibrate: [200, 100, 200],
            data: {
              url: destinationUrl,
              ...alert.customData,
            },
          },
          fcmOptions: {
            link: destinationUrl,
          },
        },
        android: {
          priority: 'high',
          notification: {
            priority: 'max',
            defaultSound: true,
            defaultVibrateTimings: true,
          },
        },
        data: {
          title: alert.title,
          body: alert.body,
          url: destinationUrl,
          category: alert.category || 'all',
          topic: alert.topic || 'general',
          timestamp: Date.now().toString(),
          ...alert.customData,
        },
      });

      totalSuccess += response.successCount;
      totalFailure += response.failureCount;

      // Identify dead / uninstalled / invalid tokens for removal
      response.responses.forEach((resp: SendResponse, index: number) => {
        if (!resp.success && resp.error) {
          const errorCode = resp.error.code;
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered' ||
            errorCode === 'messaging/invalid-argument'
          ) {
            deadTokens.push(batchTokens[index]);
          }
        }
      });
    } catch (batchErr) {
      console.error('Error multicasting notification batch:', batchErr);
      totalFailure += batchTokens.length;
    }
  }

  // Remove invalid/dead tokens from database to avoid repeating failed sends
  let removedCount = 0;
  if (deadTokens.length > 0) {
    removedCount = await removeSubscribers(deadTokens);
    console.info(
      `[sendIpoAlert] Cleaned up ${removedCount} inactive/unregistered token(s) from database.`
    );
  }

  return {
    success: totalSuccess > 0 || tokens.length === 0,
    totalAttempted: tokens.length,
    successCount: totalSuccess,
    failureCount: totalFailure,
    removedTokens: removedCount,
    message: `Alert dispatched: ${totalSuccess} successful, ${totalFailure} failed, ${removedCount} inactive removed.`,
  };
}
