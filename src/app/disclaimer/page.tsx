import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Statutory Compliance & Disclaimer
            </h1>
            <p className="text-xs sm:text-sm text-amber-800 mt-1">
              Legal notice regarding SEBI advisory status, Grey Market Premium figures, and broker affiliations.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed shadow-xs">
        <div className="space-y-1.5">
          <h2 className="text-sm font-bold text-slate-900">
            1. Non-SEBI Registered Platform Notice
          </h2>
          <p>
            <strong>IPOAlerts is strictly an analytical and educational platform. We are NOT registered with the Securities and Exchange Board of India (SEBI) as an Investment Adviser or Research Analyst.</strong> Content published on this website does not constitute financial, investment, or trading advice.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-1.5">
          <h2 className="text-sm font-bold text-slate-900">
            2. Grey Market Premium (GMP) Notice
          </h2>
          <p>
            Grey Market Premium (GMP) rates, Kostak numbers, and Subject to Sauda estimates are unofficial street indications. We do not participate in or operate grey market trading. GMP rates do not guarantee listing day returns.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-1.5">
          <h2 className="text-sm font-bold text-slate-900">
            3. Broker Affiliate Disclosure
          </h2>
          <p>
            IPOAlerts may receive referral compensation from regulated brokers (Zerodha, Groww, Angel One) when visitors open Demat accounts through links on this platform. This does not affect the cost to the user.
          </p>
        </div>
      </div>
    </div>
  );
}
