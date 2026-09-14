'use client';

import React, { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';

interface Props {
  variant?: 'navbar' | 'hero' | 'compact';
  className?: string;
}

export default function PwaInstallButton({ variant = 'navbar', className = '' }: Props) {
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      window.isPwaInstalled === true;
    setIsStandalone(checkStandalone);

    const onInstalled = () => setIsStandalone(true);
    window.addEventListener('pwaAppInstalled', onInstalled);
    return () => window.removeEventListener('pwaAppInstalled', onInstalled);
  }, []);

  if (!mounted || isStandalone) {
    return null;
  }

  const handleClick = () => {
    if (window.deferredPwaPrompt) {
      window.deferredPwaPrompt.prompt();
    } else {
      window.dispatchEvent(new CustomEvent('openPwaInstallModal'));
    }
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1.5 text-xs font-semibold border border-indigo-200/60 transition ${className}`}
        title="Add to phone screen without heavy downloads"
      >
        <Download className="h-3.5 w-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (variant === 'hero') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition active:scale-98 cursor-pointer ${className}`}
      >
        <Smartphone className="h-4 w-4" />
        <span>Install App (1-Tap &bull; &lt;1MB)</span>
      </button>
    );
  }

  // Default: navbar
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`hidden md:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-emerald-50 hover:from-indigo-100 hover:to-emerald-100 text-slate-800 px-3 py-1.5 text-xs font-bold border border-indigo-200/80 shadow-xs transition group ${className}`}
      title="Add IPO Alerts to your phone screen (No heavy download required)"
    >
      <Download className="h-3.5 w-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
      <span>Install App</span>
      <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
        &lt;1MB
      </span>
    </button>
  );
}
