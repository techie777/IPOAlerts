'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  ExternalLink, 
  TrendingUp, 
  MessageCircle, 
  Send, 
  Sparkles, 
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-slate-500 text-xs">
      {/* Statutory SEBI Disclaimer */}
      <div className="border-b border-slate-100 bg-amber-50/50 px-4 py-3.5 text-center">
        <div className="mx-auto max-w-5xl flex items-center justify-center gap-2 text-amber-900 font-medium text-xs">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Disclaimer:</strong> {t.disclaimerText}
          </span>
        </div>
      </div>

      {/* Social Media Presence: WhatsApp, Telegram, Instagram, Facebook */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-8 px-4 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-0.5 text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/40 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>Real-Time Market Network</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {t.joinCommunity}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
                {t.communitySubtitle}
              </p>
            </div>

            {/* Social Channels Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto shrink-0">
              {/* WhatsApp */}
              <a
                href="https://whatsapp.com/channel"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 p-3 text-white transition hover:scale-102 group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-xs">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">WhatsApp</div>
                  <div className="text-[10px] text-[#25D366] font-semibold flex items-center gap-0.5">
                    <span>Join Channel</span>
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  </div>
                </div>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-2xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/40 p-3 text-white transition hover:scale-102 group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#229ED9] text-white shadow-xs">
                  <Send className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Telegram</div>
                  <div className="text-[10px] text-[#229ED9] font-semibold flex items-center gap-0.5">
                    <span>50K+ Alerts</span>
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  </div>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-2xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/40 p-3 text-white transition hover:scale-102 group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white shadow-xs">
                  <InstagramIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Instagram</div>
                  <div className="text-[10px] text-pink-400 font-semibold flex items-center gap-0.5">
                    <span>Daily Reels</span>
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  </div>
                </div>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-2xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 p-3 text-white transition hover:scale-102 group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1877F2] text-white shadow-xs">
                  <FacebookIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Facebook</div>
                  <div className="text-[10px] text-[#4294ff] font-semibold flex items-center gap-0.5">
                    <span>Follow Page</span>
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600">
                <TrendingUp className="h-4 w-4 text-white font-bold" />
              </div>
              <span className="text-lg font-black text-slate-900">
                IPO<span className="text-indigo-600">Alerts</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm text-xs">
              Real-time Indian IPO intelligence, live Grey Market Premium (GMP) tracker, subscription monitors, and automated allotment alerts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              IPO Hub
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition">
                  {t.allIpos}
                </Link>
              </li>
              <li>
                <Link href="/gmp" className="hover:text-indigo-600 transition">
                  {t.liveGmp}
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="hover:text-indigo-600 transition">
                  {t.liveSubscription}
                </Link>
              </li>
              <li>
                <Link href="/allotment" className="hover:text-indigo-600 transition">
                  {t.allotmentListed}
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-indigo-600 transition">
                  {t.calendar}
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-indigo-600 transition">
                  Guides & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Trust & Legal
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link href="/privacy-policy" className="hover:text-indigo-600 transition font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="hover:text-indigo-600 transition font-medium">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-indigo-600 transition font-medium">
                  Statutory Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-600 transition">
                  About IPOAlerts
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-600 transition"
                >
                  <span>Sitemap (XML)</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Official Registrars */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Official Registrars
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a
                  href="https://linkintime.co.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-600 transition"
                >
                  <span>Link Intime Allotment</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://ris.kfintech.com/ipostatus/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-600 transition"
                >
                  <span>KFintech Status</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.bigshareonline.com/ipo_Allotment.html"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-600 transition"
                >
                  <span>Bigshare Services</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} IPOAlerts Platform. All rights reserved.</p>
          <p className="mt-1">
            Affiliate Disclosure: Some links on this site are referral links for brokers (Zerodha, Groww). We may receive compensation at zero additional cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
