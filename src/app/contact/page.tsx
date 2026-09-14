'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import BrokerCtaBanner from '@/components/monetization/BrokerCtaBanner';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Data Correction',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* Header */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
          <Mail className="h-4 w-4" />
          <span>Capital Markets Communications Desk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Contact IPOAlerts Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Have an issue listing update, GMP verification tip, SME RHP filing correction, or advertising inquiry? Get in touch with our desk.
        </p>
      </section>

      {/* Form and Office Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Contact Form */}
        <div className="md:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Message Dispatched</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Thank you for reaching out. Our primary market desk will review your submission within 2 market trading hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs font-bold text-indigo-600 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Work / Personal Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Subject Category
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Data Correction">GMP / Subscription Data Correction</option>
                  <option value="SME Submission">SME IPO Listing Submission</option>
                  <option value="Broker Partnership">Broker / Affiliate Partnership</option>
                  <option value="Press Inquiries">Media & Press Inquiries</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the issue, company name, or proposal..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl bg-white border border-slate-200 p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 text-xs sm:text-sm shadow-xs transition"
              >
                <Send className="h-4 w-4" />
                <span>Submit Transmission</span>
              </button>
            </form>
          )}
        </div>

        {/* Support Channels Info */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-slate-900">Direct Desk Contacts</h2>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>desk@ipoalerts.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Bandra Kurla Complex (BKC), Mumbai, MH</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-indigo-50/50 p-6 shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Data Tip Hotline
            </h3>
            <p className="text-xs text-indigo-800 leading-relaxed">
              Are you a merchant banker or registrar with breaking subscription updates? Send priority press releases directly to <strong>press@ipoalerts.in</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Broker Banner */}
      <BrokerCtaBanner variant="full" />
    </div>
  );
}
