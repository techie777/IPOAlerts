'use client';

import React, { useState, useEffect } from 'react';
import {
  BellRing,
  AlertCircle,
  Share,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';
import {
  requestNotificationPermission,
  getNotificationSupport,
  getStoredSubscriptionStatus,
  NotificationPermissionStatus,
} from '@/lib/firebase/requestNotificationPermission';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  onOpenPreferences?: () => void;
  className?: string;
}

export default function PushNotificationBanner({ onOpenPreferences, className = '' }: Props) {
  const { language } = useLanguage();
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

    try {
      if (localStorage.getItem('ipoalerts_notif_banner_dismissed') === '1') {
        setBannerDismissed(true);
      }
    } catch (_) {}

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
        showToast(language === 'hi' ? '🔔 अलर्ट सक्रिय हो गए!' : '🔔 Push alerts activated successfully!');
      } else if (result.status === 'denied') {
        showToast(language === 'hi' ? 'अलर्ट्स ब्लॉक हैं — ब्राउज़र सेटिंग्स में चालू करें।' : 'Notifications blocked — enable in browser settings.');
      } else if (result.status === 'ios_pwa_required') {
        setShowIosTip(true);
      } else if (result.message) {
        showToast(result.message);
      }
    } catch (err) {
      console.error(err);
      showToast(language === 'hi' ? 'अलर्ट चालू नहीं हो सके।' : 'Could not enable notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  // Once subscribed or permission granted: Hide completely! Zero clutter!
  if (isSubscribed || status === 'granted') {
    return feedbackToast ? (
      <div className="fixed top-4 right-4 z-50 rounded-2xl bg-slate-900 text-white text-xs px-4 py-2.5 shadow-xl flex items-center gap-2 animate-in fade-in">
        <Sparkles className="h-4 w-4 text-emerald-400" />
        <span>{feedbackToast}</span>
      </div>
    ) : null;
  }

  // If user dismissed: Don't show
  if (bannerDismissed) return null;

  // If visitor denied permission, show a small discreet note
  if (status === 'denied') {
    return (
      <div
        className={`rounded-2xl border border-amber-200/80 bg-amber-50/70 p-2.5 text-xs text-amber-800 flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <span className="truncate">
            {language === 'hi'
              ? 'अलर्ट ब्लॉक हैं: लाइव जीएमपी और आवंटन सूचना पाने के लिए ब्राउज़र सेटिंग्स में अनुमति दें।'
              : 'Notifications blocked: Enable in site settings for instant GMP & allotment alerts.'}
          </span>
        </div>
        <button
          onClick={() => {
            setBannerDismissed(true);
            try {
              localStorage.setItem('ipoalerts_notif_banner_dismissed', '1');
            } catch (_) {}
          }}
          className="text-amber-600 hover:text-amber-900 p-1"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  // iOS Safari tip when not installed as PWA
  if (showIosTip) {
    return (
      <div
        className={`rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-sky-50 p-2.5 sm:p-3 text-xs text-indigo-900 shadow-2xs flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Share className="h-3 w-3" />
          </div>
          <p className="leading-snug truncate">
            {language === 'hi' ? (
              <span>
                <strong>iPhone यूजर?</strong> शेयर (⎋) दबाएं फिर <strong>&quot;Add to Home Screen&quot;</strong> चुनें।
              </span>
            ) : (
              <span>
                <strong>iPhone User?</strong> Tap Share (⎋) then <strong>&quot;Add to Home Screen&quot;</strong> for push alerts.
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowIosTip(false)}
          className="text-slate-400 hover:text-slate-600 p-1 shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  // Ultra-Clean Modern 1-Line Banner for non-subscribed visitors
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border border-indigo-100/90 bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/50 px-3.5 py-2 text-xs shadow-2xs transition-all ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-2xs">
          <BellRing className="h-3.5 w-3.5 animate-pulse" />
        </div>
        <div className="min-w-0 flex items-center gap-2">
          <p className="text-slate-800 font-bold truncate">
            {language === 'hi'
              ? '🔔 नए IPO, लाइव GMP और आवंटन अलर्ट तुरंत अपने फोन पर पाएं'
              : '🔔 Never miss an IPO: Get real-time GMP surges & allotment alerts'}
          </p>
          <span className="hidden sm:inline-block rounded-md bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[10px] font-extrabold shrink-0">
            100% Free
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={isLoading}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 text-xs shadow-xs transition active:scale-95 cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>...</span>
            </span>
          ) : language === 'hi' ? (
            'अलर्ट्स ऑन करें'
          ) : (
            'Enable Free'
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setBannerDismissed(true);
            try {
              localStorage.setItem('ipoalerts_notif_banner_dismissed', '1');
            } catch (_) {}
          }}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          title="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
