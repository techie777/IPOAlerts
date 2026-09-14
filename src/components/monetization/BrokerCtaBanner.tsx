import React from 'react';
import { ExternalLink, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  variant?: 'compact' | 'full' | 'inline';
  companyName?: string;
}

export default function BrokerCtaBanner({ variant = 'full', companyName }: Props) {
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600" />
          <span className="text-slate-700 font-medium">
            Apply {companyName ? `for ${companyName}` : ''} at <strong>₹0 Brokerage</strong> with instant UPI:
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://zerodha.com/open-account?c=ZMPZQH"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-1.5 font-bold text-white hover:bg-blue-700 transition shadow-xs"
          >
            <span>Zerodha</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://groww.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 font-bold text-white hover:bg-emerald-700 transition shadow-xs"
          >
            <span>Groww</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs my-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-bold text-indigo-700">
            <ShieldCheck className="h-3.5 w-3.5" /> High-Intent 1-Click Apply
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Apply {companyName ? `for ${companyName}` : 'in Current IPOs'} at ₹0 Brokerage
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Open a free Demat account in 5 minutes. Apply seamlessly via UPI with zero fees on allotment.
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> ₹0 Demat Account Opening
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Instant UPI Mandate
            </span>
          </div>
        </div>

        {/* Broker Direct Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          <a
            href="https://zerodha.com/open-account?c=ZMPZQH"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 transition group text-center min-w-[130px]"
          >
            <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">Zerodha</span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5">India&apos;s #1 Broker</span>
            <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
              Apply Now <ArrowRight className="h-3 w-3" />
            </span>
          </a>

          <a
            href="https://groww.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition group text-center min-w-[130px]"
          >
            <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">Groww</span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5">Zero AMC Account</span>
            <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              Apply Now <ArrowRight className="h-3 w-3" />
            </span>
          </a>

          <a
            href="https://angelone.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 transition group text-center min-w-[130px]"
          >
            <span className="text-sm font-bold text-slate-900 group-hover:text-amber-700">Angel One</span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5">Free ARQ Advice</span>
            <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
              Apply Now <ArrowRight className="h-3 w-3" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
