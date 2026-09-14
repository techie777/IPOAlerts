import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ExternalLink, Send, TrendingUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-slate-500 text-xs">
      {/* Statutory SEBI Disclaimer */}
      <div className="border-b border-slate-100 bg-amber-50/50 px-4 py-3.5 text-center">
        <div className="mx-auto max-w-5xl flex items-center justify-center gap-2 text-amber-900 font-medium text-xs">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Disclaimer:</strong> We are <u>NOT</u> a SEBI Registered Advisory. Grey Market Premium (GMP) numbers are unofficial street indications published for educational/informational purposes only.
          </span>
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
            <div className="pt-1">
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-50 px-3.5 py-1.5 font-bold text-cyan-700 hover:bg-cyan-100 border border-cyan-200 transition"
              >
                <Send className="h-3.5 w-3.5 text-cyan-600" />
                <span>Join Telegram Alerts (50k+ Investors)</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              IPO Hub
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition">
                  Upcoming IPOs 2026
                </Link>
              </li>
              <li>
                <Link href="/gmp" className="hover:text-indigo-600 transition">
                  Today&apos;s Live GMP
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="hover:text-indigo-600 transition">
                  Live Subscription Status
                </Link>
              </li>
              <li>
                <Link href="/allotment" className="hover:text-indigo-600 transition">
                  Allotment Status Check
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-indigo-600 transition">
                  IPO Calendar
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-indigo-600 transition">
                  Guides & FAQs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-600 transition">
                  About Intelligence Desk
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 transition">
                  Contact Desk & Feedback
                </Link>
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
              <li>
                <Link href="/disclaimer" className="hover:text-indigo-600 transition">
                  Terms & Compliance
                </Link>
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
