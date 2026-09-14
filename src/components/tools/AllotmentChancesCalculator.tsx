'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Layers
} from 'lucide-react';
import { IPO } from '@/types/ipo';
import { formatCurrency } from '@/lib/ipoStore';

interface Props {
  ipo: IPO;
}

export default function AllotmentChancesCalculator({ ipo }: Props) {
  // Extract latest retail subscription from history or default to 31x (the classic benchmark)
  const latestSub =
    ipo.subscriptionHistory && ipo.subscriptionHistory.length > 0
      ? ipo.subscriptionHistory[ipo.subscriptionHistory.length - 1]
      : null;

  const defaultRetail =
    latestSub?.retailMultiplier && latestSub.retailMultiplier > 0
      ? Number(latestSub.retailMultiplier.toFixed(1))
      : ipo.currentSubscription > 0
      ? Number((ipo.currentSubscription * 0.4).toFixed(1))
      : 31.0;

  const [retailSub, setRetailSub] = useState<number>(defaultRetail > 0 ? defaultRetail : 31.0);
  const [numApplications, setNumApplications] = useState<number>(1);

  const capPrice = ipo.priceBandMax || ipo.priceBandMin;
  const singleAppAmount = capPrice * ipo.lotSize;
  const totalInvestment = singleAppAmount * numApplications;

  // Single Application Allotment Probability: 1 / R
  const singleAppProb = retailSub > 0 ? Math.min(100, (1 / retailSub) * 100) : 100;

  // Probability of getting AT LEAST 1 allotment with N distinct applications:
  // Formula: 1 - (1 - 1/R)^N
  const atLeastOneProb =
    retailSub > 1
      ? (1 - Math.pow(1 - 1 / retailSub, numApplications)) * 100
      : 100;

  // Rule of thumb applications needed for ~63.2% chance (1 - 1/e): ~ retailSub
  const recommendedApps = Math.max(1, Math.round(retailSub));

  // Matrix tiers to display
  const matrixTiers = [
    1,
    2,
    3,
    5,
    10,
    15,
    20,
    Math.round(retailSub),
    Math.round(retailSub * 1.5),
  ]
    .filter((v, i, a) => v > 0 && a.indexOf(v) === i)
    .sort((a, b) => a - b)
    .slice(0, 8);

  const getProbColor = (prob: number) => {
    if (prob >= 75) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (prob >= 40) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (prob >= 15) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-slate-700 bg-slate-50 border-slate-200';
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-100 mb-1.5">
            <Calculator className="h-3.5 w-3.5 text-indigo-600" />
            <span>Retail Allotment Matrix Calculator</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Chances of Getting Allotment in {ipo.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Determine how many distinct family PAN applications you need to secure at least 1 lot.
          </p>
        </div>

        {/* Quick Rule Tag */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3 text-right sm:max-w-xs shrink-0">
          <div className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
            SEBI Lottery Rule
          </div>
          <div className="text-xs font-extrabold text-emerald-900 mt-0.5">
            1 in {Math.round(retailSub)} Retail Applicants Selected
          </div>
        </div>
      </div>

      {/* Interactive Controls & Live Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
          {/* Input 1: Retail Subscription Multiplier */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <label htmlFor="retailSubInput">Retail Subscription (x Times)</label>
              <span className="text-indigo-600 font-extrabold text-sm">{retailSub}x</span>
            </div>
            <input
              id="retailSubInput"
              type="range"
              min={1}
              max={150}
              step={0.5}
              value={retailSub}
              onChange={(e) => setRetailSub(parseFloat(e.target.value) || 1)}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[5, 15, 31, 50, 75, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRetailSub(preset)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                    retailSub === preset
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {preset}x
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Number of Family / Unique Applications */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <label htmlFor="numAppsInput">Applications (Different PANs)</label>
              <span className="text-indigo-600 font-extrabold text-sm">
                {numApplications} {numApplications === 1 ? 'App' : 'Apps'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNumApplications(Math.max(1, numApplications - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 shadow-2xs"
              >
                -
              </button>
              <input
                id="numAppsInput"
                type="number"
                min={1}
                max={100}
                value={numApplications}
                onChange={(e) => setNumApplications(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full h-9 rounded-xl border border-slate-200 bg-white text-center text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setNumApplications(numApplications + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 shadow-2xs"
              >
                +
              </button>
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[1, 2, 3, 5, 10, recommendedApps].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNumApplications(p)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                    numApplications === p
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {p === recommendedApps ? `${p} (Target)` : `${p} App`}
                </button>
              ))}
            </div>
          </div>

          {/* Capital Blocked */}
          <div className="pt-2 border-t border-slate-200 text-xs flex items-center justify-between text-slate-600">
            <span>Capital Required:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {formatCurrency(totalInvestment)}
            </span>
          </div>
        </div>

        {/* Calculation Result Cards (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Metric 1: Single Application Odds */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                1 Application Chance
              </div>
              <div className="mt-1 text-2xl font-black text-slate-900">
                {singleAppProb.toFixed(2)}%
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Exact odds: <strong>1 in {Math.round(retailSub)}</strong>
              </div>
            </div>

            {/* Metric 2: Your Combined Chance with N Applications */}
            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-white p-4">
              <div className="text-[11px] font-bold uppercase text-indigo-700 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-600" />
                <span>Chance with {numApplications} App{numApplications > 1 ? 's' : ''}</span>
              </div>
              <div className="mt-1 text-2xl font-black text-indigo-700">
                {atLeastOneProb.toFixed(1)}%
              </div>
              <div className="text-xs text-indigo-900/80 mt-0.5">
                {atLeastOneProb >= 50
                  ? 'High probability of securing ≥1 lot'
                  : 'Consider applying through more accounts'}
              </div>
            </div>
          </div>

          {/* Explanation Callout Banner */}
          <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4 text-xs text-amber-900 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>How the {retailSub}x Formula Works:</strong>
                <p className="mt-1 text-amber-800">
                  If the retail portion is subscribed <strong>{retailSub}x</strong> times, only{' '}
                  <strong>1 out of {Math.round(retailSub)} retail applicants</strong> will be allotted 1 minimum lot via the computer lottery.
                  This indicates that to guarantee strong probability of getting at least 1 application selected, you should file{' '}
                  <strong className="text-amber-950 font-extrabold underline decoration-amber-400">
                    ~{recommendedApps} different applications
                  </strong>{' '}
                  across family members (each with a unique PAN).
                </p>
              </div>
            </div>
          </div>

          {/* SEBI Compliance Reminder */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 px-1">
            <ShieldAlert className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>
              <strong>Important:</strong> Multiple bids under the same PAN will be rejected by the registrar. Always use separate PAN accounts.
            </span>
          </div>
        </div>
      </div>

      {/* Comparative Matrix Table */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-indigo-600" />
            <span>Allotment Odds Probability Matrix ({retailSub}x Retail Subscription)</span>
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">Indicative Benchmark</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Applications (PANs)</th>
                <th className="py-2.5 px-3">Capital Blocked</th>
                <th className="py-2.5 px-3">Allotment Probability</th>
                <th className="py-2.5 px-3">Selection Odds</th>
                <th className="py-2.5 px-3 text-right">Confidence Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {matrixTiers.map((n) => {
                const prob =
                  retailSub > 1
                    ? (1 - Math.pow(1 - 1 / retailSub, n)) * 100
                    : 100;
                const cost = singleAppAmount * n;
                const isSelected = n === numApplications;

                return (
                  <tr
                    key={n}
                    onClick={() => setNumApplications(n)}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? 'bg-indigo-50/80 font-bold text-indigo-950'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />}
                        <span>{n} Application{n > 1 ? 's' : ''}</span>
                        {n === recommendedApps && (
                          <span className="rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2">
                            Match Rule
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{formatCurrency(cost)}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              prob >= 60
                                ? 'bg-emerald-500'
                                : prob >= 30
                                ? 'bg-indigo-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, prob)}%` }}
                          />
                        </div>
                        <span className="font-extrabold">{prob.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      ~1 in {(100 / Math.max(0.1, prob)).toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-bold border ${getProbColor(
                          prob
                        )}`}
                      >
                        {prob >= 80
                          ? 'Very High'
                          : prob >= 50
                          ? 'High (>50%)'
                          : prob >= 25
                          ? 'Moderate'
                          : 'Low'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
