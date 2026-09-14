'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  Send,
  Sparkles,
  X,
  Smartphone,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sliders,
  TrendingUp,
  Users,
  Calendar,
} from 'lucide-react';
import { NotificationPreferences } from '@/types/ipo';
import {
  requestNotificationPermission,
  unsubscribePushNotifications,
  getStoredSubscriptionStatus,
} from '@/lib/firebase/requestNotificationPermission';

interface Props {
  onClose: () => void;
  defaultIpoSlug?: string;
}

const DEFAULT_PREFS: NotificationPreferences = {
  webPushEnabled: true,
  telegramEnabled: false,
  emailEnabled: true,
  mainboardAlerts: true,
  smeAlerts: true,
  gmpSurgeAlerts: true,
  allotmentOutAlerts: true,
  closingDayAlerts: true,
  emailAddress: '',
  telegramHandle: '',
  watchedIpoSlugs: [],

  // Granular Alert Options
  newIpoAlerts: true,
  subscriptionAlerts: true,
  retailSubAlerts: true,
  niiSubAlerts: true,
  qibSubAlerts: true,
  employeeSubAlerts: false,
  gmpAlerts: true,
  gmpPctAlerts: true,
  gmpChangeAlerts: true,
  allotmentProbabilityAlerts: true,
  listingPriceAlerts: true,
  listingGainLossAlerts: true,
};

