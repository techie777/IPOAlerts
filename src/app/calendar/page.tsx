'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { getStoredIpos } from '@/lib/ipoStore';
import { IPO } from '@/types/ipo';
import IpoCard from '@/components/ipo/IpoCard';

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

        {/* Interactive Filter Pills (serves as interactive filter and visual legend) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-4 border-t border-slate-100 scrollbar-none">
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
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
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
        {filteredEvents.map((evt) => (
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
