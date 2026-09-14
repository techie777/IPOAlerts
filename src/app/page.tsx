'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Search,
  Sparkles
} from 'lucide-react';
import { getStoredIpos, formatCurrency } from '@/lib/ipoStore';
import { IPO, IpoCategory } from '@/types/ipo';
import IpoCard from '@/components/ipo/IpoCard';
import CalendarSection from '@/components/calendar/CalendarSection';
import BrokerCtaBanner from '@/components/monetization/BrokerCtaBanner';
import NotificationModal from '@/components/notifications/NotificationModal';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [ipos, setIpos] = useState<IPO[]>(() => getStoredIpos());
  const [activeTab, setActiveTab] = useState<'active' | 'allotment_listed' | 'upcoming' | 'all'>('active');
  const [selectedCategory, setSelectedCategory] = useState<'all' | IpoCategory>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [notifModalOpen, setNotifModalOpen] = useState(false);

  useEffect(() => {
    // Sync with localStorage if client has cached revisions
    setIpos(getStoredIpos());
    const handleUpdate = () => setIpos(getStoredIpos());
    window.addEventListener('ipoDataUpdated', handleUpdate);
    return () => window.removeEventListener('ipoDataUpdated', handleUpdate);
  }, []);

  // Filter IPOs by Active IPO / Allotment & listed / Upcoming / All
  const filteredIpos = ipos.filter((ipo) => {
    let statusMatches = true;
    if (activeTab === 'active') {
      statusMatches = ipo.status === 'open';
    } else if (activeTab === 'allotment_listed') {
      statusMatches = ipo.status === 'closed' || ipo.status === 'listed';
    } else if (activeTab === 'upcoming') {
      statusMatches = ipo.status === 'upcoming';
    } else if (activeTab === 'all') {
      statusMatches = true;
    }

    const categoryMatches =
      selectedCategory === 'all' || ipo.category === selectedCategory;

    const searchMatches =
      !searchFilter.trim() ||
      ipo.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ipo.symbol.toLowerCase().includes(searchFilter.toLowerCase());

    return statusMatches && categoryMatches && searchMatches;
  });

  const liveCount = ipos.filter((i) => i.status === 'open').length;
  const upcomingCount = ipos.filter((i) => i.status === 'upcoming').length;
  const listedCount = ipos.filter((i) => i.status === 'listed' || i.status === 'closed').length;
  const highestGmpIpo = [...ipos].sort((a, b) => b.currentListingGainPct - a.currentListingGainPct)[0];
  const topMovers = [...ipos]
    .filter((i) => i.currentGmp > 0)
    .sort((a, b) => b.currentListingGainPct - a.currentListingGainPct)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-5 sm:space-y-6">
      {/* Sleek Modern Financial Header & Live Market Ticker */}
      <section className="space-y-3 pt-1">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 live-beacon" />
              <span>{t.marketPulse}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {t.homeTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl font-medium">
              {t.homeSubtitle}
            </p>
          </div>

          {/* Compact Market Pulse Stat Pills (Single Horizontal Bar) */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {/* Open Bidding Pill */}
            <div className="flex items-center gap-2.5 rounded-2xl bg-white border border-slate-200/90 px-3.5 py-2 shadow-2xs shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 live-beacon" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-600">{t.openBidding}</div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">{liveCount} Issues</div>
              </div>
            </div>

            {/* Top GMP Today Pill */}
            {highestGmpIpo && (
              <Link
                href={`/ipo/${highestGmpIpo.slug}`}
                className="flex items-center gap-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 px-3.5 py-2 shadow-2xs shrink-0 hover:border-emerald-300 transition group"
              >
                <Flame className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-800">{t.topGmpToday}</div>
                  <div className="text-xs sm:text-sm font-extrabold text-emerald-700">
                    +{highestGmpIpo.currentListingGainPct}%{' '}
                    <span className="text-[11px] font-semibold text-slate-600 font-sans">
                      ({highestGmpIpo.symbol})
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Upcoming Pill */}
            <div className="flex items-center gap-2.5 rounded-2xl bg-white border border-slate-200/90 px-3.5 py-2 shadow-2xs shrink-0">
              <Calendar className="h-4 w-4 text-amber-600" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-600">{t.upcoming}</div>
                <div className="text-xs sm:text-sm font-extrabold text-amber-800">{upcomingCount} Filed</div>
              </div>
            </div>

            {/* Total Tracked Pill */}
            <div className="flex items-center gap-2.5 rounded-2xl bg-white border border-slate-200/90 px-3.5 py-2 shadow-2xs shrink-0">
              <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-600">{t.all}</div>
                <div className="text-xs sm:text-sm font-extrabold text-indigo-700">{ipos.length} Total</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listings Section */}
      <section className="space-y-4 sm:space-y-6">
        
        {/* Navigation Tabs and Category Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          
          {/* Primary Status Tabs: Active IPO / Allotment & listed / Upcoming / All */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200 overflow-x-auto scrollbar-none">
            {/* 1. Active IPO */}
            <button
              onClick={() => setActiveTab('active')}
              className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === 'active'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 live-beacon" />
              <span>{t.activeIpo}</span>
              <span className="rounded-full bg-indigo-50 px-1.5 py-0.2 text-[10px] text-indigo-700 font-extrabold">
                {liveCount}
              </span>
            </button>

            {/* 2. Allotment & listed */}
            <button
              onClick={() => setActiveTab('allotment_listed')}
              className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === 'allotment_listed'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{t.allotmentListed}</span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
                {listedCount}
              </span>
            </button>

            {/* 3. Upcoming */}
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === 'upcoming'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{t.upcoming}</span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
                {upcomingCount}
              </span>
            </button>

            {/* 4. All */}
            <button
              onClick={() => setActiveTab('all')}
              className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === 'all'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{t.all}</span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
                {ipos.length}
              </span>
            </button>
          </div>

          {/* Category Chips and Quick Filter Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1 text-xs font-bold">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedCategory === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {t.all}
              </button>
              <button
                onClick={() => setSelectedCategory('mainboard')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedCategory === 'mainboard' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {t.mainboard}
              </button>
              <button
                onClick={() => setSelectedCategory('sme')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedCategory === 'sme' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {t.sme}
              </button>
            </div>

            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder={t.filterByName}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full sm:w-44 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredIpos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredIpos.map((ipo) => (
              <IpoCard key={ipo.id} ipo={ipo} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 sm:p-12 text-center text-slate-500">
            <p className="text-sm font-semibold">No IPOs found matching the current filters.</p>
            <button
              onClick={() => {
                setActiveTab('active');
                setSelectedCategory('all');
                setSearchFilter('');
              }}
              className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>

      {/* Premium Top GMP Gainers Today Panel - Clean, Consistent Fintech Typography */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
              <Flame className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Top Grey Market Premium (GMP) Gainers Today
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 live-beacon" />
                  Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Highest estimated listing profit per application across active and upcoming issues
              </p>
            </div>
          </div>

          <Link
            href="/gmp"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 self-start sm:self-auto"
          >
            <span>View All GMP Rates</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Universal Cards Grid for Top Gainers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {topMovers.map((item, idx) => (
            <IpoCard key={item.id} ipo={item} rank={idx + 1} />
          ))}
        </div>

        {/* Desktop View (>= 768px): Refined, Harmonious Table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-slate-800">
            <thead className="bg-slate-50/90 uppercase text-xs tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3.5 px-5 whitespace-nowrap">Rank & IPO Name</th>
                <th className="py-3.5 px-5 whitespace-nowrap">Category & Lot</th>
                <th className="py-3.5 px-5 whitespace-nowrap">Issue Price</th>
                <th className="py-3.5 px-5 text-emerald-700 whitespace-nowrap">GMP Today</th>
                <th className="py-3.5 px-5 whitespace-nowrap">Est. Gain %</th>
                <th className="py-3.5 px-5 whitespace-nowrap">Est. Profit / Application</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap">Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm">
              {topMovers.map((item, idx) => {
                const profitPerLot = item.currentGmp * item.lotSize;
                return (
                  <tr key={item.id} className="hover:bg-indigo-50/20 transition-colors group">
                    {/* Rank & IPO Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-xs ${
                          idx === 0 
                            ? 'bg-amber-400 text-amber-950 font-bold' 
                            : idx === 1 
                            ? 'bg-slate-200 text-slate-800 font-bold' 
                            : idx === 2 
                            ? 'bg-orange-200 text-orange-950 font-bold' 
                            : 'bg-slate-100 text-slate-600 font-semibold'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <Link 
                            href={`/ipo/${item.slug}`} 
                            className="hover:text-indigo-600 transition text-sm font-bold text-slate-900 block tracking-tight group-hover:underline"
                          >
                            {item.name}
                          </Link>
                          <div className="text-xs font-mono text-slate-400 mt-0.5">
                            NSE/BSE: {item.symbol}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Lot */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className={`uppercase text-xs px-2.5 py-0.5 rounded-md font-semibold inline-block ${
                        item.category === 'sme' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {item.category}
                      </span>
                      <div className="text-xs text-slate-500 mt-1">
                        Lot: {item.lotSize} shares
                      </div>
                    </td>

                    {/* Issue Price */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-800">
                        ₹{item.priceBandMax || item.priceBandMin}
                      </div>
                      <div className="text-xs text-slate-400">
                        per share
                      </div>
                    </td>

                    {/* GMP Today */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="text-base font-bold text-emerald-600">
                        +₹{item.currentGmp}
                      </div>
                      <div className="text-xs text-emerald-700/80">
                        estimated pop
                      </div>
                    </td>

                    {/* Est. Listing Gain */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-xs">
                        +{item.currentListingGainPct}%
                      </span>
                    </td>

                    {/* Profit / Lot */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="font-bold text-slate-900 text-sm">
                        +{formatCurrency(profitPerLot)}
                      </div>
                      <div className="text-xs text-slate-400">
                        per 1 retail lot
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <Link
                        href={`/ipo/${item.slug}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white px-3.5 py-1.5 text-xs font-semibold transition shadow-xs"
                      >
                        <span>Analyze</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Calendar Section on the Homepage (Right above Broker Banner & Footer) */}
      <section className="pt-2">
        <CalendarSection ipos={ipos} limit={6} showViewAll={true} />
      </section>

      {/* Broker Apply Banner */}
      <BrokerCtaBanner variant="full" />

      {/* Notification Modal */}
      {notifModalOpen && <NotificationModal onClose={() => setNotifModalOpen(false)} />}
    </div>
  );
}