export default function NotificationModal({ onClose }: Props) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [savedToast, setSavedToast] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [simulatedAlertTriggered, setSimulatedAlertTriggered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'lifecycle' | 'subscription' | 'gmp'>('all');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ipo_alerts_prefs');
      if (saved) {
        setPrefs((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
      const { isSubscribed: sub } = getStoredSubscriptionStatus();
      setIsSubscribed(sub);
    } catch {}
  }, []);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      localStorage.setItem('ipo_alerts_prefs', JSON.stringify(prefs));

      // If user enabled web push, trigger or sync push token
      if (prefs.webPushEnabled) {
        const result = await requestNotificationPermission({
          preferences: prefs as unknown as Record<string, unknown>,
        });
        if (result.success) {
          setIsSubscribed(true);
        }
      } else if (isSubscribed && !prefs.webPushEnabled) {
        await unsubscribePushNotifications();
        setIsSubscribed(false);
      }

      setSavedToast(true);
      setTimeout(() => {
        setSavedToast(false);
        onClose();
      }, 1000);
    } catch {
      onClose();
    }
  };

  const testSimulatedPush = () => {
    setSimulatedAlertTriggered(true);
    setTimeout(() => {
      setSimulatedAlertTriggered(false);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white shadow-2xl p-5 sm:p-7 text-slate-800 my-auto max-h-[92vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Custom IPO Push Alert Options</h2>
            <p className="text-xs text-slate-500">
              Select precisely which market events trigger free push alerts on your devices
            </p>
          </div>
        </div>

        {/* Simulated Push Alert Notification Banner */}
        {simulatedAlertTriggered && (
          <div className="mb-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 animate-fade-in text-xs shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600" /> [PREVIEW PUSH NOTIFICATION]
              </span>
              <span className="text-[10px] text-slate-500">Just now</span>
            </div>
            <p className="text-slate-700 mt-1 font-medium leading-relaxed">
              🔔 <strong>Waaree Energies IPO:</strong> Live bidding is now open! Price band
              ₹1,427–₹1,503 per share, retail portion 35%. Closes Friday at 5:00 PM.
            </p>
          </div>
        )}

        {/* Main Scrollable Content */}
        <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
          {/* Main Channel Opt-in Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 text-indigo-600" />
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Browser & Mobile Push</span>
                    {isSubscribed && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" /> Connected
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Instant alerts even with browser tabs closed
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('webPushEnabled')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  prefs.webPushEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
                aria-label="Toggle browser push"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    prefs.webPushEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <Send className="h-4 w-4 text-cyan-600" />
                <div>
                  <div className="font-bold text-slate-900">Telegram Channel Backup</div>
                  <div className="text-[11px] text-slate-500">Join 50,000+ active investors</div>
                </div>
              </div>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold text-xs border border-cyan-200 transition"
              >
                Join Channel
              </a>
            </div>
          </div>

          {/* Granular Notification Option Categories */}
          <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
            {[
              { id: 'all', label: 'All Options' },
              { id: 'lifecycle', label: 'IPO Milestones' },
              { id: 'subscription', label: 'Subscription' },
              { id: 'gmp', label: 'GMP & Price' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Section 1: IPO Lifecycle Alerts */}
          {(activeCategory === 'all' || activeCategory === 'lifecycle') && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2.5">
              <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5 text-indigo-700">
                <Calendar className="h-3.5 w-3.5" />
                <span>IPO Timeline & Allotment Options</span>
              </div>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <div className="text-slate-800 font-medium">New IPO alert</div>
                  <div className="text-[10px] text-slate-500">
                    Notifies the moment a new issue opens for bidding
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.newIpoAlerts ?? true}
                  onChange={() => handleToggle('newIpoAlerts')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-200/60">
                <div>
                  <div className="text-slate-800 font-medium">IPO closing alert</div>
                  <div className="text-[10px] text-slate-500">
                    Reminder on Day 3 before the 5:00 PM cutoff
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.closingDayAlerts}
                  onChange={() => handleToggle('closingDayAlerts')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-200/60">
                <div>
                  <div className="text-slate-800 font-medium">Allotment result alert</div>
                  <div className="text-[10px] text-slate-500">
                    Instant notice when registrar declares allotment
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.allotmentOutAlerts}
                  onChange={() => handleToggle('allotmentOutAlerts')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-200/60">
                <div>
                  <div className="text-slate-800 font-medium">Allotment probability alert</div>
                  <div className="text-[10px] text-slate-500">
                    Calculated odds of allotment per PAN based on final quotas
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.allotmentProbabilityAlerts ?? true}
                  onChange={() => handleToggle('allotmentProbabilityAlerts')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>
            </div>
          )}

          {/* Section 2: Subscription Options */}
          {(activeCategory === 'all' || activeCategory === 'subscription') && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2.5">
              <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5 text-indigo-700">
                <Users className="h-3.5 w-3.5" />
                <span>Subscription Demand Alerts</span>
              </div>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <div className="text-slate-800 font-medium">Subscription alert (Overall)</div>
                  <div className="text-[10px] text-slate-500">
                    Triggered when issue crosses key milestones (10x, 25x, 50x)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.subscriptionAlerts ?? true}
                  onChange={() => handleToggle('subscriptionAlerts')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-200/60">
                <div>
                  <div className="text-slate-800 font-medium">Retail subscription alert</div>
                  <div className="text-[10px] text-slate-500">
                    Individual investor quota subscription updates
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.retailSubAlerts ?? true}
                  onChange={() => handleToggle('retailSubAlerts')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-200/60">
                <div>
                  <div className="text-slate-800 font-medium">NII/HNI subscription alert</div>
                  <div className="text-[10px] text-slate-500">
                    High Net-Worth Individual demand updates
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.niiSubAlerts ?? true}
                  onChange={() => handleToggle('niiSubAlerts')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-200/60">
                <div>
                  <div className="text-slate-800 font-medium">QIB subscription alert</div>
                  <div className="text-[10px] text-slate-500">
                    Institutional anchor and Day 3 demand spikes
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.qibSubAlerts ?? true}
                  onChange={() => handleToggle('qibSubAlerts')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-200/60">
                <div>
                  <div className="text-slate-800 font-medium">Employee subscription alert</div>
                  <div className="text-[10px] text-slate-500">
                    Company employee reserved quota bidding
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.employeeSubAlerts ?? false}
                  onChange={() => handleToggle('employeeSubAlerts')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>
            </div>
          )}

          {/* Section 3: GMP & Listing Alerts */}
          {(activeCategory === 'all' || activeCategory === 'gmp') && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2.5">
              <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5 text-indigo-700">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>GMP & Listing Day Options</span>
              </div>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <div className="text-slate-800 font-medium">GMP alert</div>
                  <div className="text-[10px] text-slate-500">
                    Daily market indications and updates
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.gmpAlerts ?? true}
                  onChange={() => handleToggle('gmpAlerts')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-200/60">
                <div>
                  <div className="text-slate-800 font-medium">GMP % alert & change alert</div>
                  <div className="text-[10px] text-slate-500">
                    Alerts when expected listing gain changes by &gt;15%
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.gmpSurgeAlerts}
                  onChange={() => handleToggle('gmpSurgeAlerts')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-200/60">
                <div>
                  <div className="text-slate-800 font-medium">Listing price & gain/loss alert</div>
                  <div className="text-[10px] text-slate-500">
                    Official opening listing price at 10:00 AM on NSE/BSE
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.listingPriceAlerts ?? true}
                  onChange={() => handleToggle('listingPriceAlerts')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={testSimulatedPush}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
          >
            Preview Sample Alert
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-600/30 transition"
            >
              {savedToast ? (
                <>
                  <Check className="h-4 w-4" /> Preferences Saved
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
