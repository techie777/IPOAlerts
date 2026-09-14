'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  Flame, 
  Building2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { IPO } from '@/types/ipo';
import { formatCurrency, formatCrores } from '@/lib/ipoStore';

interface Props {
  ipo: IPO;
}

export default function IpoCard({ ipo }: Props) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = ipo.status === 'open' ? ipo.closeDate : ipo.openDate;
      if (!targetDate) return '';

      const target = new Date(`${targetDate}T17:00:00+05:30`).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        return ipo.status === 'open' ? 'Bidding Closed' : 'Opening Soon';
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60)) / (1000 * 60));

      if (days > 0) return `${days}d ${hours}h left`;
      return `${hours}h ${minutes}m left`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    return () => clearInterval(interval);
  }, [ipo]);

  const capPrice = ipo.priceBandMax || ipo.priceBandMin;
  const minInvestment = capPrice * ipo.lotSize;
  const lotProfit = ipo.currentGmp * ipo.lotSize;
  const isGain = ipo.currentGmp >= 0;

  const getStatusBadge = () => {
    switch (ipo.status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 live-beacon" />
            Live Bidding
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
            Upcoming
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">
            Allotment Stage
          </span>
        );
      case 'listed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
            Listed
          </span>
        );
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5">
      
      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
              ipo.category === 'sme' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-indigo-50 text-indigo-700'
            }`}>
              {ipo.category}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {ipo.exchange}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {ipo.hot && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                <Flame className="h-3 w-3 text-amber-600" /> HOT
              </span>
            )}
            {getStatusBadge()}
          </div>
        </div>

        {/* Company Title */}
        <div className="flex items-start gap-3 my-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl border border-slate-200 shadow-xs group-hover:scale-105 transition-transform">
            {ipo.logoUrl || <Building2 className="h-6 w-6 text-slate-500" />}
          </div>
          <div className="min-w-0">
            <Link href={`/ipo/${ipo.slug}`} className="hover:underline">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {ipo.name}
              </h3>
            </Link>
            <p className="text-xs font-medium text-slate-500 line-clamp-1 mt-0.5">
              {ipo.sector} • <strong className="text-slate-700">{ipo.symbol}</strong>
            </p>
          </div>
        </div>

        {/* Live Timer or Key Dates */}
        {timeLeft && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-600 border border-slate-200/60">
            <span className="font-medium text-slate-500">Bidding Window</span>
            <div className="flex items-center gap-1 font-bold text-indigo-600">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeLeft}</span>
            </div>
          </div>
        )}

        {/* Primary Highlights: GMP and Subscription */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          
          {/* GMP Card */}
          <div className={`rounded-xl p-3 border ${
            isGain 
              ? 'bg-emerald-50/70 border-emerald-200' 
              : 'bg-rose-50/70 border-rose-200'
          }`}>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Grey Market (GMP)</span>
              <TrendingUp className={`h-3.5 w-3.5 ${isGain ? 'text-emerald-600' : 'text-rose-600'}`} />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className={`text-base font-bold ${isGain ? 'text-emerald-700' : 'text-rose-700'}`}>
                +₹{ipo.currentGmp}
              </span>
              <span className="text-xs font-semibold text-emerald-800">
                (+{ipo.currentListingGainPct}%)
              </span>
            </div>
            <div className="text-xs text-emerald-800/80 mt-0.5">
              Est. Profit: +{formatCurrency(lotProfit)}/lot
            </div>
          </div>

          {/* Subscription Card */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Subscription</span>
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-base font-bold text-indigo-700">
                {ipo.currentSubscription > 0 ? `${ipo.currentSubscription}x` : 'Open'}
              </span>
              <span className="text-xs text-slate-500">
                {ipo.currentSubscription > 0 ? 'Bidded' : 'Day 1'}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Min: {formatCurrency(minInvestment)}
            </div>
          </div>
        </div>

        {/* Crisp Data Row: Price, Lot Size, Issue Size */}
        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 pb-1 text-center text-xs">
          <div>
            <span className="text-[11px] uppercase font-medium text-slate-400">Price Band</span>
            <div className="font-semibold text-slate-800 mt-0.5">
              ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
            </div>
          </div>
          <div>
            <span className="text-[11px] uppercase font-medium text-slate-400">Lot Size</span>
            <div className="font-semibold text-slate-800 mt-0.5">
              {ipo.lotSize} Shares
            </div>
          </div>
          <div>
            <span className="text-[11px] uppercase font-medium text-slate-400">Issue Size</span>
            <div className="font-semibold text-slate-800 mt-0.5">
              {formatCrores(ipo.issueSizeCr)}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-2">
        <Link
          href={`/ipo/${ipo.slug}`}
          className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-xs font-bold text-slate-800 transition"
        >
          <span>View Details & GMP</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
        </Link>
        
        <a
          href="https://zerodha.com/open-account?c=ZMPZQH"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-600/30 transition"
        >
          <span>Apply</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
