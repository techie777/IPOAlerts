'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  CheckCircle2,
  AlertCircle,
  Share,
  SlidersHorizontal,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';
import {
  requestNotificationPermission,
  unsubscribePushNotifications,
  getNotificationSupport,
  getStoredSubscriptionStatus,
  NotificationPermissionStatus,
} from '@/lib/firebase/requestNotificationPermission';

interface Props {
  onOpenPreferences?: () => void;
  className?: string;
}

export default function PushNotificationBanner({ onOpenPreferences, className = '' }: Props) {
  const [mounted, setMounted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<NotificationPermissionStatus>('default');
  const [showIosTip, setShowIosTip] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const { isSubscribed: savedSub } = getStoredSubscriptionStatus();
    setIsSubscribed(savedSub);

    const support = getNotificationSupport();
    setStatus(support.permission);
    if (support.iosPwaRequired) {
      setShowIosTip(true);
    }
  }, []);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const result = await requestNotificationPermission();
      setStatus(result.status);

      if (result.success) {
        setIsSubscribed(true);
        showToast('🔔 Push alerts activated successfully!');
      } else if (result.status === 'denied') {
        showToast('Notifications blocked — enable in browser settings.');
      } else if (result.status === 'ios_pwa_required') {
        setShowIosTip(true);
      } else if (result.message) {
        showToast(result.message);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not enable notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const success = await unsubscribePushNotifications();
      if (success) {
        setIsSubscribed(false);
        showToast('Notifications turned off.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  // If visitor denied permission, show a small discreet note instead of nagging
  if (status === 'denied') {
    return (
      <div
        className={`rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-800 flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Notifications blocked:</strong> Enable in your browser or site settings to
            receive instant IPO bidding and allotment alerts.
          </span>
        </div>
      </div>
    );
  }

  // iOS Safari tip when not installed as PWA
  if (showIosTip) {
    return (
      <div
        className={`rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-sky-50 p-3.5 text-xs text-indigo-900 shadow-xs flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Share className="h-3.5 w-3.5" />
          </div>
          <p className="leading-snug">
            <strong>iPhone User?</strong> Apple requires adding this site to your Home Screen: tap{' '}
            <span className="inline-flex items-center font-bold">Share (⎋)</span> then{' '}
            <span className="font-bold">&quot;Add to Home Screen&quot;</span> to receive free push alerts.
          </p>
        </div>
        <button
          onClick={() => setShowIosTip(false)}
          className="text-slate-400 hover:text-slate-600 p-1"
          aria-label="Dismiss iOS tip"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (bannerDismissed && !isSubscribed) {
    return null;
  }

  return (
    <aside
      aria-label="IPO Push Notifications"
      className={`relative overflow-hidden rounded-3xl border transition-all ${
        isSubscribed
          ? 'border-emerald-200 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-white'
          : 'border-indigo-200/90 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-md'
      } p-4 sm:p-5 ${className}`}
    >
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="absolute top-2 right-2 sm:right-4 z-20 rounded-xl bg-slate-900 text-white text-xs px-3.5 py-1.5 shadow-lg flex items-center gap-1.5 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Icon & Headline */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              isSubscribed
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-indigo-500/30 text-white border border-indigo-400/30'
            }`}
          >
            {isSubscribed ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <BellRing className="h-6 w-6 animate-pulse" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`text-sm sm:text-base font-bold ${
                  isSubscribed ? 'text-slate-900' : 'text-white'
                }`}
              >
                {isSubscribed
                  ? '🔔 Notifications Active — You will receive instant IPO alerts'
                  : '🔔 Notify me about new IPOs'}
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSubscribed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-indigo-500/40 text-indigo-100'
                }`}
              >
                100% Free
              </span>
            </div>
            <p
              className={`mt-0.5 text-xs ${
                isSubscribed ? 'text-slate-600' : 'text-indigo-200'
              }`}
            >
              {isSubscribed
                ? 'Alerts configured for live bidding opening, price bands, GMP surges, and registrar allotments.'
                : 'Get notified the moment a new IPO opens, price bands are announced, or allotment results are out.'}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {isSubscribed ? (
            <>
              {onOpenPreferences && (
                <button
                  type="button"
                  onClick={onOpenPreferences}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Customize</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleUnsubscribe}
                disabled={isLoading}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span>Turn off</span>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold shadow-sm transition active:scale-98"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    <span>Enabling...</span>
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 text-indigo-600" />
                    <span>🔔 Notify me about new IPOs</span>
                  </>
                )}
              </button>

              {!bannerDismissed && (
                <button
                  type="button"
                  onClick={() => setBannerDismissed(true)}
                  className="p-1.5 rounded-xl text-indigo-300 hover:text-white hover:bg-white/10 transition"
                  title="Dismiss for this session"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
