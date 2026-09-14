import React from 'react';
import { Users, Building, Layers, Sparkles } from 'lucide-react';
import { IPO } from '@/types/ipo';

interface Props {
  ipo: IPO;
}

export default function SubscriptionTable({ ipo }: Props) {
  const history = ipo.subscriptionHistory || [];
  const latest = history[history.length - 1];

  return (
    <div className="space-y-6">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-indigo-600" />
            <span>Retail (RII)</span>
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {latest?.retailMultiplier ? `${latest.retailMultiplier}x` : 'N/A'}
          </div>
          <div className="text-[10px] font-medium text-slate-400 mt-0.5">
            Quota: {ipo.retailQuotaPct}% of issue
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 text-indigo-600" />
            <span>QIB Portion</span>
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {latest?.qibMultiplier ? `${latest.qibMultiplier}x` : 'N/A'}
          </div>
          <div className="text-[10px] font-medium text-slate-400 mt-0.5">
            Quota: {ipo.qibQuotaPct}% of issue
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-purple-600" />
            <span>NII / HNI</span>
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {latest?.niiMultiplier ? `${latest.niiMultiplier}x` : 'N/A'}
          </div>
          <div className="text-[10px] font-medium text-slate-400 mt-0.5">
            Quota: {ipo.niiQuotaPct}% of issue
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-indigo-700 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Total Subscribed</span>
          </div>
          <div className="mt-1 text-2xl font-black text-indigo-700">
            {latest?.totalMultiplier ? `${latest.totalMultiplier}x` : 'N/A'}
          </div>
          <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
            {latest?.totalMultiplier && latest.totalMultiplier >= 1 ? 'Over-Subscribed' : 'Bidding in progress'}
          </div>
        </div>
      </div>

      {/* Subscription Breakdown Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Day-Wise Subscription History (BSE + NSE)
          </h4>
          <span className="text-xs font-medium text-slate-500">
            Official exchange counters
          </span>
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase text-[11px] tracking-wider text-slate-500 border-b border-slate-200 font-bold">
                <tr>
                  <th className="px-5 py-3">Day / Date</th>
                  <th className="px-5 py-3">QIB (x)</th>
                  <th className="px-5 py-3">NII (x)</th>
                  <th className="px-5 py-3">Retail (x)</th>
                  <th className="px-5 py-3 text-indigo-700">Total (x)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {history.map((record) => (
                  <tr key={record.day} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-sans font-bold text-slate-900">
                      Day {record.day} ({record.date})
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {record.qibMultiplier}x
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {record.niiMultiplier}x
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-700">
                      {record.retailMultiplier}x
                    </td>
                    <td className="px-5 py-3.5 font-black text-indigo-600">
                      {record.totalMultiplier}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            Subscription data will be recorded once bidding commences on {ipo.openDate}.
          </div>
        )}
      </div>
    </div>
  );
}
