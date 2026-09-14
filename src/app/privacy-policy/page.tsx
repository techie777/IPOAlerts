import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Bell, Eye, Database, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — IPOAlerts Data Protection & Privacy Rights',
  description:
    'Read the IPOAlerts Privacy Policy. Understand how we collect, handle, and protect user data under the Indian Digital Personal Data Protection (DPDP) Act 2023.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 14, 2026';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Hero Banner */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-tr from-indigo-50/70 via-white to-indigo-50/30 p-6 sm:p-10 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100/80 px-2.5 py-0.5 text-[11px] font-bold text-indigo-800 mb-2">
              <span>DPDP Act 2023 Compliant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Privacy Policy
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Last updated: <span className="font-semibold text-slate-800">{lastUpdated}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Legal Content Container */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Lock className="h-4 w-4 text-indigo-600" />
            <h2>1. Introduction & Overview</h2>
          </div>
          <p>
            Welcome to <strong>IPOAlerts</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). We are dedicated to safeguarding your personal data and ensuring transparency in how we operate. This Privacy Policy details our practices concerning the collection, storage, and processing of information when you access our website, Progressive Web Application (PWA), and real-time push notification services.
          </p>
          <p>
            By accessing or using our platform, you acknowledge that you have read, understood, and agreed to the practices described in this document.
          </p>
        </section>

        {/* Section 2 */}
        <section className="border-t border-slate-100 pt-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Database className="h-4 w-4 text-indigo-600" />
            <h2>2. Information We Collect</h2>
          </div>
          <p>
            We collect minimal information necessary to deliver real-time financial tracking, push alerts, and personalized experiences:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-indigo-600">
            <li>
              <strong>Account Information:</strong> When you register or sign in using email or social authentication (e.g., Google Firebase Auth), we receive your display name, email address, and authentication tokens. We do not store passwords in plain text.
            </li>
            <li>
              <strong>Device & Push Notification Tokens:</strong> If you grant permission to receive real-time push notifications, we store a cryptographic device subscription token (via Firebase Cloud Messaging or Web Push Protocol) to dispatch GMP updates, bidding milestones, and allotment alerts.
            </li>
            <li>
              <strong>User Preferences:</strong> Your language preference (English/Hindi), notification category toggles (Mainboard, SME, Daily GMP, Allotment Alerts), and bookmark selections are stored locally on your device via HTML5 LocalStorage.
            </li>
            <li>
              <strong>Analytical & Log Information:</strong> We log non-personally identifiable diagnostic data such as browser user-agent, operating system, IP address, and page interaction timestamps for security, fraud prevention, and performance metrics.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="border-t border-slate-100 pt-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Bell className="h-4 w-4 text-indigo-600" />
            <h2>3. Real-Time Web Push Notifications</h2>
          </div>
          <p>
            Our web push service delivers time-critical Indian stock market and IPO updates (e.g., subscription spikes, GMP rate revisions, and registrar allotment status).
          </p>
          <ul className="list-disc pl-5 space-y-1 marker:text-indigo-600">
            <li>Notifications require your explicit, affirmative browser permission.</li>
            <li>We do not share your device push token with third parties for marketing purposes.</li>
            <li>You can modify your alert preferences or revoke permission anytime via our Notification Settings modal or directly within your browser site settings.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="border-t border-slate-100 pt-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Eye className="h-4 w-4 text-indigo-600" />
            <h2>4. Cookies & Local Browser Storage</h2>
          </div>
          <p>
            IPOAlerts utilizes essential cookies and local browser storage (LocalStorage) to maintain session continuity, preserve your preferred language (English or Hindi), and remember dismissed banners without requiring repeated prompts.
          </p>
          <p>
            We may utilize Google Analytics and Firebase Analytics to assess aggregated traffic trends. You may disable cookies via browser settings, though doing so may impact interface customization.
          </p>
        </section>

        {/* Section 5 */}
        <section className="border-t border-slate-100 pt-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <FileText className="h-4 w-4 text-indigo-600" />
            <h2>5. Third-Party Links & Broker Affiliates</h2>
          </div>
          <p>
            Our website provides links to external entities, including official IPO registrar websites (Link Intime, KFintech, Bigshare Services) and SEBI-registered stockbrokers (Zerodha, Groww, Angel One). We are not responsible for the privacy practices, content, or terms of third-party portals.
          </p>
        </section>

        {/* Section 6 */}
        <section className="border-t border-slate-100 pt-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <CheckCircle2 className="h-4 w-4 text-indigo-600" />
            <h2>6. Your Rights Under the DPDP Act 2023</h2>
          </div>
          <p>
            In accordance with India&apos;s Digital Personal Data Protection (DPDP) Act 2023, you retain the following rights:
          </p>
          <ul className="list-disc pl-5 space-y-1 marker:text-indigo-600">
            <li>The right to access a summary of personal data held about you.</li>
            <li>The right to correction and erasure of your personal data.</li>
            <li>The right to withdraw consent for notifications or data processing at any time.</li>
            <li>The right of grievance redressal.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="border-t border-slate-100 pt-6 space-y-2">
          <h2 className="text-slate-900 font-bold text-base">7. Contact & Grievance Officer</h2>
          <p>
            For privacy inquiries, data deletion requests, or grievance redressal, please contact our Data Protection representative:
          </p>
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 mt-2 space-y-1">
            <div className="font-bold text-slate-800">Grievance Officer: Legal & Data Privacy Cell</div>
            <div>Email: <a href="mailto:privacy@ipoalerts.in" className="text-indigo-600 hover:underline font-semibold">privacy@ipoalerts.in</a></div>
            <div>Platform: IPOAlerts Intelligence, India</div>
          </div>
        </section>

        {/* Navigation to Terms */}
        <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <Link href="/terms-of-use" className="text-indigo-600 font-bold hover:underline">
            &larr; View Terms of Use
          </Link>
          <Link href="/disclaimer" className="text-indigo-600 font-bold hover:underline">
            View Statutory Disclaimer &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
