'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight, Search, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { getStoredIpos, formatCurrency } from '@/lib/ipoStore';
import { IPO } from '@/types/ipo';
import IpoCard from '@/components/ipo/IpoCard';
import BrokerCtaBanner from '@/components/monetization/BrokerCtaBanner';
import { useLanguage } from '@/context/LanguageContext';

export default function LiveGmpPage() {
  const { t } = useLanguage();
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'mainboard' | 'sme'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
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

  const highestGmpIpo = [...ipos].sort((a, b) => b.currentListingGainPct - a.currentListingGainPct)[0];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white via-indigo-50/20 to-white p-5 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 live-beacon" />
              <span>{t.liveGmp}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {t.liveGmp} Today ({t.mainboard} & {t.sme})
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
              Daily updated Grey Market Premium rates, Kostak rates, and expected listing percentage gains.
            </p>
          </div>

          {highestGmpIpo && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-center shrink-0 min-w-[140px]">
              <span className="text-xs font-semibold text-slate-500">{t.topGmpToday}</span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-0.5">
                +{highestGmpIpo.currentListingGainPct}%
              </div>
              <span className="text-xs font-semibold text-slate-800">{highestGmpIpo.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter, View Switcher and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Category Filter */}
          <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1 text-xs font-bold flex-1 sm:flex-initial justify-center sm:justify-start">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                categoryFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.all}
            </button>
            <button
              onClick={() => setCategoryFilter('mainboard')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                categoryFilter === 'mainboard' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.mainboard}
            </button>
            <button
              onClick={() => setCategoryFilter('sme')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                categoryFilter === 'sme' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.sme}
            </button>
          </div>

          {/* Desktop View Mode Toggle */}
          <div className="hidden md:flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1 text-xs font-bold">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'cards' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Card View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchGmp}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Universal Cards View - Responsive across all screen sizes */}
      {(viewMode === 'cards' || true) && (
        <div className={viewMode === 'table' ? 'md:hidden' : 'block'}>
          {gmpIpos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {gmpIpos.map((ipo, idx) => (
                <IpoCard key={ipo.id} ipo={ipo} rank={idx + 1} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
              <p className="text-sm font-semibold">No IPOs found matching the current search.</p>
            </div>
          )}
        </div>
      )}

      {/* Desktop & Tablet Table View (Only when Table mode selected on >= 768px) */}
      {viewMode === 'table' && (
        <div className="hidden md:block rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase text-[11px] tracking-wider text-slate-500 border-b border-slate-200 font-bold">
                <tr>
                  <th className="px-5 py-3.5"># & IPO Name</th>
                  <th className="px-5 py-3.5">{t.sme} / {t.mainboard}</th>
                  <th className="px-5 py-3.5">{t.issuePrice}</th>
                  <th className="px-5 py-3.5 text-emerald-700">{t.gmpToday}</th>
                  <th className="px-5 py-3.5">{t.estListingPrice}</th>
                  <th className="px-5 py-3.5">Est. Gain</th>
                  <th className="px-5 py-3.5">{t.profitLot}</th>
                  <th className="px-5 py-3.5">{t.offerDate}</th>
                  <th className="px-5 py-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {gmpIpos.map((ipo, idx) => {
                  const cap = ipo.priceBandMax || ipo.priceBandMin;
                  const estListing = cap + ipo.currentGmp;
                  const lotProfit = ipo.currentGmp * ipo.lotSize;

                  return (
                    <tr key={ipo.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-3.5 font-sans font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                          <div>
                            <Link href={`/ipo/${ipo.slug}`} className="hover:text-indigo-600 transition">
                              {ipo.name}
                            </Link>
                            <div className="text-[10px] text-slate-400 font-mono">{ipo.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-sans">
                        <span className={`uppercase text-[10px] px-2 py-0.5 rounded-md font-bold ${
                          ipo.category === 'sme' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {ipo.category === 'sme' ? t.sme : t.mainboard}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-sans font-bold">
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
                        {ipo.openDate} to {ipo.closeDate}
                      </td>
                      <td className="px-5 py-3.5 font-sans">
                        <Link
                          href={`/ipo/${ipo.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                        >
                          <span>{t.viewDetails}</span>
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
      )}

      <BrokerCtaBanner />
    </div>
  );
}
