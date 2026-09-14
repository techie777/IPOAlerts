'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Layers, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Megaphone, 
  DollarSign, 
  Settings, 
  LogOut, 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  Save, 
  RefreshCw, 
  RotateCcw, 
  ShieldCheck, 
  Eye, 
  ExternalLink, 
  Menu, 
  X, 
  Flame, 
  Building2, 
  Sparkles, 
  Calendar, 
  ArrowUpRight, 
  Download, 
  Upload,
  Lock,
  Clock,
  Briefcase,
  AlertTriangle,
  Sun,
  Moon,
  Bell,
  BellRing
} from 'lucide-react';
import { 
  getStoredIpos, 
  updateIpoGmp, 
  updateIpoSubscription, 
  saveOrUpdateIpo, 
  deleteIpo,
  updateIpoStatus,
  resetIpoData,
  formatCurrency
} from '@/lib/ipoStore';
import { IPO, IpoCategory, IpoStatus, ExchangeType } from '@/types/ipo';
import { triggerBrowserNotification } from '@/lib/firebase/localNotificationNotifier';
import AdminNotificationsMaster from '@/components/admin/AdminNotificationsMaster';

export default function AdminCommandCenter() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState('admin@ipoalerts.in');
  const [password, setPassword] = useState('admin123');
  const [authError, setAuthError] = useState('');

  // Theme state: 'dark' | 'light' (Customer Web Style)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Active Admin View
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'ipos' | 'gmp' | 'subscription' | 'allotment' | 'broadcasts' | 'notifications' | 'monetization' | 'data'
  >('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'notifications') {
        setActiveTab('notifications');
      }
    }
  }, []);

  // Core Data
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Selected IPO for editing/details
  const [selectedIpoId, setSelectedIpoId] = useState<string>('');

  // Add/Edit IPO Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Partial<IPO>>({
    name: '',
    symbol: '',
    category: 'mainboard',
    exchange: 'NSE & BSE',
    status: 'open',
    priceBandMin: 100,
    priceBandMax: 110,
    lotSize: 100,
    faceValue: 10,
    issueSizeCr: 500,
    freshIssueCr: 400,
    ofsCr: 100,
    retailQuotaPct: 35,
    qibQuotaPct: 50,
    niiQuotaPct: 15,
    sector: 'Renewables & Green Tech',
    registrarName: 'Link Intime India',
    registrarUrl: 'https://linkintime.co.in',
    leadManagers: ['Kotak Mahindra Capital', 'Axis Capital'],
    currentGmp: 45,
    currentListingGainPct: 40.9,
    currentSubscription: 12.5,
    openDate: '2026-09-15',
    closeDate: '2026-09-17',
    allotmentDate: '2026-09-18',
    refundDate: '2026-09-19',
    creditDate: '2026-09-20',
    listingDate: '2026-09-22',
    hot: true,
  });

  // Daily GMP Quick Update Form
  const [quickGmp, setQuickGmp] = useState<number>(0);
  const [quickKostak, setQuickKostak] = useState<number>(0);
  const [quickSauda, setQuickSauda] = useState<number>(0);

  // Subscription Multipliers Form
  const [subDay, setSubDay] = useState<number>(1);
  const [qibMult, setQibMult] = useState<number>(0);
  const [niiMult, setNiiMult] = useState<number>(0);
  const [retailMult, setRetailMult] = useState<number>(0);
  const [totalMult, setTotalMult] = useState<number>(0);

  // Broadcast Alert message
  const [broadcastText, setBroadcastText] = useState('🔥 Waaree Energies subscription crosses 50x on Day 2! GMP reaches +₹1,500!');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [pushTitle, setPushTitle] = useState('🔔 New IPO Alert: Waaree Energies');
  const [pushStats, setPushStats] = useState<{
    totalSubscribers: number;
    liveSubscribers: number;
    demoSubscribers: number;
    totalAlertsSent: number;
    lastCronCheckAt?: string;
  } | null>(null);
  const [firebaseConfigured, setFirebaseConfigured] = useState(false);
  const [isPushSending, setIsPushSending] = useState(false);
  const [isCronRunning, setIsCronRunning] = useState(false);
  const [cronOutput, setCronOutput] = useState<string | null>(null);

  const fetchPushStats = async () => {
    try {
      const res = await fetch('/api/admin/broadcast-alert');
      if (res.ok) {
        const data = await res.json();
        setPushStats(data.stats);
        setFirebaseConfigured(data.firebaseConfigured);
      }
    } catch (e) {
      console.warn('Failed to fetch push stats:', e);
    }
  };

  const handleSendPushBroadcast = async (testOnly = false) => {
    setIsPushSending(true);
    try {
      const res = await fetch('/api/admin/broadcast-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pushTitle,
          message: broadcastText,
          testTokenOnly: testOnly,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBroadcastSent(true);
        showToast(
          testOnly
            ? '🧪 Test push alert sent!'
            : `📢 Broadcast dispatched to ${data.details?.totalAttempted || 0} subscriber(s)!`
        );
        fetchPushStats();
      } else {
        showToast(`Push failed: ${data.details?.message || data.error || 'Unknown error'}`);
      }
    } catch (e) {
      showToast('Push network request failed.');
    } finally {
      setIsPushSending(false);
    }
  };

  const handleTriggerCron = async (force = false) => {
    setIsCronRunning(true);
    setCronOutput(null);
    try {
      const res = await fetch(`/api/cron/check-ipo-alerts${force ? '?force=true' : ''}`, {
        method: 'POST',
      });
      const data = await res.json();
      setCronOutput(JSON.stringify(data, null, 2));
      showToast(`Cron check completed: ${data.summary?.alertsDispatched || 0} alert(s) dispatched.`);
      fetchPushStats();
    } catch (e) {
      showToast('Cron trigger request failed.');
    } finally {
      setIsCronRunning(false);
    }
  };

  const [notifyOnSave, setNotifyOnSave] = useState<boolean>(true);

  const handleQuickSendIpoAlert = async (ipo: IPO) => {
    const alertTitle = `🔔 IPO Alert: ${ipo.name}`;
    const alertBody = `${ipo.name} (${ipo.category.toUpperCase()}): Current GMP +₹${ipo.currentGmp} (+${ipo.currentListingGainPct}%). Bidding closes ${ipo.closeDate}.`;
    const ipoUrl = `/ipo/${ipo.slug}`;

    triggerBrowserNotification({
      title: alertTitle,
      body: alertBody,
      url: ipoUrl,
      category: ipo.category,
    });

    try {
      await fetch('/api/admin/broadcast-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: alertTitle,
          message: alertBody,
          url: ipoUrl,
          category: ipo.category,
          topic: 'newIpo',
        }),
      });
      showToast(`🔔 Push alert sent for ${ipo.name}!`);
      fetchPushStats();
    } catch {
      showToast('Could not dispatch alert.');
    }
  };

  // Monetization Referral Codes
  const [zerodhaCode, setZerodhaCode] = useState('ZMPZQH');
  const [growwUrl, setGrowwUrl] = useState('https://groww.in');
  const [angelCode, setAngelCode] = useState('ANGEL_IPO');

  useEffect(() => {
    // Check local session
    const savedAuth = localStorage.getItem('ipo_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    const savedTheme = localStorage.getItem('ipo_admin_theme') as 'dark' | 'light';
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
    const data = getStoredIpos();
    setIpos(data);
    fetchPushStats();
    if (data.length > 0) {
      setSelectedIpoId(data[0].id);
      setQuickGmp(data[0].currentGmp);
      setQuickKostak(data[0].gmpHistory[0]?.kostakRate || 400);
      setQuickSauda(data[0].gmpHistory[0]?.saudaRate || 8000);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('ipo_admin_theme', nextTheme);
    showToast(`🎨 Switched to ${nextTheme === 'light' ? 'Light Grey (Customer Web)' : 'Dark'} Theme`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@ipoalerts.in' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('ipo_admin_auth', 'true');
      setAuthError('');
      showToast('⚡ Welcome to IPOAlerts Financial Command Center');
    } else {
      setAuthError('Invalid credentials. Use admin@ipoalerts.in / admin123');
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@ipoalerts.in');
    setPassword('admin123');
    setIsAuthenticated(true);
    localStorage.setItem('ipo_admin_auth', 'true');
    setAuthError('');
    showToast('⚡ Authorized as Chief Market Analyst');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ipo_admin_auth');
    showToast('Logged out of Command Center');
  };

  const currentIpo = ipos.find((i) => i.id === selectedIpoId) || ipos[0];

  const handleSelectIpo = (id: string) => {
    setSelectedIpoId(id);
    const target = ipos.find((i) => i.id === id);
    if (target) {
      setQuickGmp(target.currentGmp);
      setQuickKostak(target.gmpHistory[0]?.kostakRate || 400);
      setQuickSauda(target.gmpHistory[0]?.saudaRate || 8000);
    }
  };

  // Quick GMP Save
  const handleSaveGmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentIpo) return;
    const res = updateIpoGmp(currentIpo.id, Number(quickGmp), Number(quickKostak), Number(quickSauda));
    if (res) {
      setIpos(getStoredIpos());
      showToast(`✅ Updated GMP for ${res.name}: ₹${quickGmp} (+${res.currentListingGainPct}%)`);
    }
  };

  // Quick Subscription Save
  const handleSaveSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentIpo) return;
    const calcTotal = Number(totalMult) || Number(((Number(qibMult) * 0.5) + (Number(niiMult) * 0.15) + (Number(retailMult) * 0.35)).toFixed(2));
    const res = updateIpoSubscription(currentIpo.id, {
      day: Number(subDay),
      date: new Date().toISOString().split('T')[0],
      qibMultiplier: Number(qibMult),
      niiMultiplier: Number(niiMult),
      retailMultiplier: Number(retailMult),
      totalMultiplier: calcTotal,
    });
    if (res) {
      setIpos(getStoredIpos());
      showToast(`✅ Day ${subDay} Bidding Updated: Total ${calcTotal}x for ${res.name}`);
    }
  };

  // Status Lifecycle Update
  const handleUpdateStatus = (id: string, newStatus: IpoStatus) => {
    const res = updateIpoStatus(id, newStatus);
    if (res) {
      setIpos(getStoredIpos());
      showToast(`🔄 Status moved to "${newStatus.toUpperCase()}" for ${res.symbol}`);

      // Auto dispatch notification for major status changes!
      let alertTitle = '';
      let alertBody = '';
      let topic = 'general';

      if (newStatus === 'open') {
        alertTitle = `🔔 Live Bidding Open: ${res.name}`;
        alertBody = `${res.name} is now open for bidding! Price band ₹${res.priceBandMin}–₹${res.priceBandMax}, closes ${res.closeDate}.`;
        topic = 'newIpo';
      } else if (newStatus === 'closed') {
        alertTitle = `🎉 Allotment Out: ${res.name}`;
        alertBody = `${res.name} bidding is closed! Allotment status declared by ${res.registrarName}.`;
        topic = 'allotment';
      } else if (newStatus === 'listed') {
        alertTitle = `📈 Listed on Exchange: ${res.name}`;
        alertBody = `${res.name} is now trading on ${res.exchange}! Check listing price and performance.`;
        topic = 'listing';
      }

      if (alertTitle) {
        triggerBrowserNotification({
          title: alertTitle,
          body: alertBody,
          url: `/ipo/${res.slug}`,
          category: res.category,
        });

        fetch('/api/admin/broadcast-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: alertTitle,
            message: alertBody,
            url: `/ipo/${res.slug}`,
            category: res.category,
            topic,
          }),
        })
          .then(() => fetchPushStats())
          .catch((err) => console.warn('Push error:', err));
      }
    }
  };

  // Delete IPO
  const handleDeleteIpo = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      const updated = deleteIpo(id);
      setIpos(updated);
      if (updated.length > 0) setSelectedIpoId(updated[0].id);
      showToast(`🗑️ ${name} deleted from active catalog.`);
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      id: 'ipo-' + Date.now(),
      slug: 'new-issue-ipo',
      name: '',
      symbol: '',
      category: 'mainboard',
      exchange: 'NSE & BSE',
      status: 'open',
      priceBandMin: 100,
      priceBandMax: 110,
      lotSize: 100,
      faceValue: 10,
      issueSizeCr: 500,
      freshIssueCr: 400,
      ofsCr: 100,
      retailQuotaPct: 35,
      qibQuotaPct: 50,
      niiQuotaPct: 15,
      sector: 'Renewables & Green Tech',
      registrarName: 'Link Intime India',
      registrarUrl: 'https://linkintime.co.in',
      leadManagers: ['Kotak Mahindra Capital', 'Axis Capital'],
      currentGmp: 50,
      currentListingGainPct: 45.45,
      currentSubscription: 15.2,
      openDate: '2026-09-18',
      closeDate: '2026-09-20',
      allotmentDate: '2026-09-21',
      refundDate: '2026-09-22',
      creditDate: '2026-09-23',
      listingDate: '2026-09-24',
      hot: true,
      description: 'Approved RHP primary capital market issue.',
      gmpHistory: [],
      subscriptionHistory: [],
      financials: [],
      review: {
        verdict: 'Apply for Listing Gains',
        rating: 4.5,
        analyst: 'Desk Research Team',
        summary: 'Strong order book and market leadership in its segment.',
        strengths: ['High operating margin', 'Robust order book'],
        risks: ['Customer concentration risk'],
      }
    });
    setNotifyOnSave(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (ipo: IPO) => {
    setModalMode('edit');
    setFormData({ ...ipo });
    setNotifyOnSave(false);
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.symbol) {
      alert('Please enter IPO Name and Stock Symbol');
      return;
    }

    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-ipo';
    const finalIpo: IPO = {
      ...(formData as IPO),
      id: formData.id || 'ipo-' + Date.now(),
      slug,
      gmpHistory: formData.gmpHistory && formData.gmpHistory.length > 0 ? formData.gmpHistory : [
        {
          id: 'gmp-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          gmpValue: formData.currentGmp || 0,
          estimatedListingGainPct: formData.currentListingGainPct || 0,
          kostakRate: 400,
          saudaRate: 8000,
        }
      ],
      subscriptionHistory: formData.subscriptionHistory && formData.subscriptionHistory.length > 0 ? formData.subscriptionHistory : [
        {
          day: 1,
          date: formData.openDate || new Date().toISOString().split('T')[0],
          qibMultiplier: 2.1,
          niiMultiplier: 5.4,
          retailMultiplier: 10.2,
          totalMultiplier: formData.currentSubscription || 6.5,
        }
      ],
      financials: formData.financials || [],
      review: formData.review || {
        verdict: 'Apply for Listing Gains',
        rating: 4.5,
        analyst: 'Chief Market Desk',
        summary: 'High investor demand with attractive valuations.',
        strengths: ['Strong fundamentals'],
        risks: ['Industry competition'],
      }
    };

    saveOrUpdateIpo(finalIpo);
    setIpos(getStoredIpos());
    setIsModalOpen(false);

    if (notifyOnSave) {
      const isNew = modalMode === 'create';
      const alertTitle = isNew
        ? `🔔 New IPO: ${finalIpo.name}`
        : `📢 IPO Update: ${finalIpo.name}`;
      const alertBody = isNew
        ? `${finalIpo.name} (${finalIpo.category.toUpperCase()}) announced! Price band ₹${finalIpo.priceBandMin}–₹${finalIpo.priceBandMax}, closes ${finalIpo.closeDate}.`
        : `${finalIpo.name} updated: Status is ${finalIpo.status.toUpperCase()}, live GMP +₹${finalIpo.currentGmp} (+${finalIpo.currentListingGainPct}%).`;
      const ipoUrl = `/ipo/${finalIpo.slug}`;

      // 1. Dispatch native browser push + cross-tab live notification
      triggerBrowserNotification({
        title: alertTitle,
        body: alertBody,
        url: ipoUrl,
        category: finalIpo.category,
      });

      // 2. Dispatch FCM push to backend subscribers
      fetch('/api/admin/broadcast-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: alertTitle,
          message: alertBody,
          url: ipoUrl,
          category: finalIpo.category,
          topic: isNew ? 'newIpo' : 'general',
        }),
      })
        .then(() => fetchPushStats())
        .catch((err) => console.warn('Push broadcast error:', err));

      showToast(`🚀 ${finalIpo.name} saved & 🔔 Push alert sent to subscribers!`);
    } else {
      showToast(`🚀 ${finalIpo.name} successfully saved to live database!`);
    }
  };

  // Export JSON backup
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ipos, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `ipo_alerts_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    showToast('💾 Database exported as JSON file');
  };

  const isDark = theme === 'dark';

  // -------------------------------------------------------------
  // SIGN IN GATE (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 selection:bg-indigo-500 selection:text-white transition-colors duration-200 relative ${
        isDark ? 'admin-theme-dark bg-slate-950 text-slate-100' : 'admin-theme-light bg-[#f8fafc] text-slate-900'
      }`}>
        {/* Top Right Theme Toggle Button */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <button
            onClick={toggleTheme}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition border cursor-pointer ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
            title={isDark ? 'Switch to Customer Light Grey Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span>Light Grey</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-indigo-600" />
                <span>Dark Theme</span>
              </>
            )}
          </button>
        </div>

        <div className="w-full max-w-md space-y-6">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 mb-2">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              IPOAlerts Command Center
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Authorized Financial Desk Operator & Market Intelligence Console
            </p>
          </div>

          {/* Login Form Card */}
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-2xl space-y-5 transition-colors ${
            isDark ? 'border-slate-800 bg-slate-900/90 backdrop-blur-xl' : 'border-slate-200/80 bg-white shadow-xl'
          }`}>
            <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border ${
              isDark ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}>
              <ShieldCheck className="h-4 w-4" />
              <span>256-Bit Encrypted Market Desk Session</span>
            </div>

            {authError && (
              <div className="rounded-xl bg-rose-950/40 border border-rose-800/50 p-3 text-xs text-rose-300 font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Operator Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Secure Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>Sign In to Command Center</span>
              </button>
            </form>

            <div className={`relative border-t pt-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <button
                type="button"
                onClick={handleDemoLogin}
                className={`w-full rounded-xl font-semibold py-2.5 text-xs transition border flex items-center justify-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>1-Click Fast Demo Login (admin123)</span>
              </button>
            </div>
          </div>

          {/* Public Return Link */}
          <div className="text-center">
            <Link
              href="/"
              className={`text-xs font-semibold transition ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-900'}`}
            >
              ← Return to Consumer Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED COMMAND CENTER INTERFACE
  // -------------------------------------------------------------
  return (
    <div className={`min-h-screen flex flex-col lg:flex-row antialiased transition-colors duration-200 ${
      isDark ? 'admin-theme-dark bg-slate-950 text-slate-100' : 'admin-theme-light bg-[#f8fafc] text-slate-900'
    }`}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 rounded-2xl bg-emerald-600 text-white px-4 py-3 text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-400/40 animate-bounce">
          <Sparkles className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Mobile Top App Bar (Only on small screens) */}
      <div className={`lg:hidden border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30 transition-colors ${
        isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Command Center</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Theme Switcher */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 border transition cursor-pointer ${
              isDark ? 'bg-slate-800 text-amber-400 border-slate-700' : 'bg-white text-indigo-600 border-slate-200 shadow-xs'
            }`}
            title={isDark ? 'Switch to Light Grey' : 'Switch to Dark'}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link
            href="/"
            target="_blank"
            className={`p-2 rounded-xl text-xs flex items-center gap-1 border transition ${
              isDark ? 'bg-slate-800 text-slate-400 hover:text-white border-slate-700' : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 shadow-xs'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Live Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className={`p-2 rounded-xl text-xs border transition cursor-pointer ${
              isDark ? 'bg-rose-950/50 text-rose-300 border-rose-800/40' : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION (Desktop persistent, Mobile drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r flex flex-col justify-between transition-all duration-300 lg:static lg:translate-x-0 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        } ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Desk Brand Header */}
          <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 shadow-md shadow-indigo-500/20">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span>IPOAlerts</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${
                    isDark ? 'bg-indigo-950 text-indigo-400 border-indigo-800' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    CMS
                  </span>
                </div>
                <div className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Financial Desk v2.6</div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`lg:hidden cursor-pointer ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Logged in Analyst Profile */}
          <div className={`px-5 py-3 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800/70 bg-slate-950/40 text-slate-200' : 'border-slate-100 bg-slate-50 text-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 live-beacon" />
              <div>
                <div className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Head Analyst</div>
                <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Live NSE/BSE Feed</div>
              </div>
            </div>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
              isDark ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}>
              Active
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {[
              { key: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, badge: `${ipos.length} IPOs` },
              { key: 'ipos', label: 'Manage All IPOs', icon: Layers, badge: 'Full CRUD' },
              { key: 'gmp', label: 'Daily GMP & Kostak', icon: TrendingUp, badge: 'Street Pop' },
              { key: 'subscription', label: 'Subscription Engine', icon: Users, badge: 'Day-Wise' },
              { key: 'allotment', label: 'Allotments & RTA', icon: CheckCircle2, badge: 'Registrar' },
              { key: 'notifications', label: 'Notifications Master', icon: BellRing, badge: 'Push & Tpl' },
              { key: 'broadcasts', label: 'Alerts & Ticker News', icon: Megaphone, badge: 'Live' },
              { key: 'monetization', label: 'Broker Affiliates', icon: DollarSign, badge: 'Zerodha' },
              { key: 'data', label: 'Backup & Restore', icon: Settings, badge: 'JSON' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key as any);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      isActive 
                        ? 'bg-indigo-800/80 text-white' 
                        : isDark
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Sidepanel Footer */}
          <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-slate-50/50'}`}>
            <Link
              href="/"
              target="_blank"
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition border ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
              }`}
            >
              <Eye className="h-3.5 w-3.5 text-indigo-500" />
              <span>View Public Website</span>
              <ExternalLink className={`h-3 w-3 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            </Link>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition border cursor-pointer ${
                isDark
                  ? 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border-rose-900/40'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
              }`}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar (Desktop & Tablet) */}
        <header className={`hidden lg:flex h-16 items-center justify-between border-b px-6 sm:px-8 transition-colors ${
          isDark 
            ? 'border-slate-800 bg-slate-900/60 backdrop-blur-md' 
            : 'border-slate-200 bg-white/85 backdrop-blur-md shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Module: <span className={`font-bold capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeTab}</span>
            </div>
            <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>•</span>
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${
              isDark 
                ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' 
                : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 live-beacon" />
              <span>Live Market Intelligence Desk Active</span>
            </div>
          </div>

          {/* TOP RIGHT CONTROLS: THEME TOGGLE, ADD IPO, PUBLIC VIEW */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition border cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
              }`}
              title={isDark ? 'Switch to Customer Light Grey Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span>Light Grey</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-indigo-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-lg shadow-indigo-600/20 transition cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New IPO</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition border ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
              }`}
            >
              <span>Public View</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* ========================================================
              TAB 1: DASHBOARD OVERVIEW
             ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* 4 Stat KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className={`rounded-2xl border p-4 space-y-1 transition ${
                  isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
                }`}>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Total Tracked
                  </span>
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {ipos.length} Issues
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Mainboard & SME</div>
                </div>

                <div className={`rounded-2xl border p-4 space-y-1 transition ${
                  isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
                }`}>
                  <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Open for Bidding</span>
                  <div className="text-2xl font-bold text-emerald-500">
                    {ipos.filter((i) => i.status === 'open').length} Live
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Accepting ASBA bids</div>
                </div>

                <div className={`rounded-2xl border p-4 space-y-1 transition ${
                  isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
                }`}>
                  <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Upcoming Approvals</span>
                  <div className="text-2xl font-bold text-amber-500">
                    {ipos.filter((i) => i.status === 'upcoming').length} Pipeline
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>RHP in review</div>
                </div>

                <div className={`rounded-2xl border p-4 space-y-1 transition ${
                  isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
                }`}>
                  <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Allotment Stage</span>
                  <div className="text-2xl font-bold text-purple-500">
                    {ipos.filter((i) => i.status === 'closed' || i.status === 'listed').length} Declared
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Registrar linked</div>
                </div>
              </div>

              {/* Quick Actions & Live Market Strip */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Active IPO Fast Selector */}
                <div className={`lg:col-span-8 rounded-3xl border p-5 sm:p-6 space-y-4 transition ${
                  isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200/80 bg-white shadow-xs'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Flame className="h-4 w-4 text-emerald-500" />
                      <span>Live Primary Market Roster</span>
                    </h2>
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>1-Click Fast Operations</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ipos.map((ipo) => (
                      <div
                        key={ipo.id}
                        className={`rounded-2xl border p-4 transition cursor-pointer ${
                          selectedIpoId === ipo.id
                            ? isDark
                              ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                              : 'bg-indigo-50/70 border-indigo-500 shadow-xs'
                            : isDark
                            ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                            : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                        onClick={() => handleSelectIpo(ipo.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{ipo.name}</div>
                            <div className={`text-xs font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ipo.symbol} • {ipo.category.toUpperCase()}</div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase border ${
                            ipo.status === 'open' 
                              ? isDark ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {ipo.status}
                          </span>
                        </div>

                        <div className={`grid grid-cols-2 gap-2 mt-3 pt-3 border-t text-xs ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                          <div>
                            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>GMP Today</span>
                            <div className="font-bold text-emerald-500">+₹{ipo.currentGmp} ({ipo.currentListingGainPct}%)</div>
                          </div>
                          <div>
                            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Sub Multiplier</span>
                            <div className="font-bold text-indigo-500">{ipo.currentSubscription}x</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instant Action Panel */}
                <div className="lg:col-span-4 space-y-4">
                  <div className={`rounded-3xl border p-5 sm:p-6 space-y-4 transition ${
                    isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200/80 bg-white shadow-xs'
                  }`}>
                    <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>Financial Desk Shortcuts</span>
                    </h3>

                    <div className="space-y-2">
                      <button
                        onClick={openCreateModal}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
                      >
                        <span>Add New Issue to Catalog</span>
                        <PlusCircle className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setActiveTab('gmp')}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                          isDark 
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>Update Street GMP & Kostak</span>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      </button>

                      <button
                        onClick={() => setActiveTab('subscription')}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                          isDark 
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>Log 5:00 PM Subscription Tallies</span>
                        <Users className="h-4 w-4 text-indigo-500" />
                      </button>

                      <button
                        onClick={() => setActiveTab('broadcasts')}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                          isDark 
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>Broadcast Ticker Flash Alert</span>
                        <Megaphone className="h-4 w-4 text-amber-500" />
                      </button>
                    </div>
                  </div>

                  <div className={`rounded-3xl border p-5 space-y-2 transition ${
                    isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200/80 bg-slate-50/70'
                  }`}>
                    <div className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Statutory Regulatory Check</div>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      All published GMP rates are stored in local persistent storage and synchronized in real-time with consumer tabs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: MANAGE ALL IPOS (Full CRUD)
             ======================================================== */}
          {activeTab === 'ipos' && (
            <div className="space-y-4">
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div>
                  <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    IPO Catalog & Lifecycle Manager
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Create, edit RHP financial parameters, update pricing bands, or archive issues
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className={`absolute left-3 top-2.5 h-3.5 w-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input
                      type="text"
                      placeholder="Search company or symbol..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className={`rounded-xl border pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark 
                          ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500' 
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                      }`}
                    />
                  </div>
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 text-xs font-semibold transition shadow-xs cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>New IPO</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className={`rounded-2xl border overflow-hidden transition ${
                isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`uppercase text-[11px] tracking-wider border-b font-semibold ${
                      isDark ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      <tr>
                        <th className="py-3.5 px-4">Company & Symbol</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price Band</th>
                        <th className="py-3.5 px-4">Lot Size</th>
                        <th className="py-3.5 px-4 text-emerald-500">GMP Today</th>
                        <th className="py-3.5 px-4">Subscription</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                      {ipos
                        .filter((i) => !searchFilter || i.name.toLowerCase().includes(searchFilter.toLowerCase()) || i.symbol.toLowerCase().includes(searchFilter.toLowerCase()))
                        .map((ipo) => (
                          <tr key={ipo.id} className={`transition ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}`}>
                            <td className="py-3 px-4">
                              <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{ipo.name}</div>
                              <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ipo.symbol} • {ipo.sector}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`uppercase text-[10px] px-2 py-0.5 rounded font-bold border ${
                                ipo.category === 'sme' 
                                  ? isDark ? 'bg-purple-950 text-purple-400 border-purple-800' : 'bg-purple-50 text-purple-700 border-purple-200'
                                  : isDark ? 'bg-indigo-950 text-indigo-400 border-indigo-800' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              }`}>
                                {ipo.category}
                              </span>
                            </td>
                            <td className={`py-3 px-4 font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                              ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
                            </td>
                            <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                              {ipo.lotSize} sh
                            </td>
                            <td className="py-3 px-4 font-bold text-emerald-500">
                              +₹{ipo.currentGmp} (+{ipo.currentListingGainPct}%)
                            </td>
                            <td className="py-3 px-4 font-semibold text-indigo-500">
                              {ipo.currentSubscription}x
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={ipo.status}
                                onChange={(e) => handleUpdateStatus(ipo.id, e.target.value as IpoStatus)}
                                className={`rounded-lg border px-2 py-1 text-xs font-semibold focus:outline-none ${
                                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                              >
                                <option value="upcoming">Upcoming</option>
                                <option value="open">Live Bidding</option>
                                <option value="closed">Allotment Stage</option>
                                <option value="listed">Listed</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleQuickSendIpoAlert(ipo)}
                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                  isDark ? 'bg-amber-950/60 hover:bg-amber-900 text-amber-400' : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                }`}
                                title={`Send Instant Push Alert for ${ipo.name}`}
                              >
                                <BellRing className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => openEditModal(ipo)}
                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                                title="Edit IPO"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <Link
                                href={`/ipo/${ipo.slug}`}
                                target="_blank"
                                className={`inline-block p-1.5 rounded-lg transition ${
                                  isDark ? 'bg-indigo-950/60 hover:bg-indigo-900 text-indigo-400' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                                }`}
                                title="View Public Page"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteIpo(ipo.id, ipo.name)}
                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                  isDark ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300' : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                                }`}
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: DAILY GMP & KOSTAK DESK
             ======================================================== */}
          {activeTab === 'gmp' && (
            <div className="space-y-6">
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <span>Grey Market Premium (GMP) & Kostak Operator Desk</span>
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Update unofficial street premiums, Kostak rate (per application), and Subject to Sauda rates
                </p>
              </div>

              {/* Selector Bar */}
              <div className="flex flex-wrap gap-2">
                {ipos.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => handleSelectIpo(i.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedIpoId === i.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : isDark
                        ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs'
                    }`}
                  >
                    {i.name} ({i.symbol})
                  </button>
                ))}
              </div>

              {/* Edit Card */}
              {currentIpo && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <form onSubmit={handleSaveGmp} className={`lg:col-span-7 rounded-3xl border p-6 space-y-4 transition ${
                    isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <div>
                        <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentIpo.name}</h3>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Cap Price: ₹{currentIpo.priceBandMax || currentIpo.priceBandMin} • Lot: {currentIpo.lotSize} shares</span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        isDark 
                          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50' 
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}>
                        Current: +₹{currentIpo.currentGmp} ({currentIpo.currentListingGainPct}%)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Today&apos;s GMP (₹)
                        </label>
                        <input
                          type="number"
                          value={quickGmp}
                          onChange={(e) => setQuickGmp(Number(e.target.value))}
                          className={`w-full rounded-xl border px-3 py-2 text-base font-bold text-emerald-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 focus:bg-white'
                          }`}
                        />
                        <span className={`text-[10px] mt-1 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Est. Pop: +{((quickGmp / (currentIpo.priceBandMax || 1)) * 100).toFixed(2)}%
                        </span>
                      </div>

                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Kostak Rate (₹)
                        </label>
                        <input
                          type="number"
                          value={quickKostak}
                          onChange={(e) => setQuickKostak(Number(e.target.value))}
                          className={`w-full rounded-xl border px-3 py-2 text-base font-bold text-amber-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 focus:bg-white'
                          }`}
                        />
                        <span className={`text-[10px] mt-1 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Per 1 retail application
                        </span>
                      </div>

                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Subject to Sauda (₹)
                        </label>
                        <input
                          type="number"
                          value={quickSauda}
                          onChange={(e) => setQuickSauda(Number(e.target.value))}
                          className={`w-full rounded-xl border px-3 py-2 text-base font-bold text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 focus:bg-white'
                          }`}
                        />
                        <span className={`text-[10px] mt-1 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Confirmed lot trade rate
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 text-xs shadow-lg transition cursor-pointer"
                      >
                        <Save className="h-4 w-4" />
                        <span>Publish Daily GMP to Public Website</span>
                      </button>
                    </div>
                  </form>

                  {/* Summary Metric Preview */}
                  <div className={`lg:col-span-5 rounded-3xl border p-6 space-y-4 transition ${
                    isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
                  }`}>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Calculated Retail Profit Preview
                    </h3>
                    <div className="space-y-3">
                      <div className={`rounded-2xl p-4 border ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Estimated Profit / Lot</div>
                        <div className="text-2xl font-bold text-emerald-500 mt-0.5">
                          +{formatCurrency(quickGmp * currentIpo.lotSize)}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Based on {currentIpo.lotSize} shares @ ₹{quickGmp}/sh GMP
                        </div>
                      </div>

                      <div className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        • Updates are committed instantly to <code className={`px-1 rounded ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>localStorage</code>.<br />
                        • Public ticker and homepage gainers update automatically without requiring page reloads.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 4: SUBSCRIPTION ENGINE
             ======================================================== */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Users className="h-5 w-5 text-indigo-500" />
                  <span>Live Subscription Multiplier Engine</span>
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Log Day 1, Day 2, and Day 3 combined NSE/BSE institutional and retail bidding tallies
                </p>
              </div>

              {/* Selector Bar */}
              <div className="flex flex-wrap gap-2">
                {ipos.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => handleSelectIpo(i.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedIpoId === i.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : isDark
                        ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs'
                    }`}
                  >
                    {i.name} ({i.symbol})
                  </button>
                ))}
              </div>

              {currentIpo && (
                <form onSubmit={handleSaveSubscription} className={`rounded-3xl border p-6 space-y-5 transition ${
                  isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Log Bidding for {currentIpo.name}</h3>
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Bidding Window: {currentIpo.openDate} to {currentIpo.closeDate}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <label className={`block text-xs font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Bidding Day</label>
                      <select
                        value={subDay}
                        onChange={(e) => setSubDay(Number(e.target.value))}
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-bold ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                        }`}
                      >
                        <option value={1}>Day 1</option>
                        <option value={2}>Day 2</option>
                        <option value={3}>Day 3 (Final)</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>QIB (Inst.)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 15.4"
                        value={qibMult}
                        onChange={(e) => setQibMult(Number(e.target.value))}
                        className={`w-full rounded-xl border px-3 py-2 text-sm font-bold text-indigo-500 ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 focus:bg-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>NII / HNI</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 28.2"
                        value={niiMult}
                        onChange={(e) => setNiiMult(Number(e.target.value))}
                        className={`w-full rounded-xl border px-3 py-2 text-sm font-bold text-purple-500 ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 focus:bg-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Retail (RII)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 42.5"
                        value={retailMult}
                        onChange={(e) => setRetailMult(Number(e.target.value))}
                        className={`w-full rounded-xl border px-3 py-2 text-sm font-bold text-emerald-500 ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 focus:bg-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Overall Total (x)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 35.8"
                        value={totalMult}
                        onChange={(e) => setTotalMult(Number(e.target.value))}
                        className={`w-full rounded-xl border px-3 py-2 text-sm font-bold ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 text-xs shadow-lg transition cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>Commit Subscription Tally</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 5: ALLOTMENT & REGISTRARS
             ======================================================== */}
          {activeTab === 'allotment' && (
            <div className="space-y-6">
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  <span>Allotment Declaration & Registrar Deep Linking</span>
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Switch status to &quot;Allotment Out&quot;, configure registrar direct links, and declare basis of allotment
                </p>
              </div>

              <div className={`rounded-2xl border overflow-hidden transition ${
                isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
              }`}>
                <table className="w-full text-left text-xs">
                  <thead className={`uppercase text-[11px] border-b font-semibold ${
                    isDark ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    <tr>
                      <th className="py-3.5 px-4">IPO Issue</th>
                      <th className="py-3.5 px-4">Allotment Date</th>
                      <th className="py-3.5 px-4">Registrar</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                    {ipos.map((ipo) => (
                      <tr key={ipo.id} className={`transition ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}`}>
                        <td className={`py-3 px-4 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {ipo.name} ({ipo.symbol})
                        </td>
                        <td className={`py-3 px-4 font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {ipo.allotmentDate}
                        </td>
                        <td className="py-3 px-4 font-semibold text-indigo-500">
                          {ipo.registrarName || 'Link Intime'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                            ipo.status === 'closed' || ipo.status === 'listed' 
                              ? isDark ? 'bg-purple-950 text-purple-400 border-purple-800' : 'bg-purple-50 text-purple-700 border-purple-200'
                              : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {ipo.status === 'closed' || ipo.status === 'listed' ? 'Declared' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              handleUpdateStatus(ipo.id, 'closed');
                              showToast(`🎯 Marked Allotment Out for ${ipo.name}!`);
                            }}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition border cursor-pointer ${
                              isDark 
                                ? 'bg-purple-900/60 hover:bg-purple-800 text-purple-200 border-purple-700/50'
                                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                            }`}
                          >
                            <span>Mark Declared</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 6: BROADCAST ALERTS & TICKER
             ======================================================== */}
          {/* ========================================================
              TAB 6: BROADCAST ALERTS & PUSH NOTIFICATIONS
             ======================================================== */}
          {activeTab === 'broadcasts' && (
            <div className="space-y-6">
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Megaphone className="h-5 w-5 text-amber-500" />
                      <span>Firebase Cloud Messaging & Push Broadcasts</span>
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Send free browser push alerts to all subscribed devices and manage automated alert checks
                    </p>
                  </div>

                  <button
                    onClick={fetchPushStats}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border transition ${
                      isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Refresh Stats</span>
                  </button>
                </div>
              </div>

              {/* 3 Metric Cards for Push Subscribers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'}`}>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Active FCM Subscribers
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {pushStats?.totalSubscribers ?? 0}
                    </span>
                    <span className="text-xs text-emerald-500 font-semibold">
                      ({pushStats?.liveSubscribers ?? 0} Live / {pushStats?.demoSubscribers ?? 0} Demo)
                    </span>
                  </div>
                  <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Saved in server subscriber database
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'}`}>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Total Alerts Dispatched
                  </div>
                  <div className="mt-1 text-2xl font-bold text-amber-500">
                    {pushStats?.totalAlertsSent ?? 0} Events
                  </div>
                  <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Deduplication active (0 duplicates sent)
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'}`}>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Firebase Status
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${firebaseConfigured ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    <span className={`text-sm font-bold ${firebaseConfigured ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {firebaseConfigured ? 'Live Credentials Connected' : 'Simulated / Demo Mode'}
                    </span>
                  </div>
                  <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {firebaseConfigured ? 'Firebase Admin SDK active' : 'Set FIREBASE_* keys in .env.local'}
                  </div>
                </div>
              </div>

              {/* Push Broadcast Composer */}
              <div className={`rounded-3xl border p-6 space-y-4 max-w-3xl transition ${
                isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Manual Push Alert Composer
                  </h3>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Delivers directly to user browsers
                  </span>
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Notification Title
                  </label>
                  <input
                    type="text"
                    value={pushTitle}
                    onChange={(e) => setPushTitle(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-slate-200' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Notification Body (Keep short and specific)
                  </label>
                  <textarea
                    rows={2}
                    value={broadcastText}
                    onChange={(e) => setBroadcastText(e.target.value)}
                    className={`w-full rounded-xl border p-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                    }`}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    disabled={isPushSending}
                    onClick={() => handleSendPushBroadcast(false)}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    <Megaphone className="h-4 w-4" />
                    <span>{isPushSending ? 'Dispatching Push...' : 'Send Push Alert to All Subscribers'}</span>
                  </button>

                  <button
                    disabled={isPushSending}
                    onClick={() => handleSendPushBroadcast(true)}
                    className={`inline-flex items-center gap-2 rounded-xl border py-2.5 px-4 text-xs font-semibold transition cursor-pointer ${
                      isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Send Test Push (1 Device)</span>
                  </button>

                  <button
                    onClick={() => {
                      setBroadcastSent(true);
                      showToast('📢 Flash alert broadcasted to public ticker strip!');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 text-xs shadow-md transition cursor-pointer"
                  >
                    <span>Update Header Ticker</span>
                  </button>
                </div>

                {broadcastSent && (
                  <div className={`rounded-xl border p-3 text-xs font-medium ${
                    isDark 
                      ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300' 
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}>
                    ✅ Notification dispatched and ticker updated!
                  </div>
                )}
              </div>

              {/* Scheduled Cron Runner & Deduplication Inspector */}
              <div className={`rounded-3xl border p-6 space-y-4 max-w-3xl transition ${
                isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Automated Cron Alert Check (/api/cron/check-ipo-alerts)
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Checks for new IPO openings, price band announcements, closing day reminders, and allotment results without duplicates.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    disabled={isCronRunning}
                    onClick={() => handleTriggerCron(false)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 text-xs shadow-sm transition cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isCronRunning ? 'animate-spin' : ''}`} />
                    <span>{isCronRunning ? 'Running Check...' : 'Run Scheduled Check Now'}</span>
                  </button>

                  <button
                    disabled={isCronRunning}
                    onClick={() => handleTriggerCron(true)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border py-2 px-3.5 text-xs font-semibold transition cursor-pointer ${
                      isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Force Send (Ignore Deduplication Cache)</span>
                  </button>
                </div>

                {cronOutput && (
                  <div className="mt-3">
                    <div className={`text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Execution Response:
                    </div>
                    <pre className={`p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48 ${
                      isDark ? 'bg-slate-950 text-emerald-400 border border-slate-800' : 'bg-slate-100 text-emerald-800 border border-slate-200'
                    }`}>
                      {cronOutput}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: MASTER NOTIFICATIONS & PREDEFINED TEMPLATES
             ======================================================== */}
          {activeTab === 'notifications' && (
            <AdminNotificationsMaster isDark={isDark} />
          )}

          {/* ========================================================
              TAB 7: MONETIZATION & BROKER AFFILIATES
             ======================================================== */}
          {activeTab === 'monetization' && (
            <div className="space-y-6">
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                  <span>Broker Affiliate Revenue & Partner Codes</span>
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Manage Zerodha, Groww, and Angel One affiliate IDs attached to all 1-click apply buttons
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
                <div className={`rounded-2xl border p-5 space-y-3 transition ${
                  isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
                }`}>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Zerodha Referral</span>
                  <div>
                    <label className={`block text-[11px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Partner Client ID</label>
                    <input
                      type="text"
                      value={zerodhaCode}
                      onChange={(e) => setZerodhaCode(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs font-mono font-bold ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Links generate: https://zerodha.com/open-account?c={zerodhaCode}</span>
                </div>

                <div className={`rounded-2xl border p-5 space-y-3 transition ${
                  isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
                }`}>
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Groww Partner URL</span>
                  <div>
                    <label className={`block text-[11px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Affiliate Landing URL</label>
                    <input
                      type="text"
                      value={growwUrl}
                      onChange={(e) => setGrowwUrl(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs font-mono font-bold ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Direct UPI Demat account opening funnel</span>
                </div>

                <div className={`rounded-2xl border p-5 space-y-3 transition ${
                  isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
                }`}>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Angel One Referral</span>
                  <div>
                    <label className={`block text-[11px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Broker Tracking Code</label>
                    <input
                      type="text"
                      value={angelCode}
                      onChange={(e) => setAngelCode(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs font-mono font-bold ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>ARQ advisory & free account campaign</span>
                </div>
              </div>

              <button
                onClick={() => showToast('💰 Broker affiliate tracking parameters updated across all pages!')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Affiliate Parameters</span>
              </button>
            </div>
          )}

          {/* ========================================================
              TAB 8: BACKUP & DATA RESTORE
             ======================================================== */}
          {activeTab === 'data' && (
            <div className="space-y-6 max-w-2xl">
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Settings className="h-5 w-5 text-indigo-500" />
                  <span>Database Operations & Snapshots</span>
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Export complete primary market database as JSON or reset to factory defaults
                </p>
              </div>

              <div className="space-y-4">
                <div className={`rounded-2xl border p-5 flex items-center justify-between transition ${
                  isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white shadow-xs'
                }`}>
                  <div>
                    <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Export Database Snapshot</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Download complete IPO records, GMP history, and tallies as JSON</div>
                  </div>
                  <button
                    onClick={handleExportJson}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold transition cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download JSON</span>
                  </button>
                </div>

                <div className={`rounded-2xl border p-5 flex items-center justify-between transition ${
                  isDark ? 'border-rose-950/60 bg-rose-950/20' : 'border-rose-200 bg-rose-50/50'
                }`}>
                  <div>
                    <div className={`text-sm font-bold ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>Reset Factory Sample Data</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Wipes custom modifications and restores benchmark sample IPOs</div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Reset all IPO data back to initial mock dataset?')) {
                        const reset = resetIpoData();
                        setIpos(reset);
                        showToast('🔄 Restored benchmark mock IPO dataset');
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition border cursor-pointer ${
                      isDark ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border-rose-700/40' : 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-200'
                    }`}
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ========================================================
          FULL ADD / EDIT IPO MODAL
         ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className={`w-full max-w-3xl rounded-3xl border p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto shadow-2xl transition ${
            isDark ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'
          }`}>
            
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Briefcase className="h-5 w-5 text-indigo-500" />
                <span>{modalMode === 'create' ? 'Add New IPO to Market' : 'Edit IPO Parameters'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-1 rounded-lg cursor-pointer ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              
              {/* Row 1: Name, Symbol, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Tech Ltd"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Stock Symbol</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ACMETECH"
                    value={formData.symbol || ''}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as IpoCategory })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  >
                    <option value="mainboard">Mainboard IPO</option>
                    <option value="sme">SME IPO</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Price Band, Lot Size, Issue Size */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Min Price (₹)</label>
                  <input
                    type="number"
                    value={formData.priceBandMin || 0}
                    onChange={(e) => setFormData({ ...formData, priceBandMin: Number(e.target.value) })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Max Price (₹)</label>
                  <input
                    type="number"
                    value={formData.priceBandMax || 0}
                    onChange={(e) => setFormData({ ...formData, priceBandMax: Number(e.target.value) })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Lot Size (Shares)</label>
                  <input
                    type="number"
                    value={formData.lotSize || 0}
                    onChange={(e) => setFormData({ ...formData, lotSize: Number(e.target.value) })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Issue Size (₹ Cr)</label>
                  <input
                    type="number"
                    value={formData.issueSizeCr || 0}
                    onChange={(e) => setFormData({ ...formData, issueSizeCr: Number(e.target.value) })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Row 3: Timelines */}
              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Bidding Open</label>
                  <input
                    type="date"
                    value={formData.openDate || ''}
                    onChange={(e) => setFormData({ ...formData, openDate: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Bidding Close</label>
                  <input
                    type="date"
                    value={formData.closeDate || ''}
                    onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Allotment Date</label>
                  <input
                    type="date"
                    value={formData.allotmentDate || ''}
                    onChange={(e) => setFormData({ ...formData, allotmentDate: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Listing Date</label>
                  <input
                    type="date"
                    value={formData.listingDate || ''}
                    onChange={(e) => setFormData({ ...formData, listingDate: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Row 4: Registrar & GMP */}
              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Assigned Registrar</label>
                  <select
                    value={formData.registrarName}
                    onChange={(e) => setFormData({ ...formData, registrarName: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  >
                    <option value="Link Intime India">Link Intime India</option>
                    <option value="KFin Technologies">KFin Technologies</option>
                    <option value="Bigshare Services">Bigshare Services</option>
                    <option value="Skyline Financial">Skyline Financial</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Initial GMP (₹)</label>
                  <input
                    type="number"
                    value={formData.currentGmp || 0}
                    onChange={(e) => {
                      const g = Number(e.target.value);
                      const max = formData.priceBandMax || 1;
                      setFormData({ 
                        ...formData, 
                        currentGmp: g,
                        currentListingGainPct: Number(((g / max) * 100).toFixed(2))
                      });
                    }}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold text-emerald-500 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sector / Industry</label>
                  <input
                    type="text"
                    value={formData.sector || ''}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Notification Opt-in Toggle */}
              <div className={`rounded-2xl border p-3.5 flex items-center justify-between gap-3 ${
                isDark ? 'border-indigo-900/60 bg-indigo-950/30' : 'border-indigo-100 bg-indigo-50/60'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <BellRing className="h-4 w-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      🔔 Dispatch Instant Push Alert to All Subscribers
                    </div>
                    <div className={`text-[11px] ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      Subscribers receive an immediate browser push popup notification
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnSave}
                  onChange={(e) => setNotifyOnSave(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5 cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isDark 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg transition cursor-pointer"
                >
                  Save IPO to Market
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
