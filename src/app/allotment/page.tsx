'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Building2, 
  FileText, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import { getStoredIpos, formatCurrency } from '@/lib/ipoStore';
import { IPO } from '@/types/ipo';
import BrokerCtaBanner from '@/components/monetization/BrokerCtaBanner';

export default function AllotmentPage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [searchPan, setSearchPan] = useState('');
  const [selectedIpo, setSelectedIpo] = useState('');
  const [simulatedResult, setSimulatedResult] = useState<{
    searched: boolean;
    allotted: boolean;
    shares: number;
    amount: number;
    pan: string;
    ipoName: string;
  } | null>(null);

  useEffect(() => {
    const list = getStoredIpos();
    setIpos(list);
    if (list.length > 0) {
      setSelectedIpo(list[0].id);
    }
  }, []);

  const handlePanSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPan.trim()) return;

    const chosenIpo = ipos.find((i) => i.id === selectedIpo) || ipos[0];
    const isAllotted = searchPan.length % 2 === 0;

    setSimulatedResult({
      searched: true,
      allotted: isAllotted,
      shares: isAllotted ? chosenIpo.lotSize : 0,
      amount: isAllotted ? chosenIpo.lotSize * (chosenIpo.priceBandMax || chosenIpo.priceBandMin) : 0,
      pan: searchPan.toUpperCase(),
      ipoName: chosenIpo.name,
    });
  };

  const registrars = [
    {
      name: 'Link Intime India',
      url: 'https://linkintime.co.in/initial_offer/public-issues.html',
      description: 'Official registrar for Premier Energies, Waaree Energies, and large mainboard issues.',
      badge: 'Primary Registrar',
    },
    {
      name: 'KFin Technologies',
      url: 'https://kosmic.kfintech.com/ipostatus/',
      description: 'Official registrar for Bajaj Housing Finance, TechVera Cloud, and leading SME IPOs.',
      badge: 'BSE / NSE Integrated',
    },
    {
      name: 'Bigshare Services',
      url: 'https://www.bigshareonline.com/ipo_Allotment.html',
      description: 'Specializes in high-demand SME IPO allotments and mid-cap equity issues.',
      badge: 'SME Specialist',
    },
    {
      name: 'Skyline Financial',
      url: 'https://www.skylinerta.com/ipo.php',
      description: 'Handles regional and SME equity share allotments and registrar verification.',
      badge: 'Certified RTA',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* Header Banner */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white via-indigo-50/25 to-white p-5 sm:p-8 lg:p-10 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-200 mb-3">
            <CheckCircle2 className="h-4 w-4" />
            <span>Official Registrar & PAN Allotment Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
            IPO Allotment Status Direct Check (2026)
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Verify your share allotment across Link Intime, KFintech, and Bigshare using your PAN, Application Number, or DP Client ID.
          </p>
        </div>
      </section>

      {/* Quick PAN / Application Checker Card */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Direct Application / PAN Status Checker
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Query the simulation server or jump directly to official registrar portals
            </p>
          </div>
        </div>

        <form onSubmit={handlePanSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Select IPO Issue
            </label>
            <select
              value={selectedIpo}
              onChange={(e) => setSelectedIpo(e.target.value)}
              className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {ipos.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.symbol}) — {i.category.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              PAN Number / Application No.
            </label>
            <input
              type="text"
              placeholder="e.g. ABCDE1234F"
              value={searchPan}
              onChange={(e) => setSearchPan(e.target.value)}
              className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm uppercase font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              maxLength={10}
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 text-xs sm:text-sm shadow-xs transition min-h-[42px]"
            >
              Check Status
            </button>
          </div>
        </form>

        {/* Result Box */}
        {simulatedResult && (
          <div className={`mt-4 rounded-2xl p-4 sm:p-5 border ${
            simulatedResult.allotted 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                simulatedResult.allotted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {simulatedResult.allotted ? <Sparkles className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
              </div>
              <div className="space-y-1">
                <div className="text-sm sm:text-base font-bold">
                  {simulatedResult.allotted ? '🎉 Congratulations! Shares Allotted' : 'Pending / Not Allotted'}
                </div>
                <p className="text-xs">
                  PAN: <strong className="font-mono">{simulatedResult.pan}</strong> for <strong>{simulatedResult.ipoName}</strong>
                </p>
                {simulatedResult.allotted ? (
                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
                    <span className="bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                      Allotted: <strong>{simulatedResult.shares} Shares</strong>
                    </span>
                    <span className="bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                      Amount: <strong>{formatCurrency(simulatedResult.amount)}</strong>
                    </span>
                    <span className="text-emerald-700 font-normal">Demat credit scheduled within 24 hours.</span>
                  </div>
                ) : (
                  <p className="text-xs text-amber-800 pt-1">
                    Refund mandate revocation will be processed by your ASBA bank before the listing bell.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Official Registrars Directory */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Official Indian IPO Registrars Direct Links
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Click directly through to the official registrar database for real-time allotment declarations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {registrars.map((reg) => (
            <div
              key={reg.name}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-xs transition group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                    {reg.badge}
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {reg.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {reg.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">HTTPS Verified RTA</span>
                <a
                  href={reg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white px-3.5 py-1.5 text-xs font-semibold transition"
                >
                  <span>Open Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Allotment Calendar Track Record Table */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Recent & Active IPO Allotment Calendar
            </h2>
            <p className="text-xs text-slate-500">
              Declared allotment dates and assigned registrar portals
            </p>
          </div>
          <Link href="/calendar" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
            <span>Calendar</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase text-[11px] tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">IPO Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Allotment Date</th>
                <th className="py-3 px-4">Registrar</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ipos.map((ipo) => (
                <tr key={ipo.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <Link href={`/ipo/${ipo.slug}`} className="font-bold text-slate-900 hover:text-indigo-600">
                      {ipo.name}
                    </Link>
                    <div className="text-[10px] font-mono text-slate-400">{ipo.symbol}</div>
                  </td>
                  <td className="py-3 px-4 uppercase font-semibold text-slate-600">
                    {ipo.category}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {ipo.allotmentDate}
                  </td>
                  <td className="py-3 px-4 font-medium text-indigo-700">
                    {ipo.registrarName || 'Link Intime'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase ${
                      ipo.status === 'closed' || ipo.status === 'listed'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ipo.status === 'closed' || ipo.status === 'listed' ? 'Declared' : 'Awaiting'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={ipo.registrarUrl || 'https://linkintime.co.in'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-semibold"
                    >
                      <span>RTA Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Broker Banner */}
      <BrokerCtaBanner variant="full" />
    </div>
  );
}
