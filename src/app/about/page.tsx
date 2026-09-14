'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  TrendingUp, 
  Database, 
  Users, 
  Award, 
  Scale, 
  ArrowRight 
} from 'lucide-react';
import BrokerCtaBanner from '@/components/monetization/BrokerCtaBanner';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* Hero Header */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
          <ShieldCheck className="h-4 w-4" />
          <span>Independent Indian Capital Markets Intelligence</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          About IPOAlerts Intelligence
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          IPOAlerts is India&apos;s leading real-time primary market tracker, providing retail investors, HNI desks, and sub-brokers with verifiable Grey Market Premium (GMP) estimates, NSE/BSE combined subscription tallies, and automated registrar allotment verification.
        </p>
      </section>

      {/* 3 Pillar Methodology Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">How We Estimate GMP</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Grey Market Premium rates are aggregated from verified over-the-counter broker deals across Ahmedabad, Mumbai, and Delhi financial circles twice daily to reflect true market pop expectations.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Database className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Live Exchange Feeds</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Subscription multipliers are gathered directly from combined NSE and BSE order book updates at 10:00 AM, 1:00 PM, and the 5:00 PM closing bell for QIB, NII, and Retail quotas.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Scale className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">SEBI Disclosures</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            IPOAlerts is strictly an informational and analytical utility. We are not SEBI registered research analysts or financial advisers. Grey market trades carry settlement counterparty risk.
          </p>
        </div>
      </section>

      {/* Editorial Standards */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">Our Editorial & Analytics Standards</h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            • <strong>Zero Sponsored GMP Inflations:</strong> We do not accept promotional fees to alter or artificially inflate Grey Market Premium or Kostak figures.
          </p>
          <p>
            • <strong>Mainboard & SME Segregation:</strong> SME IPOs carry distinct liquidity parameters, lot sizes (typically ₹1 Lakh+), and post-listing trading restrictions. Our platform maintains clear visual distinctions between Mainboard and SME issues.
          </p>
          <p>
            • <strong>Direct Official Linking:</strong> We direct investors directly to official SEBI, NSE, BSE, Link Intime, KFintech, and Bigshare portals rather than capturing PAN credentials.
          </p>
        </div>
      </section>

      {/* Broker Banner */}
      <BrokerCtaBanner variant="full" />
    </div>
  );
}
