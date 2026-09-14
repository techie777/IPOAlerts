'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  TrendingUp,
  Calendar,
  BookOpen,
  X,
  Sparkles,
  Menu,
  User,
  LogOut,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { getStoredIpos } from '@/lib/ipoStore';
import { IPO } from '@/types/ipo';
import { getCurrentUser, logoutUser } from '@/lib/authStore';
import { UserProfile } from '@/types/user';
import { getUnreadNotificationsCount } from '@/lib/notificationsStore';
import NotificationModal from '@/components/notifications/NotificationModal';
import AuthModal from '@/components/auth/AuthModal';

export default function Navbar() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setIpos(getStoredIpos());
    const handleIpoUpdate = () => setIpos(getStoredIpos());
    window.addEventListener('ipoDataUpdated', handleIpoUpdate);

    // User session listener
    const loadUser = () => setUser(getCurrentUser());
    loadUser();
    window.addEventListener('userAuthUpdated', loadUser);

    // Notifications count listener
    const loadUnread = () => setUnreadCount(getUnreadNotificationsCount());
    loadUnread();
    window.addEventListener('notificationsUpdated', loadUnread);

    // Click outside to close user dropdown
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('ipoDataUpdated', handleIpoUpdate);
      window.removeEventListener('userAuthUpdated', loadUser);
      window.removeEventListener('notificationsUpdated', loadUnread);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUserDropdownOpen(false);
    router.push('/');
  };

  const filteredIpos = searchQuery.trim()
    ? ipos.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.sector.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-7 lg:gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  IPO<span className="text-indigo-600">Alerts</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  LIVE
                </span>
              </div>
            </Link>

            {/* Public Navigation */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-sm font-semibold text-slate-600">
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                All IPOs
              </Link>
              <Link
                href="/gmp"
                className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
              >
                <span>Live GMP</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 live-beacon" />
              </Link>
              <Link href="/subscription" className="hover:text-indigo-600 transition-colors">
                Subscription
              </Link>
              <Link href="/allotment" className="hover:text-indigo-600 transition-colors">
                Allotment
              </Link>
              <Link
                href="/calendar"
                className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
              >
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Calendar</span>
              </Link>
              <Link
                href="/faqs"
                className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
              >
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span>FAQs</span>
              </Link>
            </nav>
          </div>

          {/* Search, Notifications & User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <div className="flex items-center rounded-full bg-slate-100/90 px-3.5 py-1.5 text-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:bg-white transition-all w-48 lg:w-60">
                <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search IPO, symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {searchOpen && searchQuery.trim() && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Matching IPOs ({filteredIpos.length})
                  </div>
                  {filteredIpos.length > 0 ? (
                    filteredIpos.slice(0, 5).map((ipo) => (
                      <Link
                        key={ipo.id}
                        href={`/ipo/${ipo.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                            {ipo.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {ipo.symbol} • {ipo.category.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-emerald-600">
                            +₹{ipo.currentGmp}
                          </span>
                          <div className="text-[10px] font-medium text-slate-500">
                            +{ipo.currentListingGainPct}%
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400">
                      No IPOs matching &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification Page Link (Bell Icon with unread badge) */}
            <Link
              href="/notifications"
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="View Market Notifications Feed"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Free Instant Alert Customizer Modal Trigger */}
            <button
              onClick={() => setNotifOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition"
              title="Customize Push Alerts"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Alert Settings</span>
            </button>

            {/* User Profile & Auth Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-[11px]">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className="h-3 w-3 text-slate-500 hidden sm:inline" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-fade-in text-xs">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900 truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <Link
                        href="/profile?tab=profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <User className="h-4 w-4 text-indigo-600" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/profile?tab=notifications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition font-semibold"
                      >
                        <div className="flex items-center gap-2.5">
                          <Bell className="h-4 w-4 text-indigo-600" />
                          <span>My Notifications</span>
                        </div>
                        <span className="rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold px-1.5 py-0.2">
                          Options
                        </span>
                      </Link>

                      <Link
                        href="/notifications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <Sliders className="h-4 w-4 text-slate-500" />
                        <span>Notification Feed</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition cursor-pointer font-semibold"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 text-sm font-semibold text-slate-700">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-indigo-600"
            >
              All IPOs
            </Link>
            <Link
              href="/gmp"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-indigo-600"
            >
              Live GMP Tracker
            </Link>
            <Link
              href="/subscription"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-indigo-600"
            >
              Live Subscription
            </Link>
            <Link
              href="/allotment"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-indigo-600"
            >
              Allotment Status Direct Check
            </Link>
            <Link
              href="/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-1.5 text-indigo-600 font-bold"
            >
              <span>Notifications Feed</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-emerald-500 text-white text-[10px] px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link
                href="/profile?tab=notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-indigo-600 font-bold"
              >
                My Profile & Notifications
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full text-left py-1.5 text-indigo-600 font-bold"
              >
                Sign In to Account
              </button>
            )}
          </div>
        )}
      </header>

      {/* Notification Preferences Modal */}
      {notifOpen && <NotificationModal onClose={() => setNotifOpen(false)} />}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </>
  );
}
