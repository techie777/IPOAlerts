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
  Calculator,
  Users
} from 'lucide-react';
import { IPO } from '@/types/ipo';
import { getStoredIpos, formatCurrency, formatCrores } from '@/lib/ipoStore';
import GmpHistoryChart from '@/components/ipo/GmpHistoryChart';
import SubscriptionTable from '@/components/ipo/SubscriptionTable';
import GmpCalculator from '@/components/tools/GmpCalculator';
import AllotmentCheckerModal from '@/components/tools/AllotmentCheckerModal';
import NotificationModal from '@/components/notifications/NotificationModal';
import BrokerCtaBanner from '@/components/monetization/BrokerCtaBanner';
import AllotmentChancesCalculator from '@/components/tools/AllotmentChancesCalculator';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  initialIpo: IPO;
  slug: string;
}

type TabType = 'gmp' | 'subscription' | 'matrix' | 'details' | 'allotment';

export default function IpoDetailClient({ initialIpo, slug }: Props) {
  const { t } = useLanguage();
  const [ipo, setIpo] = useState<IPO>(initialIpo);
  const [activeTab, setActiveTab] = useState<TabType>('gmp');
  const [allotmentModalOpen, setAllotmentModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const refreshIpo = () => {
      const stored = getStoredIpos().find((i) => i.slug === slug);
      if (stored) setIpo(stored);
    };
    refreshIpo();
    window.addEventListener('ipoDataUpdated', refreshIpo);
    return () => window.removeEventListener('ipoDataUpdated', refreshIpo);
  }, [slug]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = ipo.status === 'open' ? ipo.closeDate : ipo.openDate;
      if (!targetDate) return '';

      const target = new Date(`${targetDate}T17:00:00+05:30`).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        return ipo.status === 'open' ? t.biddingClosed : t.openingSoon;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (days > 0) return `${days}d ${hours}h left`;
      return `${hours}h left`;
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [ipo, t]);

  const capPrice = ipo.priceBandMax || ipo.priceBandMin;
  const minInvestment = capPrice * ipo.lotSize;
  const lotProfit = ipo.currentGmp * ipo.lotSize;
  const isGain = ipo.currentGmp >= 0;

  // Format Dates DD-MM-YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  // Subscription Breakdown
  const latestSub =
    ipo.subscriptionHistory && ipo.subscriptionHistory.length > 0
      ? ipo.subscriptionHistory[ipo.subscriptionHistory.length - 1]
      : null;

  const retailSub = latestSub?.retailMultiplier
    ? `${latestSub.retailMultiplier.toFixed(2)}x`
    : ipo.currentSubscription > 0
    ? `${(ipo.currentSubscription * 0.4).toFixed(1)}x`
    : '—';

  const hniSub = latestSub?.niiMultiplier
    ? `${latestSub.niiMultiplier.toFixed(2)}x`
    : ipo.currentSubscription > 0
    ? `${(ipo.currentSubscription * 0.7).toFixed(1)}x`
    : '—';

  const qibSub = latestSub?.qibMultiplier
    ? `${latestSub.qibMultiplier.toFixed(2)}x`
    : ipo.currentSubscription > 0
    ? `${(ipo.currentSubscription * 0.3).toFixed(1)}x`
    : '—';

  const empSub = latestSub?.employeeMultiplier
    ? `${latestSub.employeeMultiplier.toFixed(2)}x`
    : latestSub
    ? 'N/A'
    : '—';

  const totalSub = latestSub?.totalMultiplier
    ? `${latestSub.totalMultiplier.toFixed(2)}x`
    : ipo.currentSubscription > 0
    ? `${ipo.currentSubscription.toFixed(1)}x`
    : '—';

  const getStatusBadge = () => {
    switch (ipo.status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 live-beacon" />
            {t.liveBidding}
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
            {t.upcoming}
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 border border-purple-200">
            {t.allotmentStage}
          </span>
        );
      case 'listed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
            {t.listed}
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backToAllIpos}</span>
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
          <span>{isWatching ? t.alertsActive : t.getAlertsForIpo}</span>
        </button>
      </div>

      {/* Universal Hero Card - 7 Core Data Points Universal Design */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-7 shadow-xs space-y-4">
        
        {/* Row 1: Header - Company, Tags & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-50 via-slate-50 to-indigo-100/80 border border-slate-200 text-3xl shadow-xs">
              {ipo.logoUrl || <Building2 className="h-8 w-8 text-indigo-600" />}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                  ipo.category === 'sme'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-indigo-50 text-indigo-700'
                }`}>
                  {ipo.category === 'sme' ? t.sme : t.mainboard}
                </span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                  {ipo.exchange}
                </span>
                {ipo.hot && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-800">
                    <Flame className="h-3 w-3 text-amber-600" /> {t.hot}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                {ipo.name}
              </h1>

              <p className="text-xs sm:text-sm font-medium text-slate-500">
                {ipo.sector} • Symbol: <strong className="text-slate-800">{ipo.symbol}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center sm:flex-col sm:items-end gap-2 shrink-0">
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs sm:text-sm font-extrabold text-emerald-700 border border-emerald-200 shadow-2xs">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span>+{ipo.currentListingGainPct}% est.</span>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        {/* Row 2: Universal Offer Date Strip with Countdown */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50/90 px-4 py-2 text-xs sm:text-sm text-slate-700 border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase text-[11px]">{t.offerDate}:</span>
            <span className="font-bold text-slate-900">
              {formatDate(ipo.openDate)} to {formatDate(ipo.closeDate)}
            </span>
          </div>

          {timeLeft && ipo.status === 'open' && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeLeft}</span>
            </div>
          )}
        </div>

        {/* Row 3: 3-Column Highlights Box (Issue Price, GMP Today, Profit / Lot) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 rounded-2xl border border-slate-200/90 bg-slate-50/60 p-3 sm:p-4 text-center shadow-2xs gap-3 sm:gap-0">
          {/* Issue Price */}
          <div className="sm:px-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.issuePrice}
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
              ₹{capPrice}
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              Lot: {ipo.lotSize} sh • Min: {formatCurrency(minInvestment)}
            </div>
          </div>

          {/* GMP Today */}
          <div className="pt-3 sm:pt-0 sm:px-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              {t.gmpToday}
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black text-emerald-600">
              {isGain ? `+₹${ipo.currentGmp}` : `-₹${Math.abs(ipo.currentGmp)}`}
            </div>
            <div className="text-xs text-emerald-800 font-bold mt-0.5">
              {t.perShare} (+{ipo.currentListingGainPct}%)
            </div>
          </div>

          {/* Profit / Lot */}
          <div className="pt-3 sm:pt-0 sm:px-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.profitLot}
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
              +{formatCurrency(lotProfit)}
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              {t.oneApplication}
            </div>
          </div>
        </div>

        {/* Row 4: Live Subscription Category Breakdown Box */}
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/60 via-slate-50 to-indigo-50/40 p-3 sm:p-4">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 mb-2 px-1">
            <span className="flex items-center gap-1.5 text-indigo-700">
              <Users className="h-4 w-4" /> {t.liveSubscription}
            </span>
            <span className="text-slate-500 font-semibold">
              {t.total}: <strong className="text-indigo-700 font-extrabold text-sm sm:text-base">{totalSub}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="rounded-xl bg-white p-2.5 border border-slate-200/70 shadow-2xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">{t.retail}</div>
              <div className="mt-0.5 text-sm sm:text-base font-extrabold text-slate-800">
                {retailSub}
              </div>
            </div>

            <div className="rounded-xl bg-white p-2.5 border border-slate-200/70 shadow-2xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">{t.hni}</div>
              <div className="mt-0.5 text-sm sm:text-base font-extrabold text-slate-800">
                {hniSub}
              </div>
            </div>

            <div className="rounded-xl bg-white p-2.5 border border-slate-200/70 shadow-2xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">{t.qib}</div>
              <div className="mt-0.5 text-sm sm:text-base font-extrabold text-slate-800">
                {qibSub}
              </div>
            </div>

            <div className="rounded-xl bg-white p-2.5 border border-slate-200/70 shadow-2xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">{t.employee}</div>
              <div className="mt-0.5 text-sm sm:text-base font-extrabold text-slate-800">
                {empSub}
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: Action Triggers (Allotment Chances Calculator & Apply via Broker) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-4 py-3.5 text-xs sm:text-sm font-extrabold text-indigo-700 transition cursor-pointer"
          >
            <Calculator className="h-4 w-4 text-indigo-600" />
            <span>{t.tabMatrix}</span>
          </button>

          <a
            href="https://zerodha.com/open-account?c=ZMPZQH"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm shadow-indigo-600/30 transition"
          >
            <span>{t.applyViaBroker}</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Row 6: Timelines Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px]">{t.biddingDates}</span>
            <div className="font-bold text-slate-800 mt-0.5">
              {formatDate(ipo.openDate)} to {formatDate(ipo.closeDate)}
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px]">{t.allotmentDate}</span>
            <div className="font-bold text-indigo-600 mt-0.5">
              {formatDate(ipo.allotmentDate)}
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px]">{t.minInvestment}</span>
            <div className="font-bold text-slate-800 mt-0.5">
              {formatCurrency(minInvestment)} ({ipo.lotSize} sh)
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px]">{t.expectedListing}</span>
            <div className="font-bold text-emerald-600 mt-0.5">
              {formatDate(ipo.listingDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Horizontal Touch Scrollable on Mobile */}
      <div className="flex border-b border-slate-200 gap-2 pb-1 overflow-x-auto scrollbar-none">
        {[
          { key: 'gmp', label: `${t.tabGmp} (+₹${ipo.currentGmp})`, icon: TrendingUp },
          { key: 'subscription', label: `${t.tabSubscription} (${totalSub})`, icon: BarChart3 },
          { key: 'matrix', label: t.tabMatrix, icon: Calculator },
          { key: 'details', label: t.tabDetails, icon: Layers },
          { key: 'allotment', label: t.tabAllotment, icon: CheckCircle2 },
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

        {/* TAB 2: SUBSCRIPTION BREAKDOWN + MATRIX CALCULATOR */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <AllotmentChancesCalculator ipo={ipo} />
            <SubscriptionTable ipo={ipo} />
          </div>
        )}

        {/* TAB: ALLOTMENT CHANCES MATRIX CALCULATOR */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <AllotmentChancesCalculator ipo={ipo} />
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
