'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-xl bg-slate-100/90 border border-slate-200/90 p-0.5 text-xs font-bold ${className}`}
      title="Switch Language / भाषा बदलें"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-lg transition ${
          language === 'en'
            ? 'bg-white text-indigo-700 shadow-xs'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`px-2 py-1 rounded-lg transition flex items-center gap-1 ${
          language === 'hi'
            ? 'bg-white text-indigo-700 shadow-xs'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span>हिंदी</span>
      </button>
    </div>
  );
}
