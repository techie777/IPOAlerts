import { AppNotification } from '@/types/user';
import { INITIAL_NOTIFICATIONS } from '@/data/mockNotifications';

const NOTIFS_STORAGE_KEY = 'ipo_app_notifications';

export function getStoredNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;

  try {
    const raw = localStorage.getItem(NOTIFS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: AppNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifs));
    window.dispatchEvent(new Event('notificationsUpdated'));
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
}

export function addAppNotification(newNotif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): AppNotification {
  const notifs = getStoredNotifications();
  const created: AppNotification = {
    ...newNotif,
    id: 'notif-' + Date.now(),
    timestamp: new Date().toISOString(),
    isRead: false,
  };

  const updated = [created, ...notifs];
  saveStoredNotifications(updated);
  return created;
}

export function markNotificationAsRead(id: string): void {
  const notifs = getStoredNotifications();
  const updated = notifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  saveStoredNotifications(updated);
}

export function markAllNotificationsAsRead(): void {
  const notifs = getStoredNotifications();
  const updated = notifs.map((n) => ({ ...n, isRead: true }));
  saveStoredNotifications(updated);
}

export function deleteNotification(id: string): void {
  const notifs = getStoredNotifications();
  const updated = notifs.filter((n) => n.id !== id);
  saveStoredNotifications(updated);
}

export function clearAllNotifications(): void {
  saveStoredNotifications([]);
}

export function getUnreadNotificationsCount(): number {
  const notifs = getStoredNotifications();
  return notifs.filter((n) => !n.isRead).length;
}

export async function syncNotificationsFromServer(): Promise<AppNotification[]> {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;

  try {
    let res = await fetch('/api/notifications');
    if (!res.ok) {
      res = await fetch('/api/admin/notifications');
    }
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        saveStoredNotifications(data.notifications);
        return data.notifications;
      }
    }
  } catch (err) {
    console.warn('Could not sync notifications from server:', err);
  }

  return getStoredNotifications();
}
