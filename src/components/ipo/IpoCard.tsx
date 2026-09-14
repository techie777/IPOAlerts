'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Flame, 
  Building2, 
  Users
} from 'lucide-react';
import { IPO } from '@/types/ipo';
import { formatCurrency } from '@/lib/ipoStore';
import { useLanguage } from '@/context/LanguageContext';

export interface CalendarEventBanner {
  type: 'open' | 'close' | 'allotment' | 'listing';
  date: string;
  actionText: string;
}

interface Props {
  ipo: IPO;
  rank?: number;
  calendarEvent?: CalendarEventBanner;
}

export default function IpoCard({ ipo, rank, calendarEvent }: Props) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<string>('');

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
  const lotProfit = ipo.currentGmp * ipo.lotSize;
  const isGain = ipo.currentGmp >= 0;

  // Format Dates
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  // Get Latest Subscription Metrics
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
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 live-beacon" />
            {t.liveBidding}
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
            {t.upcoming}
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-200">
            {t.allotmentStage}
          </span>
        );
      case 'listed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
            {t.listed}
          </span>
        );
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10">
      <div>
        {/* Calendar Event Schedule Banner (for calendar view) */}
        {calendarEvent && (
          <div className="mb-3.5 -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-slate-50 via-indigo-50/50 to-slate-50 px-4 py-2.5 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  calendarEvent.type === 'open'
                    ? 'bg-emerald-500 live-beacon'
                    : calendarEvent.type === 'close'
                    ? 'bg-amber-500'
                    : calendarEvent.type === 'allotment'
                    ? 'bg-purple-500'
                    : 'bg-indigo-500'
                }`}
              />
              <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] font-heading">
                {calendarEvent.type === 'open'
                  ? 'Bidding Opens'
                  : calendarEvent.type === 'close'
                  ? 'Closes Today'
                  : calendarEvent.type === 'allotment'
                  ? 'Allotment Declared'
                  : 'Listing Day'}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="font-bold text-indigo-700">{calendarEvent.actionText}</span>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px] tabular-nums bg-white px-2.5 py-1 rounded-lg border border-slate-200/90 shadow-2xs">
              <Clock className="h-3 w-3 text-indigo-600" />
              <span>{formatDate(calendarEvent.date)}</span>
            </div>
          </div>
        )}

        {/* Top Header: Logo, Rank, Name, Category & Gain Pill */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Rank Badge or Logo */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-indigo-50 via-slate-50 to-indigo-100/80 border border-slate-200 text-2xl shadow-xs group-hover:scale-105 transition-transform">
              {rank !== undefined ? (
                <span
                  className={`text-sm font-extrabold ${
                    rank === 1
                      ? 'text-amber-600'
                      : rank === 2
                      ? 'text-slate-600'
                      : rank === 3
                      ? 'text-amber-800'
                      : 'text-indigo-600'
                  }`}
                >
                  #{rank}
                </span>
              ) : ipo.logoUrl ? (
                <span>{ipo.logoUrl}</span>
              ) : (
                <Building2 className="h-6 w-6 text-indigo-600" />
              )}
            </div>

            {/* IPO Name & Meta */}
            <div className="min-w-0 flex-1">
              <Link href={`/ipo/${ipo.slug}`} className="hover:underline">
                <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {ipo.name}
                </h2>
              </Link>
              
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px]">
                <span className="font-bold text-slate-700">{ipo.symbol}</span>
                <span className="text-slate-300">&bull;</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded uppercase tracking-wider text-[10px] ${
                    ipo.category === 'sme'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {ipo.category === 'sme' ? t.sme : t.mainboard}
                </span>
                {ipo.hot && (
                  <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                    <Flame className="h-3 w-3 text-amber-600" /> {t.hot}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Gain Pill & Status */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200/80 shadow-2xs">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span>+{ipo.currentListingGainPct}%</span>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        {/* IPO Start Date & End Date Row */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50/80 px-3 py-1.5 text-xs text-slate-600 border border-slate-100">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-600 font-semibold text-[11px]">{t.offerDate}:</span>
            <span className="font-bold text-slate-800">
              {formatDate(ipo.openDate)} to {formatDate(ipo.closeDate)}
            </span>
          </div>

          {timeLeft && ipo.status === 'open' && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-700">
              <Clock className="h-3 w-3" />
              <span>{timeLeft}</span>
            </div>
          )}
        </div>

        {/* Issue Price, GMP, Lot Size & Profit Highlights Box */}
        <div className="mt-3 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-2.5 text-center shadow-2xs">
          {/* Issue Price */}
          <div className="px-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              {t.issuePrice}
            </div>
            <div className="mt-0.5 text-sm sm:text-base font-extrabold text-slate-900">
              ₹{capPrice}
            </div>
            <div className="text-[10px] text-slate-600 font-medium">
              Lot: {ipo.lotSize} sh
            </div>
          </div>

          {/* GMP Today */}
          <div className="px-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              {t.gmpToday}
            </div>
            <div className="mt-0.5 text-sm sm:text-base font-extrabold text-emerald-700">
              {isGain ? `+₹${ipo.currentGmp}` : `-₹${Math.abs(ipo.currentGmp)}`}
            </div>
            <div className="text-[10px] text-emerald-800 font-medium">
              {t.perShare}
            </div>
          </div>

          {/* Profit / Lot */}
          <div className="px-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              {t.profitLot}
            </div>
            <div className="mt-0.5 text-sm sm:text-base font-extrabold text-slate-900">
              +{formatCurrency(lotProfit)}
            </div>
            <div className="text-[10px] text-slate-600 font-medium">
              {t.oneApplication}
            </div>
          </div>
        </div>

        {/* Retail, HNI, QIB, Employee Subscription Breakdown */}
        <div className="mt-3 rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/50 via-slate-50 to-indigo-50/30 p-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5 px-1">
            <span className="flex items-center gap-1 text-indigo-700">
              <Users className="h-3.5 w-3.5" /> {t.liveSubscription}
            </span>
            <span className="text-slate-600 font-semibold">
              {t.total}: <strong className="text-indigo-700 font-extrabold">{totalSub}</strong>
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center text-xs">
            {/* Retail */}
            <div className="rounded-xl bg-white p-1.5 border border-slate-100 shadow-2xs">
              <div className="text-[9px] font-bold text-slate-600 uppercase">{t.retail}</div>
              <div className="mt-0.5 text-xs font-extrabold text-slate-800 truncate">
                {retailSub}
              </div>
            </div>

            {/* HNI */}
            <div className="rounded-xl bg-white p-1.5 border border-slate-100 shadow-2xs">
              <div className="text-[9px] font-bold text-slate-600 uppercase">{t.hni}</div>
              <div className="mt-0.5 text-xs font-extrabold text-slate-800 truncate">
                {hniSub}
              </div>
            </div>

            {/* QIB */}
            <div className="rounded-xl bg-white p-1.5 border border-slate-100 shadow-2xs">
              <div className="text-[9px] font-bold text-slate-600 uppercase">{t.qib}</div>
              <div className="mt-0.5 text-xs font-extrabold text-slate-800 truncate">
                {qibSub}
              </div>
            </div>

            {/* Employee */}
            <div className="rounded-xl bg-white p-1.5 border border-slate-100 shadow-2xs">
              <div className="text-[9px] font-bold text-slate-600 uppercase">{t.employee}</div>
              <div className="mt-0.5 text-xs font-extrabold text-slate-800 truncate">
                {empSub}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button: View Details & Bidding Status */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          href={`/ipo/${ipo.slug}`}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 py-2.5 text-xs font-extrabold text-slate-700 shadow-2xs transition group-hover:border-indigo-300"
        >
          <span>{t.viewDetails}</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
