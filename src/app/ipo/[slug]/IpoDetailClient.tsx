'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Building2, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  Bell, 
  BarChart3, 
  ArrowUpRight,
  Flame,
  Calculator
} from 'lucide-react';
import { IPO } from '@/types/ipo';
import { getStoredIpos, formatCurrency, formatCrores } from '@/lib/ipoStore';
import GmpHistoryChart from '@/components/ipo/GmpHistoryChart';
import SubscriptionTable from '@/components/ipo/SubscriptionTable';
import GmpCalculator from '@/components/tools/GmpCalculator';
import AllotmentCheckerModal from '@/components/tools/AllotmentCheckerModal';
import NotificationModal from '@/components/notifications/NotificationModal';
import BrokerCtaBanner from '@/components/monetization/BrokerCtaBanner';

interface Props {
  initialIpo: IPO;
  slug: string;
}

type TabType = 'gmp' | 'subscription' | 'details' | 'allotment';

export default function IpoDetailClient({ initialIpo, slug }: Props) {
  const [ipo, setIpo] = useState<IPO>(initialIpo);
  const [activeTab, setActiveTab] = useState<TabType>('gmp');
  const [allotmentModalOpen, setAllotmentModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    const refreshIpo = () => {
      const stored = getStoredIpos().find((i) => i.slug === slug);
      if (stored) setIpo(stored);
    };
    refreshIpo();
    window.addEventListener('ipoDataUpdated', refreshIpo);
    return () => window.removeEventListener('ipoDataUpdated', refreshIpo);
  }, [slug]);

  const capPrice = ipo.priceBandMax || ipo.priceBandMin;
  const minInvestment = capPrice * ipo.lotSize;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All IPOs</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            setIsWatching(!isWatching);
            setNotifModalOpen(true);
          }}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition border ${
            isWatching
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
          }`}
        >
          <Bell className="h-3.5 w-3.5 text-indigo-600" />
          <span>{isWatching ? 'Alerts Active' : 'Get Alerts for this IPO'}</span>
        </button>
      </div>

      {/* Hero Header Card - Clean Fintech Light */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Company Title */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 text-3xl shadow-xs">
              {ipo.logoUrl || <Building2 className="h-8 w-8 text-indigo-600" />}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                  ipo.category === 'sme'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-indigo-50 text-indigo-700'
                }`}>
                  {ipo.category} IPO
                </span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                  {ipo.exchange}
                </span>
                {ipo.hot && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-extrabold text-amber-800">
                    <Flame className="h-3 w-3 text-amber-600" /> HOT
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {ipo.name}
              </h1>

              <p className="text-xs sm:text-sm font-medium text-slate-500">
                {ipo.sector} • Symbol: <strong className="text-slate-800">{ipo.symbol}</strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics & Apply Button */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live GMP */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-center min-w-[130px]">
              <div className="text-[11px] font-bold text-slate-600">Live GMP</div>
              <div className="text-2xl font-black text-emerald-700 mt-0.5">
                +₹{ipo.currentGmp}
              </div>
              <div className="text-xs font-extrabold text-emerald-800">
                +{ipo.currentListingGainPct}% est.
              </div>
            </div>

            {/* Total Subscription */}
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 text-center min-w-[120px]">
              <div className="text-[11px] font-bold text-slate-600">Subscription</div>
              <div className="text-2xl font-black text-indigo-700 mt-0.5">
                {ipo.currentSubscription > 0 ? `${ipo.currentSubscription}x` : 'Open'}
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                {ipo.currentSubscription >= 1 ? 'Over-Subscribed' : 'Bidding Live'}
              </div>
            </div>

            {/* Apply CTA */}
            <a
              href="https://zerodha.com/open-account?c=ZMPZQH"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-6 py-4 text-sm font-bold text-white shadow-sm shadow-indigo-600/30 transition"
            >
              <span>Apply via Broker</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Timelines Strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Bidding Dates</span>
            <div className="font-bold text-slate-800 mt-0.5">
              {ipo.openDate} to {ipo.closeDate}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Allotment Date</span>
            <div className="font-bold text-indigo-600 mt-0.5">
              {ipo.allotmentDate}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Min. Investment</span>
            <div className="font-bold text-slate-800 mt-0.5">
              {formatCurrency(minInvestment)} ({ipo.lotSize} shares)
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Expected Listing</span>
            <div className="font-bold text-emerald-600 mt-0.5">
              {ipo.listingDate}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Clean Navigation Tabs - Horizontal Touch Scrollable on Mobile */}
      <div className="flex border-b border-slate-200 gap-2 pb-1 overflow-x-auto scrollbar-none">
        {[
          { key: 'gmp', label: `Live GMP (+₹${ipo.currentGmp})`, icon: TrendingUp },
          { key: 'subscription', label: `Subscription (${ipo.currentSubscription}x)`, icon: BarChart3 },
          { key: 'details', label: 'Company & Financials', icon: Layers },
          { key: 'allotment', label: 'Allotment Status', icon: CheckCircle2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition min-h-[42px] ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        
        {/* TAB 1: GMP & CALCULATOR */}
        {activeTab === 'gmp' && (
          <div className="space-y-6">
            <GmpCalculator ipo={ipo} />
            <GmpHistoryChart ipo={ipo} />
          </div>
        )}

        {/* TAB 2: SUBSCRIPTION BREAKDOWN */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <SubscriptionTable ipo={ipo} />
          </div>
        )}

        {/* TAB 3: DETAILS & FINANCIALS */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Business Snapshot */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
              <h3 className="text-base font-bold text-slate-900">About {ipo.name}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {ipo.description}
              </p>
            </div>

            {/* Parameters Grid */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Issue Parameters
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Price Band</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Lot Size</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {ipo.lotSize} Shares
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Total Issue Size</span>
                  <div className="text-sm font-bold text-indigo-600 mt-0.5">
                    {formatCrores(ipo.issueSizeCr)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Retail Quota</span>
                  <div className="text-sm font-bold text-emerald-600 mt-0.5">
                    {ipo.retailQuotaPct}% of Issue
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Registrar</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {ipo.registrarName}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Face Value</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    ₹{ipo.faceValue} per share
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Performance */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                3-Year Financials (From DRHP / RHP)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 uppercase text-[11px] tracking-wider text-slate-500 border-y border-slate-200 font-bold">
                    <tr>
                      <th className="px-4 py-3">Period</th>
                      <th className="px-4 py-3">Revenue (₹ Cr)</th>
                      <th className="px-4 py-3 text-emerald-700">Net Profit / PAT (₹ Cr)</th>
                      <th className="px-4 py-3">Net Worth (₹ Cr)</th>
                      <th className="px-4 py-3">EPS (₹)</th>
                      <th className="px-4 py-3">P/E Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {ipo.financials.map((fin) => (
                      <tr key={fin.fiscalYear} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-sans font-bold text-slate-900">
                          {fin.fiscalYear}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          ₹{fin.revenueCr.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600">
                          ₹{fin.patCr.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          ₹{fin.netWorthCr.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          ₹{fin.eps}
                        </td>
                        <td className="px-4 py-3 text-indigo-600 font-bold">
                          {fin.pe}x
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ALLOTMENT STATUS */}
        {activeTab === 'allotment' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Check {ipo.name} Allotment Status
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Official results will be announced on <strong>{ipo.allotmentDate}</strong> by registrar <strong>{ipo.registrarName}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 space-y-3">
                <span className="text-xs font-bold uppercase text-indigo-700">
                  Registrar Direct Portal
                </span>
                <div className="text-base font-bold text-slate-900">{ipo.registrarName}</div>
                <p className="text-xs text-slate-600">
                  Open registrar status page directly. Select company name and enter your PAN.
                </p>
                <div className="flex gap-2 pt-1">
                  <a
                    href={ipo.registrarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-bold text-white transition shadow-sm"
                  >
                    <span>Open Registrar Link</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setAllotmentModalOpen(true)}
                    className="rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    PAN Check Tool
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <span className="text-xs font-bold uppercase text-slate-500">
                  BSE Direct Verification
                </span>
                <div className="text-base font-bold text-slate-900">BSE India Investor Portal</div>
                <p className="text-xs text-slate-600">
                  Verify allotment on official BSE website by selecting Issue Name and submitting PAN.
                </p>
                <a
                  href="https://www.bseindia.com/investors/appli_check.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  <span>Open BSE Allotment Status</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Broker Apply Banner */}
      <BrokerCtaBanner companyName={ipo.name} />

      {/* Modals */}
      {allotmentModalOpen && (
        <AllotmentCheckerModal ipo={ipo} onClose={() => setAllotmentModalOpen(false)} />
      )}
      {notifModalOpen && (
        <NotificationModal onClose={() => setNotifModalOpen(false)} defaultIpoSlug={ipo.slug} />
      )}
    </div>
  );
}
