import fs from 'fs';
import path from 'path';

export interface SubscriberPreferences {
  mainboardAlerts?: boolean;
  smeAlerts?: boolean;
  gmpSurgeAlerts?: boolean;
  allotmentOutAlerts?: boolean;
  closingDayAlerts?: boolean;
  newIpoAlerts?: boolean;
  subscriptionAlerts?: boolean;
  retailSubAlerts?: boolean;
  niiSubAlerts?: boolean;
  qibSubAlerts?: boolean;
  listingPriceAlerts?: boolean;
  [key: string]: unknown;
}

export interface SubscriberRecord {
  token: string;
  createdAt: string;
  updatedAt: string;
  topics?: string[];
  preferences?: SubscriberPreferences;
  userAgent?: string;
  isDemo?: boolean;
}

export interface SentAlertRecord {
  eventKey: string;
  sentAt: string;
  ipoId?: string;
  eventType?: string;
  title?: string;
}

interface DatabaseSchema {
  subscribers: SubscriberRecord[];
  sentAlerts: Record<string, SentAlertRecord>;
  lastCronCheckAt?: string;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DB_FILE = path.join(DATA_DIR, 'subscribers.json');

// In-memory fallback if disk operations are temporarily locked
let memoryDb: DatabaseSchema | null = null;

function ensureDbFile(): DatabaseSchema {
  if (memoryDb) return memoryDb;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseSchema = {
        subscribers: [],
        sentAlerts: {},
        lastCronCheckAt: undefined,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      memoryDb = initial;
      return initial;
    }

    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed: DatabaseSchema = JSON.parse(content);
    if (!parsed.subscribers) parsed.subscribers = [];
    if (!parsed.sentAlerts) parsed.sentAlerts = {};
    memoryDb = parsed;
    return parsed;
  } catch (err) {
    console.error('Error reading subscribers database file:', err);
    memoryDb = { subscribers: [], sentAlerts: {} };
    return memoryDb;
  }
}

function writeDbFile(data: DatabaseSchema): void {
  memoryDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting subscribers database file:', err);
  }
}

/**
 * Saves a subscriber token avoiding duplicates. Updates preferences if token already exists.
 */
export async function saveSubscriber(
  token: string,
  extra?: {
    preferences?: SubscriberPreferences;
    topics?: string[];
    userAgent?: string;
    isDemo?: boolean;
  }
): Promise<{ created: boolean; subscriber: SubscriberRecord }> {
  const db = ensureDbFile();
  const now = new Date().toISOString();
  const existingIdx = db.subscribers.findIndex((s) => s.token === token);

  if (existingIdx >= 0) {
    const existing = db.subscribers[existingIdx];
    const updated: SubscriberRecord = {
      ...existing,
      updatedAt: now,
      preferences: {
        ...(existing.preferences || {}),
        ...(extra?.preferences || {}),
      },
      topics: extra?.topics || existing.topics || [],
      userAgent: extra?.userAgent || existing.userAgent,
      isDemo: extra?.isDemo ?? existing.isDemo,
    };
    db.subscribers[existingIdx] = updated;
    writeDbFile(db);
    return { created: false, subscriber: updated };
  }

  const newSubscriber: SubscriberRecord = {
    token,
    createdAt: now,
    updatedAt: now,
    preferences: extra?.preferences || {
      mainboardAlerts: true,
      smeAlerts: true,
      gmpSurgeAlerts: true,
      allotmentOutAlerts: true,
      closingDayAlerts: true,
      newIpoAlerts: true,
    },
    topics: extra?.topics || ['all'],
    userAgent: extra?.userAgent,
    isDemo: extra?.isDemo || false,
  };

  db.subscribers.push(newSubscriber);
  writeDbFile(db);
  return { created: true, subscriber: newSubscriber };
}

/**
 * Removes a subscriber by token (unsubscribes).
 */
export async function removeSubscriber(token: string): Promise<boolean> {
  const db = ensureDbFile();
  const initialCount = db.subscribers.length;
  db.subscribers = db.subscribers.filter((s) => s.token !== token);
  if (db.subscribers.length !== initialCount) {
    writeDbFile(db);
    return true;
  }
  return false;
}

/**
 * Removes multiple subscriber tokens (e.g. expired or invalid tokens returned by FCM).
 */
export async function removeSubscribers(tokens: string[]): Promise<number> {
  if (!tokens || tokens.length === 0) return 0;
  const db = ensureDbFile();
  const tokenSet = new Set(tokens);
  const initialCount = db.subscribers.length;
  db.subscribers = db.subscribers.filter((s) => !tokenSet.has(s.token));
  const removed = initialCount - db.subscribers.length;
  if (removed > 0) {
    writeDbFile(db);
  }
  return removed;
}

/**
 * Returns all active subscribers.
 */
export async function getAllSubscribers(): Promise<SubscriberRecord[]> {
  const db = ensureDbFile();
  return [...db.subscribers];
}

/**
 * Checks if an event has already been notified so it is never sent twice.
 */
export async function hasAlertBeenSent(eventKey: string): Promise<boolean> {
  const db = ensureDbFile();
  return Boolean(db.sentAlerts && db.sentAlerts[eventKey]);
}

/**
 * Records that an alert has been successfully sent.
 */
export async function recordAlertSent(
  eventKey: string,
  details?: { ipoId?: string; eventType?: string; title?: string }
): Promise<void> {
  const db = ensureDbFile();
  db.sentAlerts[eventKey] = {
    eventKey,
    sentAt: new Date().toISOString(),
    ipoId: details?.ipoId,
    eventType: details?.eventType,
    title: details?.title,
  };
  writeDbFile(db);
}

/**
 * Updates the last recorded cron check timestamp.
 */
export async function updateLastCronCheck(timestamp: string): Promise<void> {
  const db = ensureDbFile();
  db.lastCronCheckAt = timestamp;
  writeDbFile(db);
}

/**
 * Returns summary statistics for admin dashboards.
 */
export async function getNotificationStoreStats(): Promise<{
  totalSubscribers: number;
  liveSubscribers: number;
  demoSubscribers: number;
  totalAlertsSent: number;
  lastCronCheckAt?: string;
}> {
  const db = ensureDbFile();
  const total = db.subscribers.length;
  const demo = db.subscribers.filter((s) => s.isDemo).length;
  return {
    totalSubscribers: total,
    liveSubscribers: total - demo,
    demoSubscribers: demo,
    totalAlertsSent: Object.keys(db.sentAlerts).length,
    lastCronCheckAt: db.lastCronCheckAt,
  };
}
