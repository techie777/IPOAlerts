'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  BellRing,
  PlusCircle,
  Search,
  Trash2,
  Edit3,
  RefreshCw,
  Sparkles,
  Send,
  ExternalLink,
  Volume2,
  Clock,
  RotateCcw,
  CheckCircle2,
  Layers,
  Flame,
  Calendar,
  Eye,
  SlidersHorizontal,
  X,
  Smartphone,
  Laptop,
  Check,
  AlertTriangle
} from 'lucide-react';
import { AppNotification } from '@/types/user';
import { IPO } from '@/types/ipo';
import { getStoredIpos } from '@/lib/ipoStore';
import { playNotificationSound } from '@/lib/audioNotifier';
import {
  PREDEFINED_TEMPLATES,
  NotificationTemplate,
  interpolateTemplate
} from '@/data/notificationTemplates';

interface AdminNotificationsMasterProps {
  isDark?: boolean;
}

export default function AdminNotificationsMaster({
  isDark = true,
}: AdminNotificationsMasterProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [selectedIpoSlug, setSelectedIpoSlug] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'mainboard' as 'mainboard' | 'sme' | 'general',
    type: 'newIpo' as AppNotification['type'],
    actionUrl: '/ipo',
    ipoSlug: '',
    dispatchPush: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activePreviewDevice, setActivePreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [firebaseConfigured, setFirebaseConfigured] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setFirebaseConfigured(Boolean(data.firebaseConfigured));
      }
    } catch (err) {
      console.error('Failed to load notifications from API:', err);
      showToast('⚠️ Could not load notifications from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadedIpos = getStoredIpos();
    setIpos(loadedIpos);
    if (loadedIpos.length > 0) {
      setSelectedIpoSlug(loadedIpos[0].slug);
    }
    fetchNotifications();
  }, []);

  const selectedIpo = ipos.find((i) => i.slug === selectedIpoSlug) || ipos[0] || null;

  // Template Click Handler
  const handleSelectTemplate = (template: NotificationTemplate) => {
    setSelectedTemplateId(template.id);
    const interpolated = interpolateTemplate(template, selectedIpo);

    setFormData({
      title: interpolated.title,
      message: interpolated.body,
      category: interpolated.category,
      type: interpolated.type,
      actionUrl: interpolated.actionUrl,
      ipoSlug: selectedIpo?.slug || '',
      dispatchPush: firebaseConfigured,
    });
    setModalMode('create');
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Open Blank Create Modal
  const handleOpenCreate = () => {
    setSelectedTemplateId('');
    setFormData({
      title: '',
      message: '',
      category: selectedIpo?.category || 'mainboard',
      type: 'newIpo',
      actionUrl: selectedIpo ? `/ipo/${selectedIpo.slug}` : '/',
      ipoSlug: selectedIpo?.slug || '',
      dispatchPush: firebaseConfigured,
    });
    setModalMode('create');
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (notif: AppNotification) => {
    setSelectedTemplateId('');
    setFormData({
      title: notif.title,
      message: notif.message,
      category: notif.category,
      type: notif.type,
      actionUrl: notif.actionUrl || '/',
      ipoSlug: notif.ipoSlug || '',
      dispatchPush: false,
    });
    setModalMode('edit');
    setEditingId(notif.id);
    setIsModalOpen(true);
  };

  // Form Submit Handler
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      showToast('⚠️ Title and message are required.');
      return;
    }

    setIsSaving(true);
    try {
      if (modalMode === 'create') {
        const res = await fetch('/api/admin/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            message: formData.message,
            category: formData.category,
            type: formData.type,
            actionUrl: formData.actionUrl,
            ipoSlug: formData.ipoSlug,
            dispatchPush: formData.dispatchPush,
          }),
        });
        const result = await res.json();
        if (result.success) {
          showToast(
            formData.dispatchPush
              ? '🚀 Notification saved & dispatched via Firebase Web Push!'
              : '✅ Notification created and saved to feed.'
          );
          setIsModalOpen(false);
          fetchNotifications();
        } else {
          showToast(`❌ Error: ${result.error || 'Failed to save.'}`);
        }
      } else if (modalMode === 'edit' && editingId) {
        const res = await fetch('/api/admin/notifications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            title: formData.title,
            message: formData.message,
            category: formData.category,
            type: formData.type,
            actionUrl: formData.actionUrl,
            ipoSlug: formData.ipoSlug,
          }),
        });
        const result = await res.json();
        if (result.success) {
          showToast('✅ Notification updated successfully.');
          setIsModalOpen(false);
          fetchNotifications();
        } else {
          showToast(`❌ Error: ${result.error || 'Failed to update.'}`);
        }
      }
    } catch (err) {
      console.error('Error submitting notification form:', err);
      showToast('❌ Network error submitting notification.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete notification "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/notifications?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        showToast('🗑️ Notification deleted.');
      } else {
        showToast(`❌ Error: ${result.error || 'Delete failed.'}`);
      }
    } catch {
      showToast('❌ Failed to delete notification.');
    }
  };

  // Reset to sample defaults
  const handleResetDefaults = async () => {
    if (!confirm('Reset notification feed to sample default templates?')) return;
    try {
      const res = await fetch('/api/admin/notifications?action=reset', { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setNotifications(result.notifications);
        showToast('🔄 Notifications reset to initial defaults.');
      }
    } catch {
      showToast('❌ Reset failed.');
    }
  };

  // Instant 1-Click Push Dispatch for existing notification
  const handleDispatchExisting = async (notif: AppNotification) => {
    if (!confirm(`Broadcast "${notif.title}" as live push notification to all subscribers?`)) return;
    try {
      const res = await fetch('/api/admin/broadcast-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notif.title,
          message: notif.message,
          url: notif.actionUrl || '/',
          category: notif.category,
          topic: notif.type,
        }),
      });
      const result = await res.json();
      if (result.success) {
        showToast(`🚀 Push alert sent! (${result.details?.successCount || 0} subscribers reached)`);
      } else {
        showToast('⚠️ Push broadcast returned an issue.');
      }
    } catch {
      showToast('❌ Broadcast dispatch failed.');
    }
  };

  // Audio preview chime
  const handlePlayChime = () => {
    playNotificationSound(true);
    showToast('🔔 Audio chime played');
  };

  // Filter & Search
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notif.ipoSlug && notif.ipoSlug.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'all' || notif.type === filterType;
    return matchesSearch && matchesType;
  });

  const getBadgeStyle = (type: AppNotification['type']) => {
    switch (type) {
      case 'newIpo':
        return isDark
          ? 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60'
          : 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'gmpSurge':
        return isDark
          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'allotment':
        return isDark
          ? 'bg-purple-950/80 text-purple-400 border-purple-800/60'
          : 'bg-purple-50 text-purple-700 border-purple-200';
      case 'closing':
        return isDark
          ? 'bg-amber-950/80 text-amber-400 border-amber-800/60'
          : 'bg-amber-50 text-amber-700 border-amber-200';
      case 'subscription':
        return isDark
          ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60'
          : 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return isDark
          ? 'bg-slate-800 text-slate-300 border-slate-700'
          : 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl bg-slate-900 text-white text-xs px-4 py-3 shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-fade-in">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Master Notifications & Push Alerts Manager
                </h1>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
                  Manage, compose, preview, and dispatch real-time push alerts with predefined IPO templates
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePlayChime}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                isDark
                  ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
              title="Test Notification Sound"
            >
              <Volume2 className="h-4 w-4 text-indigo-500" />
              <span>Test Audio</span>
            </button>

            <button
              onClick={fetchNotifications}
              disabled={loading}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                isDark
                  ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-bold shadow-md transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Notification</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white shadow-xs'}`}>
          <div className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Total Feed Items
          </div>
          <div className={`mt-1 text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {notifications.length}
          </div>
          <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Active in user notification feeds
          </div>
        </div>

        <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white shadow-xs'}`}>
          <div className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Predefined Templates
          </div>
          <div className="mt-1 text-2xl font-black text-amber-500">
            {PREDEFINED_TEMPLATES.length} Types
          </div>
          <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            1-click auto-fill enabled
          </div>
        </div>

        <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white shadow-xs'}`}>
          <div className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Firebase Push Gateway
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${firebaseConfigured ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <span className={`text-base font-bold ${firebaseConfigured ? 'text-emerald-500' : 'text-amber-500'}`}>
              {firebaseConfigured ? 'Connected & Live' : 'Demo / Simulated'}
            </span>
          </div>
          <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {firebaseConfigured ? 'Ready to multicast push' : 'Check .env.local setup'}
          </div>
        </div>

        <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white shadow-xs'}`}>
          <div className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Quick Links
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Link
              href="/notifications"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-400 underline"
            >
              <span>View Public Feed</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            End-user browser feed
          </div>
        </div>
      </div>

      {/* ========================================================
          PREDEFINED TEMPLATES SELECTOR SECTION
         ======================================================== */}
      <div className={`rounded-3xl border p-5 sm:p-6 space-y-4 ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-xs'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200/20">
          <div>
            <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Predefined Notification Templates (1-Click Auto-Fill)</span>
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Select an IPO below to automatically inject live GMP, prices, and registrar links into any template
            </p>
          </div>

          {/* IPO Selector Dropdown */}
          <div className="flex items-center gap-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Target IPO:
            </label>
            <select
              value={selectedIpoSlug}
              onChange={(e) => setSelectedIpoSlug(e.target.value)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {ipos.map((ipo) => (
                <option key={ipo.id} value={ipo.slug}>
                  {ipo.name} ({ipo.category.toUpperCase()} • GMP: +₹{ipo.currentGmp || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PREDEFINED_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              className={`group flex flex-col justify-between text-left rounded-2xl border p-4 transition-all duration-150 hover:scale-[1.02] cursor-pointer ${
                isDark
                  ? 'border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-slate-900/90'
                  : 'border-slate-200 bg-slate-50/70 hover:border-indigo-500 hover:bg-white shadow-2xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{tpl.icon}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      tpl.category === 'sme'
                        ? 'border-cyan-500/30 text-cyan-400'
                        : 'border-indigo-500/30 text-indigo-400'
                    }`}
                  >
                    {tpl.tags[0] || tpl.type}
                  </span>
                </div>
                <div>
                  <h3 className={`text-xs font-bold ${isDark ? 'text-white group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                    {tpl.name}
                  </h3>
                  <p className={`text-[11px] mt-1 leading-snug line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {tpl.shortDesc}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/10 text-[11px] font-bold text-indigo-500 group-hover:underline">
                <span>Use Template</span>
                <Send className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          MASTER NOTIFICATIONS TABLE & MANAGEMENT
         ======================================================== */}
      <div className={`rounded-3xl border overflow-hidden ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white shadow-xs'}`}>
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Feeds' },
              { id: 'newIpo', label: 'Bidding Open' },
              { id: 'gmpSurge', label: 'GMP Surges' },
              { id: 'allotment', label: 'Allotments' },
              { id: 'closing', label: 'Closing Today' },
              { id: 'subscription', label: 'Subscription' },
              { id: 'general', label: 'Broadcasts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterType === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <button
              onClick={handleResetDefaults}
              className={`p-2 rounded-xl border text-xs font-semibold transition ${
                isDark
                  ? 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
              title="Reset feed to sample templates"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-slate-200/10">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const badgeStyle = getBadgeStyle(notif.type);
              return (
                <div
                  key={notif.id}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                    isDark ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}>
                        {notif.type}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                          notif.category === 'sme'
                            ? 'border-cyan-500/40 text-cyan-400 bg-cyan-950/30'
                            : 'border-slate-700 text-slate-400'
                        }`}
                      >
                        {notif.category}
                      </span>
                      <span className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(notif.timestamp)}</span>
                      </span>
                    </div>

                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {notif.title}
                    </h3>

                    <p className={`text-xs leading-relaxed max-w-3xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {notif.message}
                    </p>

                    {notif.actionUrl && (
                      <div className="pt-1">
                        <Link
                          href={notif.actionUrl}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-500 hover:text-indigo-400 underline"
                          target="_blank"
                        >
                          <span>Target: {notif.actionUrl}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleDispatchExisting(notif)}
                      className="inline-flex items-center gap-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white px-2.5 py-1.5 text-xs font-semibold border border-indigo-500/30 transition"
                      title="Send as Firebase push broadcast now"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Push</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(notif)}
                      className={`p-1.5 rounded-xl border transition ${
                        isDark
                          ? 'border-slate-800 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Edit notification"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(notif.id, notif.title)}
                      className={`p-1.5 rounded-xl border transition ${
                        isDark
                          ? 'border-slate-800 bg-slate-800/80 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 hover:border-rose-800'
                          : 'border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No notifications matching filter
              </h4>
              <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Try adjusting your search query or click a predefined template above to generate a new market alert.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          CREATE / EDIT NOTIFICATION MODAL WITH LIVE PREVIEW
         ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div
            className={`w-full max-w-2xl rounded-3xl border shadow-2xl p-6 my-8 space-y-5 transition ${
              isDark ? 'border-slate-800 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-200/10">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Bell className="h-4 w-4 text-indigo-500" />
                  <span>{modalMode === 'create' ? 'Create New Notification' : 'Edit Notification'}</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {modalMode === 'create'
                    ? 'Populate message content and optionally dispatch as live Web Push'
                    : 'Modify notification parameters in the system feed'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-1.5 rounded-xl border ${
                  isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Category & Type Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Market Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className={`w-full rounded-xl border p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="mainboard">Mainboard IPO</option>
                    <option value="sme">SME IPO</option>
                    <option value="general">General / All</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Notification Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className={`w-full rounded-xl border p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="newIpo">🔔 Live Bidding Open</option>
                    <option value="gmpSurge">🚀 GMP Surge Alert</option>
                    <option value="allotment">🎉 Allotment Status Out</option>
                    <option value="closing">⏰ Closing Day Reminder</option>
                    <option value="subscription">🔥 High Subscription Spike</option>
                    <option value="general">📢 General Flash Broadcast</option>
                  </select>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Alert Title
                  </label>
                  <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {formData.title.length}/80 characters
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 🚀 GMP Surge: Waaree Energies (+98.13%)"
                  className={`w-full rounded-xl border p-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Message Body Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Alert Message Body
                  </label>
                  <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {formData.message.length}/200 characters
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  maxLength={250}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Keep body punchy and specific with exact numbers or dates..."
                  className={`w-full rounded-xl border p-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Action URL */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Target Destination URL (Opens upon click)
                </label>
                <input
                  type="text"
                  value={formData.actionUrl}
                  onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                  placeholder="e.g. /ipo/waaree-energies-limited-ipo or /gmp"
                  className={`w-full rounded-xl border p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Live Simulated Push Alert Preview */}
              <div className={`rounded-2xl border p-3.5 space-y-2 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Eye className="h-3 w-3" />
                    <span>Live Push Banner Preview</span>
                  </span>

                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setActivePreviewDevice('mobile')}
                      className={`p-1 rounded-lg ${activePreviewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                      title="Mobile preview"
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePreviewDevice('desktop')}
                      className={`p-1 rounded-lg ${activePreviewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                      title="Desktop preview"
                    >
                      <Laptop className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Simulated Push Card */}
                <div className="rounded-xl border border-indigo-500/30 bg-slate-950 text-white p-3 shadow-lg flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">
                    IPO
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        IPO Alerts • Now
                      </span>
                      <span className="text-[10px] text-slate-500">push</span>
                    </div>
                    <div className="text-xs font-bold truncate text-white">
                      {formData.title || 'Alert Title Appears Here'}
                    </div>
                    <div className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                      {formData.message || 'Notification message body preview will be displayed here.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Push Dispatch Toggle (Only for create mode) */}
              {modalMode === 'create' && (
                <div className={`rounded-2xl border p-3.5 flex items-center justify-between ${
                  isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-indigo-50/30'
                }`}>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold flex items-center gap-1.5 text-indigo-400">
                      <Send className="h-3.5 w-3.5" />
                      <span>Dispatch Live Web Push (Firebase Cloud Messaging)</span>
                    </div>
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Sends native browser alert instantly to all active FCM subscribers
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={formData.dispatchPush}
                    onChange={(e) => setFormData({ ...formData, dispatchPush: e.target.checked })}
                    className="h-4 w-4 rounded accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                    isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 text-xs shadow-md transition disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  <span>
                    {isSaving
                      ? 'Saving...'
                      : modalMode === 'create'
                      ? formData.dispatchPush
                        ? 'Save & Dispatch Push'
                        : 'Save to Feed'
                      : 'Update Notification'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
