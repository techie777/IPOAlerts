'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Check, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/i18n/translations';

export default function FirstTimeLanguageModal() {
  const { setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>('en');

  useEffect(() => {
    // Avoid interrupting automated audits (Lighthouse / Bot crawlers)
    if (typeof navigator !== 'undefined' && (navigator as any).webdriver) {
      return;
    }

    // Check if user has already chosen language in previous session
    const hasChosen = localStorage.getItem('ipoalerts_lang_selected');
    if (!hasChosen) {
      // Gentle delay for smooth page entry after initial paint
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSelect = (lang: Language) => {
    setSelectedLang(lang);
    setLanguage(lang);
    localStorage.setItem('ipoalerts_lang_selected', 'true');
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleClose = () => {
    localStorage.setItem('ipoalerts_lang_selected', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close language selector"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white shadow-md shadow-indigo-500/20 mb-3">
            <Globe className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
            Choose Your Language
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-indigo-600 mt-0.5">
            अपनी पसंदीदा भाषा चुनें
          </p>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
            Personalize your IPO experience. You can switch anytime later from the top menu (☰).
          </p>
        </div>

        {/* Language Selection Options */}
        <div className="mt-5 space-y-3">
          {/* 1. English Option */}
          <button
            type="button"
            onClick={() => handleSelect('en')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer group ${
              selectedLang === 'en'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100/70 text-indigo-700 font-black text-base group-hover:scale-105 transition-transform shrink-0">
                EN
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900 font-heading">
                    English
                  </span>
                  <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                    Default
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Track live GMP, bids, odds &amp; allotments in English
                </p>
              </div>
            </div>

            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                selectedLang === 'en'
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300 group-hover:border-indigo-400'
              }`}
            >
              {selectedLang === 'en' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </div>
          </button>

          {/* 2. Hindi Option */}
          <button
            type="button"
            onClick={() => handleSelect('hi')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer group ${
              selectedLang === 'hi'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-800 font-black text-base group-hover:scale-105 transition-transform shrink-0">
                अ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900 font-heading">
                    हिंदी (Hindi)
                  </span>
                  <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    लोकप्रिय
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  लाइव जीएमपी, बोली, अलॉटमेंट की पूरी जानकारी हिंदी में
                </p>
              </div>
            </div>

            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                selectedLang === 'hi'
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300 group-hover:border-indigo-400'
              }`}
            >
              {selectedLang === 'hi' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </div>
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            💡 Switch anytime later from the top menu (☰) • किसी भी समय बदलें
          </p>
        </div>
      </div>
    </div>
  );
}
