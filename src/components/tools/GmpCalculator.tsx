'use client';

import React, { useState } from 'react';
import { Calculator, AlertCircle } from 'lucide-react';
import { IPO } from '@/types/ipo';
import { formatCurrency } from '@/lib/ipoStore';

interface Props {
  ipo: IPO;
}

export default function GmpCalculator({ ipo }: Props) {
  const [lots, setLots] = useState<number>(1);
  const [customGmp, setCustomGmp] = useState<number>(ipo.currentGmp);

  const capPrice = ipo.priceBandMax || ipo.priceBandMin;
  const totalShares = lots * ipo.lotSize;
  const totalInvestment = totalShares * capPrice;
  const expectedProfit = totalShares * customGmp;
  const expectedTotalValue = totalInvestment + expectedProfit;
  const profitPct = totalInvestment > 0 ? ((expectedProfit / totalInvestment) * 100).toFixed(2) : '0';

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900">
            GMP Profit & Listing Gain Calculator
          </h4>
          <p className="text-xs text-slate-500">
            Calculate your expected profit per lot or custom application size
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Number of Lots:
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 5, 10, 13].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLots(l)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    lots === l
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {l} {l === 1 ? 'Lot' : 'Lots'}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs font-medium text-slate-500">
              {lots} Lot = <strong className="text-slate-800">{totalShares} Shares</strong> ({ipo.lotSize} shares/lot)
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Grey Market Premium (₹ per share):
              </label>
              <button
                type="button"
                onClick={() => setCustomGmp(ipo.currentGmp)}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                Reset to Live (₹{ipo.currentGmp})
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-2 text-sm text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={customGmp}
                onChange={(e) => setCustomGmp(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-8 pr-4 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Calculation Result */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-semibold">Total Investment</span>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {formatCurrency(totalInvestment)}
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Est. Listing Value</span>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                {formatCurrency(expectedTotalValue)}
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-200/80 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">
                Expected Profit on Allotment:
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800">
                +{profitPct}%
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-700 mt-1">
              +{formatCurrency(expectedProfit)}
            </div>
          </div>

          <div className="flex items-start gap-1.5 text-[11px] text-slate-500 pt-1">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Computerized lottery determines allotment in oversubscribed retail issues.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
