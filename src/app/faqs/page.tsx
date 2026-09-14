'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, ShieldCheck } from 'lucide-react';
import BrokerCtaBanner from '@/components/monetization/BrokerCtaBanner';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'Grey Market & GMP',
    q: 'What is IPO GMP (Grey Market Premium)?',
    a: 'Grey Market Premium (GMP) is the price premium at which IPO applications or allotted shares are unofficially traded before their formal stock exchange listing. For example, an issue priced at ₹100 with ₹40 GMP suggests an estimated opening price of ₹140 (+40%).',
  },
  {
    category: 'Grey Market & GMP',
    q: 'What is Kostak Rate vs Subject to Sauda?',
    a: 'Kostak rate is the fixed profit an applicant earns by selling their application before allotment, irrespective of whether shares are allotted. "Subject to Sauda" pays profit only if shares are actually allotted.',
  },
  {
    category: 'Bidding & Application',
    q: 'How do I apply for an IPO using UPI on Zerodha, Groww, or Angel One?',
    a: '1. Open your broker app and navigate to "IPO Bids".\n2. Select the active IPO and click "Apply".\n3. Select 1 lot and always tick "Cut-off Price".\n4. Enter your UPI ID and submit.\n5. Open your UPI app (Google Pay, PhonePe, BHIM) and authorize the mandate before 5:00 PM on closing day.',
  },
  {
    category: 'Allotment Tips',
    q: 'How can I maximize my chances of getting an IPO allotment?',
    a: 'Apply 1 lot each from multiple family members’ unique Demat accounts and PAN cards rather than applying multiple lots from a single PAN. In oversubscribed retail issues, computerized lottery treats all valid applicants equally for a single lot.',
  },
  {
    category: 'Mainboard vs SME',
    q: 'What is the difference between Mainboard and SME IPOs?',
    a: 'Mainboard IPOs list on the main NSE/BSE boards with a minimum retail lot investment of ~₹14,000–₹15,000. SME (NSE Emerge / BSE SME) IPOs are smaller growth companies with much larger lot sizes requiring ~₹1,00,000 to ₹1,40,000 per application.',
  },
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 sm:p-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-bold text-indigo-700 mb-2">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Quick Answers</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          IPO FAQs & Allotment Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Everything retail investors need to know about IPO bidding, Grey Market Premiums, and allotment rules.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:text-indigo-600 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                    {faq.category}
                  </span>
                  <span>{faq.q}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-indigo-600 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 whitespace-pre-line">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Strategy Card */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 space-y-2">
        <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Important Allotment Rule</span>
        </h3>
        <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
          In oversubscribed issues, SEBI rules dictate that allotment is executed through a randomized computerized lottery for 1 lot per valid applicant. Applying for multiple lots under a single PAN does <strong>NOT</strong> increase your lottery chances. Always bid using multiple unique family PAN cards.
        </p>
      </div>

      <BrokerCtaBanner />
    </div>
  );
}
