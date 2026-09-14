'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight, Search } from 'lucide-react';
import { getStoredIpos, formatCurrency } from '@/lib/ipoStore';
import { IPO } from '@/types/ipo';
import BrokerCtaBanner from '@/components/monetization/BrokerCtaBanner';

export default function LiveGmpPage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'mainboard' | 'sme'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIpos(getStoredIpos());
    const handleUpdate = () => setIpos(getStoredIpos());
    window.addEventListener('ipoDataUpdated', handleUpdate);
    return () => window.removeEventListener('ipoDataUpdated', handleUpdate);
  }, []);

  const gmpIpos = ipos.filter((i) => {
    const matchesCat = categoryFilter === 'all' || i.category === categoryFilter;
    const matchesSearch =
      !search.trim() ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white via-indigo-50/20 to-white p-5 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 live-beacon" />
              <span>Live Grey Market Rates</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              IPO GMP Today (Mainboard & SME)
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
              Daily updated Grey Market Premium rates, Kostak rates, and expected listing percentage gains.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-center shrink-0 min-w-[140px]">
            <span className="text-xs font-semibold text-slate-500">Top GMP Today</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-0.5">+98.1%</div>
            <span className="text-xs font-semibold text-slate-800">Waaree Energies</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1 text-xs font-bold w-full sm:w-auto justify-center sm:justify-start">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition ${
              categoryFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All IPOs
          </button>
          <button
            onClick={() => setCategoryFilter('mainboard')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition ${
              categoryFilter === 'mainboard' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Mainboard
          </button>
          <button
            onClick={() => setCategoryFilter('sme')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition ${
              categoryFilter === 'sme' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            SME
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search IPO GMP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Mobile Card View (< 768px) */}
      <div className="md:hidden space-y-3">
        {gmpIpos.map((ipo) => {
          const cap = ipo.priceBandMax || ipo.priceBandMin;
          const estListing = cap + ipo.currentGmp;
          const lotProfit = ipo.currentGmp * ipo.lotSize;

          return (
            <div
              key={ipo.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={`/ipo/${ipo.slug}`} className="font-bold text-sm text-slate-900 hover:text-indigo-600 truncate block">
                    {ipo.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span className="font-mono font-semibold">{ipo.symbol}</span>
                    <span>•</span>
                    <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-bold text-slate-600">
                      {ipo.category}
                    </span>
                    <span>•</span>
                    <span>Price: ₹{cap}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                    +₹{ipo.currentGmp} (+{ipo.currentListingGainPct}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Est. Listing Price</span>
                  <span className="font-bold text-slate-900 text-sm">₹{estListing}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Profit Per Lot</span>
                  <span className="font-bold text-emerald-600 text-sm">+{formatCurrency(lotProfit)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Dates: {ipo.openDate.slice(5)} to {ipo.closeDate.slice(5)}
                </span>
                <Link
                  href={`/ipo/${ipo.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                >
                  <span>Full Analysis</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop & Tablet Table View (>= 768px) */}
      <div className="hidden md:block rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase text-[11px] tracking-wider text-slate-500 border-b border-slate-200 font-bold">
              <tr>
                <th className="px-5 py-3.5">IPO Name</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price Band</th>
                <th className="px-5 py-3.5 text-emerald-700">GMP Today</th>
                <th className="px-5 py-3.5">Est. Listing</th>
                <th className="px-5 py-3.5">Est. Gain</th>
                <th className="px-5 py-3.5">Lot Profit</th>
                <th className="px-5 py-3.5">Dates</th>
                <th className="px-5 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {gmpIpos.map((ipo) => {
                const cap = ipo.priceBandMax || ipo.priceBandMin;
                const estListing = cap + ipo.currentGmp;
                const lotProfit = ipo.currentGmp * ipo.lotSize;

                return (
                  <tr key={ipo.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5 font-sans font-bold text-slate-900">
                      <Link href={`/ipo/${ipo.slug}`} className="hover:text-indigo-600 transition">
                        {ipo.name}
                      </Link>
                      <div className="text-[10px] text-slate-400 font-mono">{ipo.symbol}</div>
                    </td>
                    <td className="px-5 py-3.5 font-sans">
                      <span className="uppercase text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                        {ipo.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-sans">
                      ₹{cap}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600 font-sans">
                      +₹{ipo.currentGmp}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 font-sans">
                      ₹{estListing}
                    </td>
                    <td className="px-5 py-3.5 font-sans">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                        +{ipo.currentListingGainPct}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 font-sans">
                      +{formatCurrency(lotProfit)}
                    </td>
                    <td className="px-5 py-3.5 font-sans text-slate-500">
                      {ipo.openDate.slice(5)} to {ipo.closeDate.slice(5)}
                    </td>
                    <td className="px-5 py-3.5 font-sans">
                      <Link
                        href={`/ipo/${ipo.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <BrokerCtaBanner />
    </div>
  );
}
