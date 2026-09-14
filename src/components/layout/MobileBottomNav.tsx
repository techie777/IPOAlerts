'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Calendar, Bell, Flame, User } from 'lucide-react';
import { getUnreadNotificationsCount } from '@/lib/notificationsStore';
import { useLanguage } from '@/context/LanguageContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const updateCount = () => setUnreadCount(getUnreadNotificationsCount());
    updateCount();
    window.addEventListener('notificationsUpdated', updateCount);
    return () => window.removeEventListener('notificationsUpdated', updateCount);
  }, []);

  const navItems = [
    { label: t.allIpos, href: '/', icon: TrendingUp },
    { label: t.liveGmp, href: '/gmp', icon: Flame },
    { label: t.calendar, href: '/calendar', icon: Calendar },
    { label: t.alerts, href: '/notifications', icon: Bell, badge: unreadCount },
    { label: t.myProfile, href: '/profile', icon: User },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
