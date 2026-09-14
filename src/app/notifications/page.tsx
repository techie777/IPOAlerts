'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  TrendingUp,
  Sparkles,
  Calendar,
  CheckCircle2,
  Trash2,
  SlidersHorizontal,
  ExternalLink,
  Volume2,
  Clock,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import { AppNotification } from '@/types/user';
import {
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} from '@/lib/notificationsStore';
import { playNotificationSound } from '@/lib/audioNotifier';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'newIpo' | 'gmpSurge' | 'allotment' | 'closing'
  >('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setNotifications(getStoredNotifications());
    const handleUpdate = () => setNotifications(getStoredNotifications());
    window.addEventListener('notificationsUpdated', handleUpdate);
    return () => window.removeEventListener('notificationsUpdated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    setNotifications(getStoredNotifications());
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    setNotifications(getStoredNotifications());
    showToast('All notifications marked as read.');
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    setNotifications(getStoredNotifications());
  };

  const handleClearAll = () => {
    if (confirm('Clear all notification history?')) {
      clearAllNotifications();
      setNotifications([]);
      showToast('Notification history cleared.');
    }
  };

  const handleTestSound = () => {
    playNotificationSound(true);
    showToast('🔔 Audio chime played!');
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

  const getTypeBadge = (type: AppNotification['type']) => {
    switch (type) {
      case 'newIpo':
        return { label: 'New IPO Open', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'gmpSurge':
        return { label: 'GMP Surge', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'allotment':
        return { label: 'Allotment Out', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'closing':
        return { label: 'Closing Today', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'subscription':
        return { label: 'Subscription Spike', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      default:
        return { label: 'Alert', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl bg-slate-900 text-white text-xs px-4 py-2.5 shadow-2xl border border-slate-700 flex items-center gap-2 animate-fade-in">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Market Notifications Feed
                </h1>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-emerald-500 text-white text-xs font-extrabold px-2.5 py-0.5 shadow-xs">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Real-time stream of bidding openings, GMP surges, subscription crosses, and allotment results
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={handleTestSound}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition"
            title="Preview Alert Chime"
          >
            <Volume2 className="h-3.5 w-3.5 text-indigo-600" />
            <span>Test Sound</span>
          </button>

          <Link
            href="/profile?tab=notifications"
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700 transition"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Customize Settings</span>
          </Link>
        </div>
      </div>

      {/* Filters & Bulk Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'newIpo', label: 'Bidding Open' },
            { id: 'gmpSurge', label: 'GMP Surges' },
            { id: 'allotment', label: 'Allotment Out' },
            { id: 'closing', label: 'Closing Today' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold self-end sm:self-center">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-indigo-600 hover:text-indigo-800 hover:underline px-2 py-1"
            >
              Mark all as read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-slate-400 hover:text-rose-600 px-2 py-1 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => {
            const badge = getTypeBadge(notif.type);
            return (
              <div
                key={notif.id}
                className={`relative rounded-3xl border p-4 sm:p-5 transition-all shadow-xs ${
                  notif.isRead
                    ? 'border-slate-200/80 bg-white hover:border-slate-300'
                    : 'border-indigo-200 bg-indigo-50/30 ring-1 ring-indigo-500/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Unread dot or read check */}
                    <div className="pt-1 shrink-0">
                      {notif.isRead ? (
                        <div className="h-2 w-2 rounded-full bg-slate-300" title="Read" />
                      ) : (
                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-sm shadow-indigo-600/50" title="Unread" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(notif.timestamp)}</span>
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {notif.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                        {notif.message}
                      </p>

                      {notif.actionUrl && (
                        <div className="pt-2">
                          <Link
                            href={notif.actionUrl}
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                          >
                            <span>View Related IPO</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Item Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">You are all caught up!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No notifications matching this filter. As soon as a new IPO opens, price bands are announced, or allotments are declared, they will appear right here.
            </p>
            <div className="pt-2">
              <Link
                href="/profile?tab=notifications"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-xs transition"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Adjust Notification Options</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
