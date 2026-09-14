'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, ChevronRight, Filter, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { getStoredIpos, formatCurrency } from '@/lib/ipoStore';
import { IPO } from '@/types/ipo';

export default function IpoCalendarPage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'open' | 'close' | 'allotment' | 'listing'>('all');

  useEffect(() => {
    setIpos(getStoredIpos());
    const handleUpdate = () => setIpos(getStoredIpos());
    window.addEventListener('ipoDataUpdated', handleUpdate);
    return () => window.removeEventListener('ipoDataUpdated', handleUpdate);
  }, []);

  interface CalendarEvent {
    id: string;
    date: string;
    type: 'open' | 'close' | 'allotment' | 'listing';
    actionText: string;
    ipo: IPO;
  }

  const events: CalendarEvent[] = [];
  ipos.forEach((ipo) => {
    if (ipo.openDate) {
      events.push({
        id: `${ipo.id}-open`,
        date: ipo.openDate,
        type: 'open',
        actionText: 'Bidding Opens',
        ipo,
      });
    }
    if (ipo.closeDate) {
      events.push({
        id: `${ipo.id}-close`,
        date: ipo.closeDate,
        type: 'close',
        actionText: 'Bidding Closes (5 PM)',
        ipo,
      });
    }
    if (ipo.allotmentDate) {
      events.push({
        id: `${ipo.id}-allotment`,
        date: ipo.allotmentDate,
        type: 'allotment',
        actionText: 'Allotment Declaration',
        ipo,
      });
    }
    if (ipo.listingDate) {
      events.push({
        id: `${ipo.id}-listing`,
        date: ipo.listingDate,
        type: 'listing',
        actionText: 'Stock Exchange Listing',
        ipo,
      });
    }
  });

  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const getEventMeta = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'open':
        return {
          label: 'OPENS',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dateBoxClass: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          monthClass: 'text-emerald-700',
        };
      case 'close':
        return {
          label: 'CLOSES',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          dateBoxClass: 'bg-amber-50 border-amber-200 text-amber-900',
          monthClass: 'text-amber-700',
        };
      case 'allotment':
        return {
          label: 'ALLOTMENT',
          badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
          dateBoxClass: 'bg-purple-50 border-purple-200 text-purple-900',
          monthClass: 'text-purple-700',
        };
      case 'listing':
        return {
          label: 'LISTING DAY',
          badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dateBoxClass: 'bg-indigo-50 border-indigo-200 text-indigo-900',
          monthClass: 'text-indigo-700',
        };
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Header Banner - Clean, High Readability Light Aesthetic */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Indian IPO Calendar (2026)
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                Key dates for active, upcoming, allotment, and listing schedules
              </p>
            </div>
          </div>
        </div>

        {/* Meaningful Visual Color Code Legend */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Color Legend:
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Bidding Opens
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Closes Today
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">
            <span className="h-2 w-2 rounded-full bg-purple-500" /> Allotment Out
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
            <span className="h-2 w-2 rounded-full bg-indigo-500" /> Listing Day
          </span>
        </div>
      </div>

      {/* Filter Chips - Horizontal Touch Scrollable on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </span>
        {[
          { key: 'all', label: 'All Events' },
          { key: 'open', label: '🟢 Bidding Open' },
          { key: 'close', label: '🟠 Bidding Close' },
          { key: 'allotment', label: '🟣 Allotment' },
          { key: 'listing', label: '🔵 Listing Day' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key as any)}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === f.key
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Events List - Mobile-First Responsive Cards */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => {
          const meta = getEventMeta(evt.type);
          const eventDate = new Date(evt.date);
          const monthShort = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
          const dayNum = eventDate.getDate();

          return (
            <div
              key={evt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3.5">
                {/* Date Badge - Clean, Balanced Size */}
                <div
                  className={`flex flex-col items-center justify-center rounded-2xl border w-14 h-14 text-center shadow-xs shrink-0 ${meta.dateBoxClass}`}
                >
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${meta.monthClass}`}>
                    {monthShort}
                  </span>
                  <span className="text-lg font-bold leading-tight">
                    {dayNum}
                  </span>
                </div>

                {/* Event Details */}
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${meta.badgeClass}`}
                    >
                      {meta.label}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-500">
                      {evt.ipo.symbol}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase ${
                      evt.ipo.category === 'sme' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      {evt.ipo.category}
                    </span>
                  </div>

                  <Link href={`/ipo/${evt.ipo.slug}`} className="block">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                      {evt.ipo.name}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{evt.actionText}</span>
                    <span>•</span>
                    <span>Issue: <strong className="text-slate-800 font-semibold">₹{evt.ipo.priceBandMax || evt.ipo.priceBandMin}</strong></span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      GMP: +₹{evt.ipo.currentGmp} (+{evt.ipo.currentListingGainPct}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link - Full width on phone, compact on tablet/desktop */}
              <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex justify-end">
                <Link
                  href={`/ipo/${evt.ipo.slug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-4 py-2 text-xs font-bold text-slate-700 transition"
                >
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
