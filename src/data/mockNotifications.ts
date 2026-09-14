import { AppNotification } from '@/types/user';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '🔔 Live Bidding Open: Waaree Energies Ltd',
    message: 'Waaree Energies IPO is now open for bidding! Price band ₹1,427–₹1,503 per share. Retail portion 35%. Closes Friday at 5:00 PM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    type: 'newIpo',
    category: 'mainboard',
    ipoSlug: 'waaree-energies-limited-ipo',
    actionUrl: '/ipo/waaree-energies-limited-ipo',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: '🚀 GMP Surge: Waaree Energies (+98.13%)',
    message: 'Grey Market Premium surged to +₹1,475 (+98.13% expected listing pop)! Heavy institutional demand observed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(), // 1.5 hours ago
    type: 'gmpSurge',
    category: 'mainboard',
    ipoSlug: 'waaree-energies-limited-ipo',
    actionUrl: '/gmp',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: '🔥 High Subscription: Waaree Energies 28.4x',
    message: 'Waaree Energies overall bidding crossed 28.4x on Day 2! Retail subscribed 10.2x, NII portion 24.8x.',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    type: 'subscription',
    category: 'mainboard',
    ipoSlug: 'waaree-energies-limited-ipo',
    actionUrl: '/subscription',
    isRead: false,
  },
  {
    id: 'notif-4',
    title: '🎉 Allotment Out: Premier Energies Ltd',
    message: 'Premier Energies IPO allotment status is now declared by KFin Technologies. Check your allotment status with PAN number.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    type: 'allotment',
    category: 'mainboard',
    ipoSlug: 'premier-energies-ltd-ipo',
    actionUrl: '/allotment',
    isRead: true,
  },
  {
    id: 'notif-5',
    title: '🏷️ Price Band Announced: Hyundai Motor India Ltd',
    message: 'Hyundai Motor India has fixed the price band at ₹1,865–₹1,960 per share for its historic ₹27,870 Cr mega IPO.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
    type: 'newIpo',
    category: 'mainboard',
    ipoSlug: 'hyundai-motor-india-ltd-ipo',
    actionUrl: '/ipo/hyundai-motor-india-ltd-ipo',
    isRead: true,
  },
  {
    id: 'notif-6',
    title: '⏰ Closing Today: TechVera Cloud Solutions Ltd (SME)',
    message: 'Final hours to bid for TechVera Cloud Solutions! Bidding closes at 5:00 PM today. Current GMP +₹84 (+71.18%).',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    type: 'closing',
    category: 'sme',
    ipoSlug: 'techvera-cloud-solutions-ltd-sme-ipo',
    actionUrl: '/ipo/techvera-cloud-solutions-ltd-sme-ipo',
    isRead: true,
  },
];
