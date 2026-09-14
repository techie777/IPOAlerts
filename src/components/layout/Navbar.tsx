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
  ChevronRight,
  Download,
  Globe,
} from 'lucide-react';
import { getStoredIpos } from '@/lib/ipoStore';
import { IPO } from '@/types/ipo';
import { getCurrentUser, logoutUser } from '@/lib/authStore';
import { UserProfile } from '@/types/user';
import { getUnreadNotificationsCount } from '@/lib/notificationsStore';
import NotificationModal from '@/components/notifications/NotificationModal';
import AuthModal from '@/components/auth/AuthModal';
import PwaInstallButton from '@/components/pwa/PwaInstallButton';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';


export default function Navbar() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

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

    // Keyboard shortcut to focus search: press '/' or 'Ctrl+K'
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'k')
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Click outside to close user dropdown & search
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
      document.removeEventListener('keydown', handleKeyDown);
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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Brand Logo & Navigation */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors font-heading">
                  IPO<span className="text-indigo-600">Alerts</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  LIVE
                </span>
              </div>
            </Link>

            {/* Public Navigation */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-semibold text-slate-600">
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                {t.allIpos}
              </Link>
              <Link
                href="/gmp"
                className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
              >
                <span>{t.liveGmp}</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 live-beacon" />
              </Link>
              <Link href="/subscription" className="hover:text-indigo-600 transition-colors">
                {t.subscription}
              </Link>
              <Link href="/allotment" className="hover:text-indigo-600 transition-colors">
                {t.allotment}
              </Link>
              <Link
                href="/calendar"
                className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
              >
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{t.calendar}</span>
              </Link>
            </nav>
          </div>

          {/* Search, Notifications & User Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Input */}
            <div className="relative hidden md:block">
              <div className="flex items-center rounded-full bg-slate-100/90 px-3 py-1.5 text-xs ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:bg-white transition-all w-36 lg:w-52">
                <Search className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search IPO, symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden lg:inline-flex items-center rounded bg-slate-200/80 px-1 py-0.2 text-[9px] font-mono text-slate-500 font-bold">
                    /
                  </kbd>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {searchOpen && searchQuery.trim() && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50">
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

            {/* Notification & Alerts Center Trigger (Bell Icon with unread badge) */}
            <button
              type="button"
              onClick={() => setNotifOpen(true)}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="Instant Alerts & Notification Settings"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Language Switcher (Desktop only: hidden on mobile) */}
            <LanguageSwitcher className="hidden md:inline-flex" />

            {/* PWA 1-Tap Install Button (Sleek Compact Pill on xl screens) */}
            <PwaInstallButton variant="navbar" />

            {/* Desktop User Profile & Auth Dropdown (Desktop only: hidden on mobile) */}
            <div className="hidden md:block">
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
            </div>

            {/* Mobile Unified Menu Trigger (Merged Profile & Menu Option) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer active:scale-95"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-800" />
              ) : user ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-[11px] shadow-xs">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
              ) : (
                <Menu className="h-5 w-5 text-slate-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3.5 space-y-3 text-sm font-semibold text-slate-700 shadow-xl animate-in fade-in slide-in-from-top-2">
            {/* 1. Language Switcher inside Menu */}
            <div className="flex items-center justify-between py-2 px-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">Language / भाषा:</span>
              </div>
              <LanguageSwitcher />
            </div>

            {/* 2. User Account Section inside Menu */}
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <Link
                  href="/profile?tab=profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 min-w-0"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-xs shrink-0">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="shrink-0 text-[11px] font-bold text-rose-600 hover:text-rose-700 px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span>Sign In to Account</span>
              </button>
            )}

            {/* 3. Primary Mobile Navigation Links */}
            <div className="space-y-0.5 pt-1 border-t border-slate-100">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <span>{t.allIpos}</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/gmp"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <div className="flex items-center gap-2">
                  <span>{t.liveGmp}</span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 live-beacon" />
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/subscription"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <span>{t.subscription}</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/allotment"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <span>{t.allotment}</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/calendar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{t.calendar}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 px-3 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50/50 transition"
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications Feed</span>
                </div>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-emerald-500 text-white text-[10px] px-2 py-0.5 font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {user && (
                <Link
                  href="/profile?tab=profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 px-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" />
                    <span>My Profile & Settings</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              )}
            </div>

            {/* 4. 1-Tap PWA Mobile Add to Screen */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (window.deferredPwaPrompt) {
                  window.deferredPwaPrompt.prompt();
                } else {
                  window.dispatchEvent(new CustomEvent('openPwaInstallModal'));
                }
              }}
              className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-emerald-50 hover:from-indigo-100 hover:to-emerald-100 text-indigo-950 font-bold border border-indigo-200/80 shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-indigo-600" />
                <span className="text-xs">Add App to Phone Screen</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold">
                &lt;1MB
              </span>
            </button>
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
