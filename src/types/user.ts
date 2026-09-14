import { NotificationPreferences } from './ipo';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  investorCategory: 'retail' | 'sNII' | 'bNII' | 'institutional';
  primaryBroker: string;
  avatarUrl?: string;
  joinedAt: string;
  soundEnabled: boolean;
  minGmpThresholdPct: number;
  notificationPreferences: NotificationPreferences;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string; // ISO date string
  type: 'newIpo' | 'gmpSurge' | 'allotment' | 'closing' | 'subscription' | 'general';
  category: 'mainboard' | 'sme' | 'general';
  ipoSlug?: string;
  actionUrl?: string;
  isRead: boolean;
}
