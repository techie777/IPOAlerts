'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Filter
} from 'lucide-react';
import { getStoredIpos, formatCurrency } from '@/lib/ipoStore';
import { IPO } from '@/types/ipo';
import BrokerCtaBanner from '@/components/monetization/BrokerCtaBanner';

export default function SubscriptionPage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [filterCat, setFilterCat] = useState<'all' | 'mainboard' | 'sme'>('all');

  useEffect(() => {
    setIpos(getStoredIpos());
    const handleUpdate = () => setIpos(getStoredIpos());
    window.addEventListener('ipoDataUpdated', handleUpdate);
    return () => window.removeEventListener('ipoDataUpdated', handleUpdate);
  }, []);

  const openIpos = ipos.filter(
    (i) => i.status === 'open' || i.status === 'closed'
  );

  const filteredIpos = openIpos.filter(
    (i) => filterCat === 'all' || i.category === filterCat
  );

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* Header Banner */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white via-indigo-50/25 to-white p-5 sm:p-8 lg:p-10 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200 mb-3">
            <Users className="h-4 w-4" />
            <span>NSE & BSE Combined Bidding Tracker</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
            Live IPO Subscription Status (Day-wise Multipliers)
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Real-time institutional QIB, High Net-Worth NII (sHNI & bHNI), and Retail individual investor bidding statistics.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1 text-xs font-semibold">
          <button
            onClick={() => setFilterCat('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterCat === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Issues
          </button>
          <button
            onClick={() => setFilterCat('mainboard')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterCat === 'mainboard' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Mainboard
          </button>
          <button
            onClick={() => setFilterCat('sme')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterCat === 'sme' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            SME IPOs
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Showing {filteredIpos.length} active bidding streams
        </span>
      </div>

      {/* Detailed Subscription Cards List */}
      <div className="space-y-6">
        {filteredIpos.map((ipo) => {
          const latestSub = ipo.subscriptionHistory[ipo.subscriptionHistory.length - 1] || {
            day: 3,
            qibMultiplier: 0,
            niiMultiplier: 0,
            retailMultiplier: 0,
            totalMultiplier: ipo.currentSubscription || 0,
          };

          return (
            <div
              key={ipo.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-5"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold text-base border border-slate-200 shrink-0">
                    {ipo.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/ipo/${ipo.slug}`}>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition">
                          {ipo.name}
                        </h2>
                      </Link>
                      <span className={`uppercase text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        ipo.category === 'sme' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {ipo.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Bidding Window: {ipo.openDate} to {ipo.closeDate} (5 PM Cut-off)
                    </p>
                  </div>
                </div>

                {/* Total Over-subscription Pill */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-500">Overall Subscription</div>
                    <div className="text-xl font-bold text-indigo-600">
                      {latestSub.totalMultiplier}x
                    </div>
                  </div>
                  <Link
                    href={`/ipo/${ipo.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white px-3.5 py-2 text-xs font-semibold transition"
                  >
                    <span>Full Analysis</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Day-by-Day Bidding Multiplier Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 uppercase text-[11px] tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Bidding Day</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">QIB (Inst.)</th>
                      <th className="py-3 px-4">NII / HNI</th>
                      <th className="py-3 px-4">Retail (RII)</th>
                      <th className="py-3 px-4 text-right font-bold text-slate-900">Total Multiple</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ipo.subscriptionHistory.map((sub) => (
                      <tr key={sub.day} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-bold text-slate-800">
                          Day {sub.day}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {sub.date || ipo.openDate}
                        </td>
                        <td className="py-3 px-4 font-semibold text-indigo-700">
                          {sub.qibMultiplier}x
                        </td>
                        <td className="py-3 px-4 font-semibold text-purple-700">
                          {sub.niiMultiplier}x
                        </td>
                        <td className="py-3 px-4 font-semibold text-emerald-700">
                          {sub.retailMultiplier}x
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                          {sub.totalMultiplier}x
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Broker Banner */}
      <BrokerCtaBanner variant="full" />
    </div>
  );
}
