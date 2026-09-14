'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Bell,
  Volume2,
  VolumeX,
  Sliders,
  CheckCircle2,
  Save,
  LogOut,
  Sparkles,
  Smartphone,
  Send,
  Mail,
  ShieldCheck,
  TrendingUp,
  Bookmark,
  Calendar,
  Users,
  Eye,
  ArrowRight,
  Building,
  Check,
} from 'lucide-react';
import { getCurrentUser, updateUserProfile, logoutUser, DEMO_USER } from '@/lib/authStore';
import { UserProfile } from '@/types/user';
import { NotificationPreferences } from '@/types/ipo';
import { playNotificationSound } from '@/lib/audioNotifier';
import {
  requestNotificationPermission,
  getStoredSubscriptionStatus,
} from '@/lib/firebase/requestNotificationPermission';
import AuthModal from '@/components/auth/AuthModal';

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-xs font-semibold text-slate-500">
          Loading profile settings...
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'profile' ? 'profile' : 'notifications';

  const [activeTab, setActiveTab] = useState<'notifications' | 'profile' | 'watchlist'>(
    (defaultTab as 'notifications' | 'profile') || 'notifications'
  );

  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isPushActive, setIsPushActive] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    investorCategory: 'retail' as UserProfile['investorCategory'],
    primaryBroker: 'Zerodha',
  });

  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>(
    DEMO_USER.notificationPreferences
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [minGmpThreshold, setMinGmpThreshold] = useState(15);

  useEffect(() => {
    const loadUserData = () => {
      const current = getCurrentUser();
      if (current) {
        setUser(current);
        setProfileForm({
          name: current.name,
          email: current.email,
          phone: current.phone || '',
          investorCategory: current.investorCategory,
          primaryBroker: current.primaryBroker,
        });
        setNotifPrefs(current.notificationPreferences);
        setSoundEnabled(current.soundEnabled ?? true);
        setMinGmpThreshold(current.minGmpThresholdPct ?? 15);
      } else {
        // Not logged in: show demo placeholder or prompt login
        setUser(null);
      }
    };

    loadUserData();
    const { isSubscribed } = getStoredSubscriptionStatus();
    setIsPushActive(isSubscribed);

    const handleAuthChange = () => loadUserData();
    window.addEventListener('userAuthUpdated', handleAuthChange);
    return () => window.removeEventListener('userAuthUpdated', handleAuthChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleTestSound = () => {
    playNotificationSound(true);
    showToast('🔔 Playing crystal chime notification sound!');
  };

  const handleTogglePref = (key: keyof NotificationPreferences) => {
    setNotifPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveNotifications = async () => {
    updateUserProfile({
      soundEnabled,
      minGmpThresholdPct: minGmpThreshold,
      notificationPreferences: notifPrefs,
    });

    // If web push is active, sync token
    if (notifPrefs.webPushEnabled && !isPushActive) {
      await requestNotificationPermission({
        preferences: notifPrefs as unknown as Record<string, unknown>,
      });
      setIsPushActive(true);
    }

    showToast('✅ My Notification preferences saved successfully!');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      investorCategory: profileForm.investorCategory,
      primaryBroker: profileForm.primaryBroker,
    });
    showToast('✅ Profile details updated!');
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl bg-slate-900 text-white text-xs px-4 py-2.5 shadow-2xl border border-slate-700 flex items-center gap-2 animate-fade-in">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl bg-indigo-600/30 border border-indigo-400/40 text-white shadow-inner">
              <User className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  {user ? user.name : 'Guest Investor'}
                </h1>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Verified Member
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {user ? user.email : 'Sign in to customize personal alerts and view saved IPOs'}
              </p>
              {user && (
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-indigo-200">
                  <span>Category: <strong className="text-white capitalize">{user.investorCategory}</strong></span>
                  <span>•</span>
                  <span>Primary Broker: <strong className="text-white">{user.primaryBroker}</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-2 text-xs font-semibold text-white transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-xs font-bold text-white shadow-md transition"
              >
                <User className="h-4 w-4" />
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'notifications'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>My Notifications</span>
          <span className="rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.2">
            Customized
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profile & Demat Info</span>
        </button>

        <Link
          href="/notifications"
          className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
        >
          <span>View Notification Feed</span>
          <ArrowRight className="h-3.5 w-3.5 text-indigo-600" />
        </Link>
      </div>

      {/* ========================================================
          TAB 1: MY NOTIFICATIONS (ALL CUSTOMIZATION OPTIONS)
         ======================================================== */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          
          {/* Card 1: Sound & Master Push Channels */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-indigo-600" />
                  <span>Push Delivery Channels & Alert Sound</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure browser push delivery and auditory feedback for market events
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestSound}
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 text-xs font-bold transition cursor-pointer"
              >
                <Volume2 className="h-4 w-4 text-indigo-600" />
                <span>Test Notification Sound</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Notification Sound Toggle */}
              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${soundEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                    {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Notification Chime Sound</div>
                    <div className="text-[11px] text-slate-500">
                      Play audible tone when live alerts arrive
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) playNotificationSound(true);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    soundEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Master Web Push Toggle */}
              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${notifPrefs.webPushEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Browser Push Notifications</span>
                      {isPushActive && (
                        <span className="rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Background alerts even when browser tabs are closed
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePref('webPushEnabled')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    notifPrefs.webPushEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      notifPrefs.webPushEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Minimum GMP Threshold Slider */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Minimum GMP Surge Filter</div>
                  <div className="text-[11px] text-slate-500">
                    Only notify when expected listing gain is at least +{minGmpThreshold}%
                  </div>
                </div>
                <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  +{minGmpThreshold}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={minGmpThreshold}
                onChange={(e) => setMinGmpThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>All moves (+0%)</span>
                <span>Moderate (+25%)</span>
                <span>High only (+50%)</span>
                <span>Blockbuster (+100%)</span>
              </div>
            </div>
          </div>

          {/* Card 2: All Granular Notification Options */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-indigo-600" />
                <span>Granular Notification Triggers</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle exact market events that should deliver push alerts to your device
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category A: IPO Lifecycle & Allotment */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/80 pb-2">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  <span>Timeline & Allotment</span>
                </div>

                <label className="flex items-start justify-between cursor-pointer gap-2 py-1">
                  <div>
                    <div className="text-xs font-bold text-slate-800">New IPO Alert</div>
                    <div className="text-[10px] text-slate-500">When new issue opens for bidding</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.newIpoAlerts ?? true}
                    onChange={() => handleTogglePref('newIpoAlerts')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                  />
                </label>

                <label className="flex items-start justify-between cursor-pointer gap-2 py-1 border-t border-slate-200/60">
                  <div>
                    <div className="text-xs font-bold text-slate-800">IPO Closing Alert</div>
                    <div className="text-[10px] text-slate-500">Day 3 cutoff reminder (5 PM)</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.closingDayAlerts}
                    onChange={() => handleTogglePref('closingDayAlerts')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                  />
                </label>

                <label className="flex items-start justify-between cursor-pointer gap-2 py-1 border-t border-slate-200/60">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Allotment Result</div>
                    <div className="text-[10px] text-slate-500">When registrar publishes allotment</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.allotmentOutAlerts}
                    onChange={() => handleTogglePref('allotmentOutAlerts')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                  />
                </label>

                <label className="flex items-start justify-between cursor-pointer gap-2 py-1 border-t border-slate-200/60">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Allotment Probability</div>
                    <div className="text-[10px] text-slate-500">Calculated odds per application</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.allotmentProbabilityAlerts ?? true}
                    onChange={() => handleTogglePref('allotmentProbabilityAlerts')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                  />
                </label>
              </div>

              {/* Category B: Bidding Multipliers */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/80 pb-2">
                  <Users className="h-4 w-4 text-indigo-600" />
                  <span>Subscription Demands</span>
                </div>

                <label className="flex items-start justify-between cursor-pointer gap-2 py-1">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Subscription Alert</div>
                    <div className="text-[10px] text-slate-500">Overall milestones (10x, 25x, 50x)</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.subscriptionAlerts ?? true}
                    onChange={() => handleTogglePref('subscriptionAlerts')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                  />
                </label>

                <label className="flex items-start justify-between cursor-pointer gap-2 py-1 border-t border-slate-200/60">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Retail Subscription</div>
                    <div className="text-[10px] text-slate-500">Individual investor quota demand</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.retailSubAlerts ?? true}
                    onChange={() => handleTogglePref('retailSubAlerts')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                  />
                </label>

                <label className="flex items-start justify-between cursor-pointer gap-2 py-1 border-t border-slate-200/60">
                  <div>
                    <div className="text-xs font-bold text-slate-800">NII/HNI Subscription</div>
                    <div className="text-[10px] text-slate-500">Big & small HNI bidding crosses</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.niiSubAlerts ?? true}
                    onChange={() => handleTogglePref('niiSubAlerts')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                  />
                </label>

                <label className="flex items-start justify-between cursor-pointer gap-2 py-1 border-t border-slate-200/60">
                  <div>
                    <div className="text-xs font-bold text-slate-800">QIB & Employee Quotas</div>
                    <div className="text-[10px] text-slate-500">Institutions & employee quotas</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.qibSubAlerts ?? true}
                    onChange={() => handleTogglePref('qibSubAlerts')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                  />
                </label>
              </div>

              {/* Category C: GMP & Listing Day */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/80 pb-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  <span>GMP & Listing Outcomes</span>
                </div>

                <label className="flex items-start justify-between cursor-pointer gap-2 py-1">
                  <div>
                    <div className="text-xs font-bold text-slate-800">GMP Alert</div>
                    <div className="text-[10px] text-slate-500">Daily Grey Market Premium prices</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.gmpAlerts ?? true}
                    onChange={() => handleTogglePref('gmpAlerts')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                  />
                </label>

                <label className="flex items-start justify-between cursor-pointer gap-2 py-1 border-t border-slate-200/60">
                  <div>
                    <div className="text-xs font-bold text-slate-800">GMP % & Change Alert</div>
                    <div className="text-[10px] text-slate-500">Sudden surges or rate drops</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.gmpSurgeAlerts}
                    onChange={() => handleTogglePref('gmpSurgeAlerts')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                  />
                </label>

                <label className="flex items-start justify-between cursor-pointer gap-2 py-1 border-t border-slate-200/60">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Listing Price & Gain/Loss</div>
                    <div className="text-[10px] text-slate-500">Exchange opening bell at 10 AM</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.listingPriceAlerts ?? true}
                    onChange={() => handleTogglePref('listingPriceAlerts')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                  />
                </label>

                <label className="flex items-start justify-between cursor-pointer gap-2 py-1 border-t border-slate-200/60">
                  <div>
                    <div className="text-xs font-bold text-slate-800">SME IPO Alerts</div>
                    <div className="text-[10px] text-slate-500">NSE Emerge & BSE SME issues</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.smeAlerts}
                    onChange={() => handleTogglePref('smeAlerts')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                  />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveNotifications}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Notification Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: PROFILE & DEMAT SETTINGS
         ======================================================== */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs max-w-2xl">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600" />
            <span>Investor Account & Demat Details</span>
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Investor Bidding Category
                </label>
                <select
                  value={profileForm.investorCategory}
                  onChange={(e) => setProfileForm({ ...profileForm, investorCategory: e.target.value as UserProfile['investorCategory'] })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="retail">Retail Individual (&lt; ₹2 Lakhs)</option>
                  <option value="sNII">Small HNI / sNII (₹2L – ₹10L)</option>
                  <option value="bNII">Big HNI / bNII (&gt; ₹10 Lakhs)</option>
                  <option value="institutional">QIB / Institutional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Primary Demat Account
                </label>
                <select
                  value={profileForm.primaryBroker}
                  onChange={(e) => setProfileForm({ ...profileForm, primaryBroker: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Zerodha">Zerodha (Kite)</option>
                  <option value="Groww">Groww</option>
                  <option value="Upstox">Upstox</option>
                  <option value="Angel One">Angel One</option>
                  <option value="Dhan">Dhan</option>
                  <option value="ICICI Direct">ICICI Direct</option>
                  <option value="HDFC Securities">HDFC Securities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-md transition"
              >
                <Save className="h-4 w-4" />
                <span>Save Profile Details</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          showToast('Signed in successfully!');
        }}
      />
    </div>
  );
}
