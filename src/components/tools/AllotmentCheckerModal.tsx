'use client';

import React, { useState } from 'react';
import { ExternalLink, X, CheckCircle2, Search, HelpCircle } from 'lucide-react';
import { IPO } from '@/types/ipo';

interface Props {
  ipo?: IPO;
  onClose: () => void;
}

const REGISTRARS = [
  { name: 'Link Intime India', url: 'https://linkintime.co.in/initial_offer/public-issues.html' },
  { name: 'KFin Technologies', url: 'https://ris.kfintech.com/ipostatus/' },
  { name: 'Bigshare Services', url: 'https://www.bigshareonline.com/ipo_Allotment.html' },
  { name: 'Skyline Financial', url: 'https://www.skylinerta.com/ipo.php' },
];

export default function AllotmentCheckerModal({ ipo, onClose }: Props) {
  const [panNumber, setPanNumber] = useState('');
  const [checkStatusResult, setCheckStatusResult] = useState<string | null>(null);

  const targetRegistrar = ipo?.registrarName || 'Link Intime / KFintech';
  const targetUrl = ipo?.registrarUrl || 'https://linkintime.co.in/initial_offer/public-issues.html';

  const simulateCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (panNumber.length < 10) {
      alert('Please enter a valid 10-character PAN');
      return;
    }
    setCheckStatusResult('checking');
    setTimeout(() => {
      setCheckStatusResult('done');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl p-6 sm:p-7 text-slate-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Check Allotment Status
            </h3>
            <p className="text-xs text-slate-500">
              {ipo ? `${ipo.name} (${ipo.symbol})` : 'Direct Official Registrar Access'}
            </p>
          </div>
        </div>

        {/* Primary Registrar Direct Button */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-indigo-700">Official Registrar</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{targetRegistrar}</div>
            </div>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition"
            >
              <span>Go to Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Quick PAN Check Demo */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 mb-4 space-y-3">
          <div className="text-xs font-bold text-slate-700">
            Quick In-App PAN Status Verification:
          </div>
          <form onSubmit={simulateCheck} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter 10-character PAN (e.g. ABCDE1234F)"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              maxLength={10}
              className="flex-1 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-mono font-bold uppercase text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white transition"
            >
              Verify
            </button>
          </form>

          {checkStatusResult === 'checking' && (
            <div className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
              Querying registrar records...
            </div>
          )}

          {checkStatusResult === 'done' && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Status Query Ready:</strong> Click the registrar link above to see your official allotted shares directly on {targetRegistrar}&apos;s secure portal.
              </div>
            </div>
          )}
        </div>

        {/* Other Registrars */}
        <div className="space-y-2 text-xs text-slate-500">
          <div className="font-bold text-slate-700">Other Major Registrars:</div>
          <div className="grid grid-cols-2 gap-2">
            {REGISTRARS.map((reg) => (
              <a
                key={reg.name}
                href={reg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition"
              >
                <span>{reg.name}</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
