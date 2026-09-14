'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  CheckCircle2, 
  Send, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Layers, 
  ArrowRight,
  Mail
} from 'lucide-react';

export default function AdvertisePage() {
  const [proModalOpen, setProModalOpen] = useState(false);
  const [checkoutSimulated, setCheckoutSimulated] = useState(false);

  const simulateCheckout = () => {
    setCheckoutSimulated(true);
    setTimeout(() => {
      setCheckoutSimulated(false);
      setProModalOpen(false);
      alert('🎉 Pro Tier activated! You will receive real-time GMP shift alerts and an ad-free experience.');
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0f172a] to-[#090d16] p-6 sm:p-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Partnerships, Monetization & Subscriptions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Partner With India&apos;s Fastest-Growing IPO Community
        </h1>
        <p className="mt-3 text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Reach over <strong>250,000+ monthly active retail and HNI investors</strong> right at the moment of peak intent when making IPO bidding decisions.
        </p>
      </div>

      {/* Two Pillars: Direct Sponsorships + Pro Subscription */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pillar 1: Direct Advertising for Fintechs / Brokers */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
              <Layers className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Direct Ad Placements for Brokers & Fintechs</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Target retail investors looking for zero-brokerage accounts, SME financing, algorithmic trading tools, and mutual funds.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Leaderboard Banner (728x90 / 320x50):</strong> Top of Homepage & GMP Tracker</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>In-Content Native Card:</strong> Embedded between IPO Details & Financials tabs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Featured Analysis Placement:</strong> Comprehensive sponsored company review</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Telegram Community Blast:</strong> Instant notification to 50,000+ active subscribers</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-950 p-5 border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Mail className="h-4 w-4 text-cyan-400" />
              <span>Contact Advertising Desk</span>
            </div>
            <p className="text-xs text-slate-400">
              Inquire about custom campaign packages, CPM rates, and lead-gen partnerships:
            </p>
            <a
              href="mailto:partnerships@ipoalerts.in"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-cyan-400 border border-slate-700 transition"
            >
              <span>partnerships@ipoalerts.in</span>
            </a>
          </div>
        </div>

        {/* Pillar 2: Pro Tier Subscription for Retail Investors */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-[#101726] to-amber-950/20 p-8 space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-bl-xl">
            PREMIUM PLAN
          </div>

          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">IPOAlerts Pro Tier</h2>
              <p className="text-xs text-slate-400 mt-1">
                For power bidders, HNIs, and serious grey market participants
              </p>
            </div>

            <div className="flex items-baseline gap-2 py-2">
              <span className="text-4xl font-black text-white">₹99</span>
              <span className="text-xs text-slate-400">/ month or ₹799 / year</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Instant Sub-Second GMP Shift Alerts:</strong> Push the exact second GMP moves</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>100% Ad-Free Experience:</strong> Ultra-fast, zero banner distraction</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Multi-PAN Allotment Tracker:</strong> Track all your family applications in one unified dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Early DRHP Access:</strong> Advance intelligence before public filing release</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setProModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition"
          >
            <span>Preview Pro Subscription (Instant Demo)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Pro Checkout Modal Simulation */}
      {proModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                <span className="font-bold text-white text-sm">Razorpay UPI Checkout Demo</span>
              </div>
              <button
                onClick={() => setProModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Plan:</span>
                <span className="font-bold text-white">IPOAlerts Pro Monthly</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Billing Amount:</span>
                <span className="font-bold text-emerald-400">₹99.00 (Incl. GST)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Payment Mode:</span>
                <span className="font-bold text-cyan-400">Instant UPI Autopay</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 text-[11px] text-slate-400 border border-white/5">
              Simulates secure payment integration with Razorpay/Cashfree native Indian checkout flow.
            </div>

            <button
              type="button"
              disabled={checkoutSimulated}
              onClick={simulateCheckout}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-2.5 text-xs font-bold text-slate-950 shadow-md transition"
            >
              {checkoutSimulated ? 'Authorizing Mock UPI Mandate...' : 'Pay ₹99 via UPI & Activate Pro'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
