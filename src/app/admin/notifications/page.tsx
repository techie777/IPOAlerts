'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, LayoutDashboard, Sun, Moon, ShieldCheck, BellRing } from 'lucide-react';
import AdminNotificationsMaster from '@/components/admin/AdminNotificationsMaster';

export default function AdminNotificationsPage() {
  const [isDark, setIsDark] = useState<boolean>(true);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Header Bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between ${
        isDark ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-white/90 shadow-2xs'
      }`}>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              isDark
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Admin Center</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs">/</span>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-500">
              <BellRing className="h-3.5 w-3.5" />
              <span>Notifications Master</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl border transition ${
              isDark
                ? 'border-slate-800 bg-slate-900 text-amber-400 hover:bg-slate-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-1.5 text-xs shadow-xs transition"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Full Admin Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <AdminNotificationsMaster isDark={isDark} />
      </main>
    </div>
  );
}
