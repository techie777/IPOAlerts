import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, AlertTriangle, BookCheck, FileText, Ban, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use — IPOAlerts User Agreement & Legal Conditions',
  description:
    'Read the Terms of Use for IPOAlerts. Understand the conditions of service, informational disclaimers, and user obligations.',
};

export default function TermsOfUsePage() {
  const lastUpdated = 'September 14, 2026';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Header */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-tr from-indigo-50/70 via-white to-indigo-50/30 p-6 sm:p-10 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100/80 px-2.5 py-0.5 text-[11px] font-bold text-indigo-800 mb-2">
              <span>Standard User Agreement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Terms of Use
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Last updated: <span className="font-semibold text-slate-800">{lastUpdated}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Legal Content */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        
        {/* 1. Acceptance */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <BookCheck className="h-4 w-4 text-indigo-600" />
            <h2>1. Acceptance of Terms</h2>
          </div>
          <p>
            By accessing, browsing, or utilizing <strong>IPOAlerts</strong> (the &quot;Platform&quot;), including our web applications, Progressive Web App (PWA), and notification feeds, you acknowledge that you are bound by these Terms of Use and all applicable laws and regulations of India. If you do not agree with any part of these terms, you are prohibited from using this Platform.
          </p>
        </section>

        {/* 2. Critical Disclaimer */}
        <section className="border-t border-slate-100 pt-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h2>2. Non-Advisory & Educational Platform Notice</h2>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-2 text-amber-900">
            <p className="font-bold">
              IPOAlerts is NOT registered with the Securities and Exchange Board of India (SEBI) as an Investment Adviser (RIA) or Research Analyst (RA).
            </p>
            <p className="text-xs">
              All content, statistics, subscription data, Gray Market Premium (GMP) numbers, and allotment odds calculators provided on this platform are for purely informational, educational, and analytical convenience. Nothing on this website constitutes buy, sell, or subscribe recommendations.
            </p>
          </div>
        </section>

        {/* 3. Grey Market Premium Disclaimer */}
        <section className="border-t border-slate-100 pt-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <h2>3. Grey Market Premium (GMP) Terms</h2>
          </div>
          <p>
            Grey Market Premium (GMP), Kostak rates, and Subject to Sauda (Sauda) rates are unofficial, unregulated estimates derived from market rumors and offline broker communications.
          </p>
          <ul className="list-disc pl-5 space-y-1 marker:text-indigo-600">
            <li>GMP fluctuates continuously based on market dynamics and does not guarantee listing gains.</li>
            <li>We do not operate, facilitate, or trade in any grey market contracts.</li>
            <li>Users are strongly advised to read the Red Herring Prospectus (RHP) filed with SEBI and consult certified financial planners before making investment decisions.</li>
          </ul>
        </section>

        {/* 4. Acceptable Use */}
        <section className="border-t border-slate-100 pt-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Ban className="h-4 w-4 text-rose-600" />
            <h2>4. Prohibited Activities</h2>
          </div>
          <p>When using IPOAlerts, you agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 marker:text-rose-600">
            <li>Engage in automated scraping, data harvesting, or denial-of-service attempts against our endpoints without express written permission.</li>
            <li>Attempt to bypass authentication, reverse-engineer proprietary algorithms, or manipulate subscription counters.</li>
            <li>Use the platform for any illegal purpose or distribute malicious scripts or malware.</li>
          </ul>
        </section>

        {/* 5. Intellectual Property */}
        <section className="border-t border-slate-100 pt-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <FileText className="h-4 w-4 text-indigo-600" />
            <h2>5. Intellectual Property Rights</h2>
          </div>
          <p>
            The software, user interface design, logos, charts, calculators, and curated data representations are the intellectual property of IPOAlerts. Company names, trademarks, and logos referenced on our platform belong to their respective corporate issuers or registrars and are used solely for identification purposes.
          </p>
        </section>

        {/* 6. Limitation of Liability */}
        <section className="border-t border-slate-100 pt-6 space-y-2">
          <h2 className="text-slate-900 font-bold text-base">6. Limitation of Liability</h2>
          <p>
            In no event shall IPOAlerts, its creators, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from investment losses, data errors, network outages, or reliance upon any figures published on this platform.
          </p>
        </section>

        {/* 7. Governing Law */}
        <section className="border-t border-slate-100 pt-6 space-y-2">
          <h2 className="text-slate-900 font-bold text-base">7. Governing Law & Jurisdiction</h2>
          <p>
            These terms shall be governed by and interpreted according to the laws of the Republic of India. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the competent courts in India.
          </p>
        </section>

        {/* Bottom Navigation */}
        <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <Link href="/privacy-policy" className="text-indigo-600 font-bold hover:underline">
            &larr; Read Privacy Policy
          </Link>
          <Link href="/faqs" className="text-indigo-600 font-bold hover:underline">
            Frequently Asked Questions &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
