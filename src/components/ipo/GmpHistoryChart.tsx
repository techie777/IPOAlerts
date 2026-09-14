import React from 'react';
import { TrendingUp, HelpCircle } from 'lucide-react';
import { IPO } from '@/types/ipo';
import { formatCurrency } from '@/lib/ipoStore';

interface Props {
  ipo: IPO;
}

export default function GmpHistoryChart({ ipo }: Props) {
  const capPrice = ipo.priceBandMax || ipo.priceBandMin;
  const history = ipo.gmpHistory || [];

  return (
    <div className="space-y-6">
      {/* Daily Movement Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Daily GMP Movement Timeline
            </h4>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Updated daily
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase text-[11px] tracking-wider text-slate-500 border-b border-slate-200 font-bold">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Issue Price</th>
                <th className="px-5 py-3 text-emerald-700">GMP Today (₹)</th>
                <th className="px-5 py-3">Est. Listing Price</th>
                <th className="px-5 py-3">Est. Gain (%)</th>
                <th className="px-5 py-3">Kostak</th>
                <th className="px-5 py-3">Subject to Sauda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {history.map((record) => {
                const estPrice = capPrice + record.gmpValue;
                return (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-sans font-bold text-slate-900">
                      {record.date}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      ₹{capPrice}
                    </td>
                    <td className="px-5 py-3.5 font-black text-emerald-600">
                      +₹{record.gmpValue}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      ₹{estPrice}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700">
                        +{record.estimatedListingGainPct}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {record.kostakRate ? `₹${record.kostakRate}` : '-'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {record.saudaRate ? `₹${record.saudaRate}` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanatory Glossary Card */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <HelpCircle className="h-4 w-4 text-indigo-600" />
          <span>Grey Market Glossary</span>
        </div>
        <p className="text-slate-500 leading-relaxed">
          <strong>GMP (Grey Market Premium):</strong> Unofficial premium above the IPO issue price before listing. <strong>Kostak:</strong> Fixed profit paid per application regardless of allotment. <strong>Subject to Sauda:</strong> Profit paid only if shares are allotted.
        </p>
      </div>
    </div>
  );
}
