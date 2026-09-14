'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { IPO } from '@/types/ipo';
import IpoCard from '@/components/ipo/IpoCard';

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

      {/* Events List - Standard 7-Point Information Design Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {displayedEvents.map((evt) => (
          <IpoCard
            key={evt.id}
            ipo={evt.ipo}
            calendarEvent={{
              type: evt.type,
              date: evt.date,
              actionText: evt.actionText,
            }}
          />
        ))}
      </div>
    </div>
  );
}
