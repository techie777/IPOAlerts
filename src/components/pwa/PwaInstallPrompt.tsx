'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Download,
  Smartphone,
  Zap,
  Bell,
  HardDrive,
  CheckCircle2,
  X,
  Share2,
  PlusSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function PwaInstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [canNativePrompt, setCanNativePrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Check if already running in standalone PWA
    const standaloneCheck =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      window.isPwaInstalled === true;

    setIsStandalone(standaloneCheck);

    // 2. Check iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 3. Check dismissal memory (dismiss for 3 days)
    const dismissedAt = localStorage.getItem('ipoalerts_pwa_dismissed');
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < 3 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }
    }

    // 4. Check if prompt is already captured
    if (window.deferredPwaPrompt) {
      setCanNativePrompt(true);
    }

    // 5. Listeners
    const onInstallAvailable = () => {
      setCanNativePrompt(true);
    };

    const onAppInstalled = () => {
      setIsStandalone(true);
      setInstallSuccess(true);
      setModalOpen(false);
      localStorage.removeItem('ipoalerts_pwa_dismissed');
    };

    const onOpenModal = () => {
      setModalOpen(true);
    };

    window.addEventListener('pwaInstallAvailable', onInstallAvailable);
    window.addEventListener('pwaAppInstalled', onAppInstalled);
    window.addEventListener('openPwaInstallModal', onOpenModal);

    return () => {
      window.removeEventListener('pwaInstallAvailable', onInstallAvailable);
      window.removeEventListener('pwaAppInstalled', onAppInstalled);
      window.removeEventListener('openPwaInstallModal', onOpenModal);
    };
  }, []);

  const handleInstallClick = async () => {
    if (window.deferredPwaPrompt) {
      setIsInstalling(true);
      try {
        const promptEvent = window.deferredPwaPrompt;
        promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted the install prompt');
          setInstallSuccess(true);
          window.deferredPwaPrompt = null;
        } else {
          console.log('[PWA] User dismissed the install prompt');
        }
      } catch (err) {
        console.error('[PWA] Error during prompt execution:', err);
      } finally {
        setIsInstalling(false);
        setModalOpen(false);
      }
    } else {
      // If native prompt is not yet ready or iOS, open instructions modal
      setModalOpen(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('ipoalerts_pwa_dismissed', Date.now().toString());
  };

  if (!mounted || isStandalone) {
    return null;
  }

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* ------------------------------------------------------------- */}
      {/* Short & Simple 1-Line Ambient Install Bar (Mobile & Desktop)   */}
      {/* ------------------------------------------------------------- */}
      {!isDismissed && !modalOpen && (
        <aside
          aria-label="Install IPO Alerts Progressive Web App"
          className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex items-center justify-between gap-2.5 rounded-2xl border border-indigo-500/40 bg-slate-900/95 px-3 py-2 text-white shadow-xl backdrop-blur-md ring-1 ring-white/10">
            {/* App Icon + 1-Line Message */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-xs ring-1 ring-indigo-400/40">
                <Image
                  src="/icons/icon-192x192.png"
                  alt="IPO Alerts"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                  <span className="truncate">Install IPO Alerts</span>
                  <span className="shrink-0 text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded">
                    &lt;1MB
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 truncate">
                  No heavy download &bull; 1-tap add to screen
                </p>
              </div>
            </div>

            {/* Actions: Install Now + Close */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition active:scale-95 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Install Now</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Dismiss banner"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Full Feature Install Benefits Modal                            */}
      {/* ------------------------------------------------------------- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 p-6 sm:p-8 text-white shadow-2xl ring-1 ring-white/10">
            {/* Background Glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-600/20 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-lg ring-2 ring-indigo-400/50">
                  <Image
                    src="/icons/icon-192x192.png"
                    alt="IPO Alerts Logo"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 ring-1 ring-emerald-500/40">
                    <Sparkles className="h-3 w-3" /> Progressive Web App
                  </div>
                  <h2 className="mt-1 text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    Add IPO Alerts to Your Phone
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Core Value Proposition Callout */}
            <div className="relative mt-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/70 to-slate-900/80 p-4">
              <p className="text-sm font-semibold text-indigo-200 leading-relaxed">
                🚀 <strong className="text-white">No need to download heavy files from the app store!</strong> Just a single tap and IPO Alerts is ready to add to your phone screen instantly.
              </p>
            </div>

            {/* Benefit Highlights */}
            <div className="relative mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <HardDrive className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Zero Heavy Downloads (&lt;1MB)</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Save phone memory and mobile data. No 50MB+ installation package required.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Native App Experience</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Opens fullscreen in standalone mode without browser URL bars or clunky controls.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Real-Time Push Alerts</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Get instant notifications on GMP surges, subscription surges, and allotment links.
                  </p>
                </div>
              </div>
            </div>

            {/* Device-Specific Instructions */}
            <div className="relative mt-5">
              {isIos ? (
                /* iOS Safari Instructions */
                <div className="rounded-2xl border border-indigo-400/40 bg-indigo-950/50 p-4 text-xs text-indigo-100 space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Share2 className="h-4 w-4 text-indigo-300" />
                    <span>How to Add on iPhone / iPad (Safari):</span>
                  </div>
                  <ol className="space-y-2 pl-1 list-decimal list-inside text-slate-200">
                    <li>
                      Tap the <strong className="text-white">Share</strong> button (
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 text-blue-400">
                        📤
                      </span>
                      ) at the bottom of Safari.
                    </li>
                    <li>
                      Scroll down and tap <strong className="text-white">&quot;Add to Home Screen&quot;</strong> (
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">
                        ➕
                      </span>
                      ).
                    </li>
                    <li>
                      Tap <strong className="text-white">Add</strong> in the top right corner.
                    </li>
                  </ol>
                  <p className="text-[11px] text-emerald-300 font-semibold pt-1">
                    ✓ Done! IPO Alerts will now appear on your home screen like any native app.
                  </p>
                </div>
              ) : canNativePrompt ? (
                /* Native 1-Tap Prompt for Android & Chrome */
                <button
                  type="button"
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 py-3.5 px-6 text-sm font-extrabold text-white shadow-xl shadow-indigo-600/30 transition transform active:scale-98 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>{isInstalling ? 'Adding to Screen...' : 'Add to Home Screen (1-Tap)'}</span>
                </button>
              ) : (
                /* Generic Android / Desktop Guide */
                <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Smartphone className="h-4 w-4 text-indigo-400" />
                    <span>How to Add on Android (Chrome):</span>
                  </div>
                  <p>
                    Tap the browser menu (<strong>⋮</strong> in top right) and select{' '}
                    <strong className="text-emerald-300">&quot;Add to Home screen&quot;</strong> or{' '}
                    <strong className="text-emerald-300">&quot;Install App&quot;</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Assurance */}
            <div className="relative mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>100% Safe, Secure & Battery-Optimized PWA</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
