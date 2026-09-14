'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Smartphone,
  Zap,
  BellRing,
  HardDrive,
  Download,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function PwaFeatureCard() {
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      window.isPwaInstalled === true;
    setIsStandalone(checkStandalone);
  }, []);

  if (!mounted || isStandalone) {
    return null;
  }

  const handleInstall = () => {
    if (window.deferredPwaPrompt) {
      window.deferredPwaPrompt.prompt();
    } else {
      window.dispatchEvent(new CustomEvent('openPwaInstallModal'));
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
      {/* Decorative ambient gradients */}
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-emerald-500/15 blur-2xl" />

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left column: App Logo & Copy */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 text-left">
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 shadow-xl ring-2 ring-white/20">
            <Image
              src="/icons/icon-192x192.png"
              alt="IPO Alerts App Icon"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/40 mb-2">
              <Zap className="h-3.5 w-3.5" /> 1-Tap Progressive Web App
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Add IPO Alerts to Your Phone Screen
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-indigo-200/90 max-w-xl leading-relaxed">
              <strong className="text-white">No need to download heavy files from app stores!</strong> Just a single tap (<span className="text-emerald-300 font-bold">&lt;1 MB</span>) and the app is ready on your home screen with instant push alerts, live GMP rates & zero storage waste.
            </p>

            {/* Benefit Checkmarks */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> &lt;1 MB Storage
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Instant Push Alerts
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Works Offline
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 100% Free
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Action CTA */}
        <div className="w-full sm:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleInstall}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/25 transition transform active:scale-95 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Add to Phone (1-Tap)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
