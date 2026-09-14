'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BellRing, X, ArrowRight, Sparkles } from 'lucide-react';
import {
  subscribeToLiveAlerts,
  LocalNotificationPayload,
} from '@/lib/firebase/localNotificationNotifier';

import { playNotificationSound } from '@/lib/audioNotifier';
import { addAppNotification } from '@/lib/notificationsStore';

export default function LiveNotificationListener() {
  const [activeAlert, setActiveAlert] = useState<LocalNotificationPayload | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToLiveAlerts((payload) => {
      setActiveAlert(payload);
      playNotificationSound();

      // Record in local notifications history
      addAppNotification({
        title: payload.title,
        message: payload.body,
        type: payload.category === 'sme' ? 'newIpo' : 'general',
        category: (payload.category as 'mainboard' | 'sme') || 'general',
        actionUrl: payload.url,
      });

      // Auto-dismiss in-app popup banner after 8 seconds
      const timer = setTimeout(() => {
        setActiveAlert(null);
      }, 8000);
      return () => clearTimeout(timer);
    });

    return () => unsubscribe();
  }, []);

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
