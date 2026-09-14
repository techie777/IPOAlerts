import { UserProfile } from '@/types/user';
import { NotificationPreferences } from '@/types/ipo';

const AUTH_STORAGE_KEY = 'ipo_user_profile';
const AUTH_TOKEN_KEY = 'ipo_auth_session_token';

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  webPushEnabled: true,
  telegramEnabled: false,
  emailEnabled: true,
  mainboardAlerts: true,
  smeAlerts: true,
  gmpSurgeAlerts: true,
  allotmentOutAlerts: true,
  closingDayAlerts: true,
  emailAddress: 'rahul.investor@gmail.com',
  telegramHandle: '@rahulinvestor',
  watchedIpoSlugs: ['waaree-energies-limited-ipo', 'hyundai-motor-india-ltd-ipo'],

  // Granular Options
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

export const DEMO_USER: UserProfile = {
  id: 'usr-98214',
  name: 'Rahul Sharma',
  email: 'rahul.investor@gmail.com',
  phone: '+91 98765 43210',
  investorCategory: 'retail',
  primaryBroker: 'Zerodha',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
  joinedAt: 'January 2026',
  soundEnabled: true,
  minGmpThresholdPct: 15,
  notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
};

/**
 * Retrieves the currently authenticated user from localStorage.
 */
export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Logs in a user. Creates a profile if none exists.
 */
export function loginUser(email: string, name?: string, broker?: string): UserProfile {
  if (typeof window === 'undefined') return DEMO_USER;

  let existing = getCurrentUser();
  if (!existing || existing.email.toLowerCase() !== email.toLowerCase()) {
    existing = {
      id: 'usr-' + Date.now(),
      name: name || (email.includes('@') ? email.split('@')[0] : 'Investor'),
      email,
      phone: '+91 98765 43210',
      investorCategory: 'retail',
      primaryBroker: broker || 'Zerodha',
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      soundEnabled: true,
      minGmpThresholdPct: 15,
      notificationPreferences: {
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        emailAddress: email,
      },
    };
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(existing));
  localStorage.setItem(AUTH_TOKEN_KEY, 'sess_' + Date.now());
  window.dispatchEvent(new Event('userAuthUpdated'));
  return existing;
}

/**
 * Logs in as Demo User
 */
export function loginAsDemo(): UserProfile {
  if (typeof window === 'undefined') return DEMO_USER;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER));
  localStorage.setItem(AUTH_TOKEN_KEY, 'demo_token_123');
  window.dispatchEvent(new Event('userAuthUpdated'));
  return DEMO_USER;
}

/**
 * Logs out the current user.
 */
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event('userAuthUpdated'));
}

/**
 * Updates user profile details (Name, Phone, Category, Broker, Sound)
 */
export function updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
  if (typeof window === 'undefined') return null;

  const current = getCurrentUser() || DEMO_USER;
  const updated: UserProfile = {
    ...current,
    ...updates,
    notificationPreferences: {
      ...current.notificationPreferences,
      ...(updates.notificationPreferences || {}),
    },
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
  // Keep ipo_alerts_prefs in sync for notifications
  localStorage.setItem('ipo_alerts_prefs', JSON.stringify(updated.notificationPreferences));
  window.dispatchEvent(new Event('userAuthUpdated'));

  // Sync with server if token exists
  const fcmToken = localStorage.getItem('ipo_fcm_token');
  if (fcmToken) {
    fetch('/api/save-notification-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: fcmToken,
        preferences: updated.notificationPreferences,
      }),
    }).catch(() => {});
  }

  return updated;
}
