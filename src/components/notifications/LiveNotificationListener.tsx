'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BellRing, X, ArrowRight, Sparkles } from 'lucide-react';
import {
  subscribeToLiveAlerts,
  LocalNotificationPayload,
} from '@/lib/firebase/localNotificationNotifier';
import { getClientMessaging } from '@/lib/firebase/clientApp';
import { playNotificationSound } from '@/lib/audioNotifier';
import { addAppNotification, syncNotificationsFromServer } from '@/lib/notificationsStore';

export default function LiveNotificationListener() {
  const [activeAlert, setActiveAlert] = useState<LocalNotificationPayload | null>(null);

  useEffect(() => {
    // 1. Cross-tab in-browser broadcast channel listener
    const unsubscribeBroadcast = subscribeToLiveAlerts((payload) => {
      triggerPopup(payload);
    });

    // 2. Firebase Cloud Messaging Foreground Push Listener (Active tab)
    let unsubscribeFcm: (() => void) | null = null;
    getClientMessaging()
      .then(async (messaging) => {
        if (!messaging) return;
        try {
          const { onMessage } = await import('firebase/messaging');
          unsubscribeFcm = onMessage(messaging, (payload) => {
            console.log('[FCM] Foreground push message received:', payload);
            const title = payload.notification?.title || payload.data?.title || '🔔 Live IPO Alert';
            const body =
              payload.notification?.body ||
              payload.data?.body ||
              'Important IPO market update available.';
            const url = payload.data?.url || (payload.notification as any)?.click_action || '/';
            const category = payload.data?.category || 'general';

            triggerPopup({
              title,
              body,
              url,
              category,
            });
          });
        } catch (err) {
          console.warn('Could not register onMessage listener:', err);
        }
      })
      .catch((err) => console.warn('getClientMessaging error:', err));

    // 3. Server Poll & Check on Load (ensures alerts pop on Home page even without push permission)
    const checkServerNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications) && data.notifications.length > 0) {
          const latest = data.notifications[0];
          const notifAgeMs = Date.now() - new Date(latest.timestamp).getTime();
          const isRecent = notifAgeMs < 10 * 60 * 1000; // Sent in the last 10 minutes
          const alreadyPopped = sessionStorage.getItem('ipo_popped_' + latest.id);

          if (isRecent && !alreadyPopped) {
            sessionStorage.setItem('ipo_popped_' + latest.id, 'true');
            triggerPopup({
              title: latest.title,
              body: latest.message,
              url: latest.actionUrl || '/',
              category: latest.category,
            });
            syncNotificationsFromServer().catch(() => {});
          }
        }
      } catch (e) {
        // Silently continue
      }
    };

    // Run check on mount
    checkServerNotifications();

    // Periodic check every 15 seconds
    const interval = setInterval(checkServerNotifications, 15000);

    return () => {
      unsubscribeBroadcast();
      if (unsubscribeFcm) unsubscribeFcm();
      clearInterval(interval);
    };
  }, []);

  const triggerPopup = (payload: LocalNotificationPayload) => {
    setActiveAlert(payload);
    playNotificationSound();

    // Record in local user notifications feed
    addAppNotification({
      title: payload.title,
      message: payload.body,
      type: payload.category === 'sme' ? 'newIpo' : 'general',
      category: (payload.category as 'mainboard' | 'sme') || 'general',
      actionUrl: payload.url,
    });

    // Auto-dismiss in-app popup banner after 9 seconds
    setTimeout(() => {
      setActiveAlert(null);
    }, 9000);
  };

  if (!activeAlert) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-bounce-short p-2 pointer-events-auto">
      <div className="rounded-2xl border border-indigo-500/40 bg-slate-950/95 text-white p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white animate-pulse">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Live Market Alert</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">{activeAlert.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeAlert.body}</p>

              {activeAlert.url && (
                <div className="mt-2.5">
                  <Link
                    href={activeAlert.url}
                    onClick={() => setActiveAlert(null)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 underline"
                  >
                    <span>View IPO Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveAlert(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
