import React from 'react';
import Link from 'next/link';

interface Props {
  format?: 'leaderboard' | 'rectangle' | 'in-feed';
  label?: string;
}

export default function AdSlot({ format = 'leaderboard', label = 'Sponsored / Ad' }: Props) {
  if (format === 'rectangle') {
    return (
      <div className="w-full rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-4 text-center">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
          {label}
        </div>
        <div className="flex h-60 w-full flex-col items-center justify-center rounded-xl bg-gradient-to-b from-slate-800/30 to-slate-950/50 border border-white/5 p-4 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Direct Sponsorship Placement</span>
          <span className="text-[11px] text-slate-500 mt-1">300x250 Medium Rectangle Slot</span>
          <Link
            href="/advertise"
            className="mt-3 rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-cyan-400 hover:bg-slate-700 transition"
          >
            Advertise Here
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 w-full rounded-xl border border-dashed border-white/10 bg-slate-900/30 p-2 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
        {label}
      </div>
      <div className="flex h-20 w-full items-center justify-between rounded-lg bg-gradient-to-r from-slate-900/50 via-slate-800/20 to-slate-900/50 px-4 text-xs text-slate-400">
        <div className="text-left">
          <span className="font-medium text-slate-300">Target 250,000+ Active Retail IPO Investors</span>
          <div className="text-[11px] text-slate-500">Reach high-net-worth investors right before bidding decisions</div>
        </div>
        <Link
          href="/advertise"
          className="rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition shrink-0"
        >
          Partner With Us
        </Link>
      </div>
    </div>
  );
}
