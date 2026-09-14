'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Flame } from 'lucide-react';
import { getStoredIpos } from '@/lib/ipoStore';
import { IPO } from '@/types/ipo';

export default function TickerStrip() {
  const [ipos, setIpos] = useState<IPO[]>([]);

  useEffect(() => {
    setIpos(getStoredIpos());
    const handleUpdate = () => setIpos(getStoredIpos());
    window.addEventListener('ipoDataUpdated', handleUpdate);
    return () => window.removeEventListener('ipoDataUpdated', handleUpdate);
  }, []);

  const activeGmpIpos = ipos.filter((i) => i.currentGmp > 0);

  if (activeGmpIpos.length === 0) return null;

  const tickerItems = [...activeGmpIpos, ...activeGmpIpos, ...activeGmpIpos];

  return (
    <div className="relative flex w-full items-center border-b border-slate-200/90 bg-slate-50/90 py-2 overflow-hidden text-xs">
      {/* Fixed Live Label on Left */}
      <div className="z-10 flex shrink-0 items-center gap-1.5 bg-slate-50 px-3.5 font-bold text-indigo-700 border-r border-slate-200 shadow-sm">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 live-beacon" />
        <span className="uppercase tracking-wider text-[11px]">Today&apos;s GMP</span>
        <Flame className="h-3.5 w-3.5 text-amber-500" />
      </div>

      {/* Marquee Wrapper */}
      <div className="flex overflow-hidden whitespace-nowrap">
        <div className="animate-ticker flex items-center gap-5 pl-4">
          {tickerItems.map((ipo, idx) => (
            <Link
              key={`${ipo.id}-${idx}`}
              href={`/ipo/${ipo.slug}`}
              className="flex items-center gap-2 rounded-full bg-white px-3 py-1 border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-sm transition-all group"
            >
              <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {ipo.name}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">
                {ipo.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                <TrendingUp className="h-3 w-3" />
                +₹{ipo.currentGmp} (+{ipo.currentListingGainPct}%)
              </span>
              {ipo.currentSubscription > 0 && (
                <span className="text-[11px] font-semibold text-slate-500">
                  <strong className="text-indigo-600">{ipo.currentSubscription}x</strong> sub
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
