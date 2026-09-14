import fs from 'fs';
import path from 'path';
import { AppNotification } from '@/types/user';
import { INITIAL_NOTIFICATIONS } from './mockNotifications';
import { getAdminFirestore } from '@/lib/firebase/adminApp';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

let memoryNotifications: AppNotification[] | null = null;
let firestoreAvailable: boolean | null = null; // null = untried

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
    memoryNotifications = memoryNotifications || [...INITIAL_NOTIFICATIONS];
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
    // In serverless, filesystem may be read-only, which is expected
  }
}

export async function getServerNotifications(): Promise<AppNotification[]> {
  // 1. Try Firebase Firestore if configured
  if (firestoreAvailable !== false) {
    try {
      const db = getAdminFirestore();
      if (db) {
        const snapshot = await db
          .collection('notifications')
          .orderBy('timestamp', 'desc')
          .limit(50)
          .get();

        if (!snapshot.empty) {
          const items: AppNotification[] = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...(doc.data() as Omit<AppNotification, 'id'>),
          }));
          firestoreAvailable = true;
          persistNotifications(items);
          return items;
        } else {
          // If Firestore collection is empty, seed initial notifications
          firestoreAvailable = true;
          const initial = ensureNotificationsFile();
          const batch = db.batch();
          initial.forEach((item) => {
            const ref = db.collection('notifications').doc(item.id);
            batch.set(ref, item);
          });
          batch.commit().catch(() => {});
          return initial;
        }
      }
    } catch (err) {
      // Cloud Firestore API might not be enabled in console yet
      firestoreAvailable = false;
    }
  }

  // 2. Fallback to memory / local file
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

  try {
    const db = getAdminFirestore();
    if (db) {
      await db.collection('notifications').doc(created.id).set(created);
    }
  } catch {}

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

  try {
    const db = getAdminFirestore();
    if (db) {
      await db.collection('notifications').doc(id).update(updates);
    }
  } catch {}

  return updatedItem;
}

export async function deleteServerNotification(id: string): Promise<boolean> {
  const current = ensureNotificationsFile();
  const initialLength = current.length;
  const filtered = current.filter((n) => n.id !== id);
  if (filtered.length !== initialLength) {
    persistNotifications(filtered);
    try {
      const db = getAdminFirestore();
      if (db) {
        await db.collection('notifications').doc(id).delete();
      }
    } catch {}
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
