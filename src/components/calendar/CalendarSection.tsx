'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, ChevronRight, Filter, ArrowRight } from 'lucide-react';
import { IPO } from '@/types/ipo';

interface Props {
  ipos: IPO[];
  limit?: number;
  showViewAll?: boolean;
}

interface CalendarEvent {
  id: string;
  date: string;
  type: 'open' | 'close' | 'allotment' | 'listing';
  actionText: string;
  ipo: IPO;
}

export default function CalendarSection({ ipos, limit, showViewAll = true }: Props) {
  const [filterType, setFilterType] = useState<'all' | 'open' | 'close' | 'allotment' | 'listing'>('all');

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

  const displayedEvents = limit ? filteredEvents.slice(0, limit) : filteredEvents;

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
    <div className="space-y-4">
      {/* Header & Interactive Filter Bar */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-slate-900 font-heading">
                  IPO Calendar & Key Schedule
                </h2>
                <span className="rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 tabular-nums">
                  {events.length} Events
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Track live bidding windows, allotment declaration dates, and listing days
              </p>
            </div>
          </div>

          {showViewAll && (
            <Link
              href="/calendar"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              <span>Full Calendar</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Interactive Filter Pills (Also acts as the visual status color legend) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-3 scrollbar-none">
          {[
            { key: 'all', label: 'All Events', dot: null },
            { key: 'open', label: 'Bidding Open', dot: 'bg-emerald-500' },
            { key: 'close', label: 'Closes Today', dot: 'bg-amber-500' },
            { key: 'allotment', label: 'Allotment Out', dot: 'bg-purple-500' },
            { key: 'listing', label: 'Listing Day', dot: 'bg-indigo-500' },
          ].map((f) => {
            const isSelected = filterType === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key as any)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                {f.dot && (
                  <span
                    className={`h-2 w-2 rounded-full ${f.dot} ${
                      isSelected ? 'ring-2 ring-white/60' : ''
                    }`}
                  />
                )}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-2.5">
        {displayedEvents.map((evt) => {
          const meta = getEventMeta(evt.type);
          const eventDate = new Date(evt.date);
          const monthShort = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
          const dayNum = eventDate.getDate();

          return (
            <div
              key={evt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-300 hover:shadow-xs transition-all group"
            >
              <div className="flex items-start gap-3.5">
                {/* Date Box */}
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

              {/* Action Link */}
              <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex justify-end">
                <Link
                  href={`/ipo/${evt.ipo.slug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition shadow-xs"
                >
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
