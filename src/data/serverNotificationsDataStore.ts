import fs from 'fs';
import path from 'path';
import { AppNotification } from '@/types/user';
import { INITIAL_NOTIFICATIONS } from './mockNotifications';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

let memoryNotifications: AppNotification[] | null = null;

function ensureNotificationsFile(): AppNotification[] {
  if (memoryNotifications) return memoryNotifications;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(NOTIFICATIONS_FILE)) {
      fs.writeFileSync(
        NOTIFICATIONS_FILE,
        JSON.stringify(INITIAL_NOTIFICATIONS, null, 2),
        'utf-8'
      );
      memoryNotifications = [...INITIAL_NOTIFICATIONS];
      return memoryNotifications;
    }

    const content = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      memoryNotifications = parsed;
      return parsed;
    }

    memoryNotifications = [...INITIAL_NOTIFICATIONS];
    return memoryNotifications;
  } catch (err) {
    console.error('Error loading notifications store from disk:', err);
    memoryNotifications = [...INITIAL_NOTIFICATIONS];
    return memoryNotifications;
  }
}

function persistNotifications(items: AppNotification[]): void {
  memoryNotifications = items;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving notifications to disk:', err);
  }
}

export async function getServerNotifications(): Promise<AppNotification[]> {
  return [...ensureNotificationsFile()];
}

export async function createServerNotification(
  input: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'> & {
    id?: string;
    timestamp?: string;
    isRead?: boolean;
    isPushDispatched?: boolean;
  }
): Promise<AppNotification> {
  const current = ensureNotificationsFile();
  const created: AppNotification = {
    id: input.id || 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    title: input.title.trim(),
    message: input.message.trim(),
    type: input.type || 'general',
    category: input.category || 'general',
    ipoSlug: input.ipoSlug,
    actionUrl: input.actionUrl || '/',
    isRead: Boolean(input.isRead),
    timestamp: input.timestamp || new Date().toISOString(),
  };

  const updated = [created, ...current];
  persistNotifications(updated);
  return created;
}

export async function updateServerNotification(
  id: string,
  updates: Partial<Omit<AppNotification, 'id'>>
): Promise<AppNotification | null> {
  const current = ensureNotificationsFile();
  const index = current.findIndex((n) => n.id === id);
  if (index === -1) return null;

  const existing = current[index];
  const updatedItem: AppNotification = {
    ...existing,
    ...updates,
    id: existing.id, // preserve id
  };

  current[index] = updatedItem;
  persistNotifications(current);
  return updatedItem;
}

export async function deleteServerNotification(id: string): Promise<boolean> {
  const current = ensureNotificationsFile();
  const initialLength = current.length;
  const filtered = current.filter((n) => n.id !== id);
  if (filtered.length !== initialLength) {
    persistNotifications(filtered);
    return true;
  }
  return false;
}

export async function clearAllServerNotifications(): Promise<void> {
  persistNotifications([]);
}

export async function resetServerNotifications(): Promise<AppNotification[]> {
  persistNotifications([...INITIAL_NOTIFICATIONS]);
  return [...INITIAL_NOTIFICATIONS];
}
