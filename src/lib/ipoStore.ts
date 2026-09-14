import { IPO, GmpRecord, SubscriptionRecord } from '@/types/ipo';
import { INITIAL_IPOS } from '@/data/mockIpos';

const STORAGE_KEY = 'ipo_alerts_data_v1';

export function getStoredIpos(): IPO[] {
  if (typeof window === 'undefined') {
    return INITIAL_IPOS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_IPOS));
      return INITIAL_IPOS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_IPOS;
  } catch {
    return INITIAL_IPOS;
  }
}

export function saveStoredIpos(ipos: IPO[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ipos));
      window.dispatchEvent(new Event('ipoDataUpdated'));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }
}

export function getIpoBySlug(slug: string): IPO | undefined {
  const ipos = getStoredIpos();
  return ipos.find((ipo) => ipo.slug === slug);
}

export function updateIpoGmp(
  id: string,
  newGmp: number,
  kostakRate?: number,
  saudaRate?: number
): IPO | null {
  const ipos = getStoredIpos();
  const index = ipos.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const target = ipos[index];
  const maxPrice = target.priceBandMax || 1;
  const gainPct = Number(((newGmp / maxPrice) * 100).toFixed(2));
  const today = new Date().toISOString().split('T')[0];

  const newRecord: GmpRecord = {
    id: 'gmp-' + Date.now(),
    date: today,
    gmpValue: newGmp,
    estimatedListingGainPct: gainPct,
    kostakRate: kostakRate || target.gmpHistory[0]?.kostakRate,
    saudaRate: saudaRate || target.gmpHistory[0]?.saudaRate,
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const updatedGmpHistory = [newRecord, ...target.gmpHistory.filter((g) => g.date !== today)];

  const updatedIpo: IPO = {
    ...target,
    currentGmp: newGmp,
    currentListingGainPct: gainPct,
    gmpHistory: updatedGmpHistory,
  };

  ipos[index] = updatedIpo;
  saveStoredIpos(ipos);
  return updatedIpo;
}

export function updateIpoSubscription(
  id: string,
  record: Omit<SubscriptionRecord, 'updatedAt'>
): IPO | null {
  const ipos = getStoredIpos();
  const index = ipos.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const target = ipos[index];
  const newSubRecord: SubscriptionRecord = {
    ...record,
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const updatedSubHistory = [
    newSubRecord,
    ...target.subscriptionHistory.filter((s) => s.day !== record.day),
  ].sort((a, b) => a.day - b.day);

  const updatedIpo: IPO = {
    ...target,
    currentSubscription: record.totalMultiplier,
    subscriptionHistory: updatedSubHistory,
  };

  ipos[index] = updatedIpo;
  saveStoredIpos(ipos);
  return updatedIpo;
}

export function saveOrUpdateIpo(ipoData: IPO): IPO[] {
  const ipos = getStoredIpos();
  const index = ipos.findIndex((i) => i.id === ipoData.id || i.slug === ipoData.slug);

  if (index >= 0) {
    ipos[index] = ipoData;
  } else {
    ipos.unshift(ipoData);
  }
  saveStoredIpos(ipos);
  return ipos;
}

export function deleteIpo(id: string): IPO[] {
  const ipos = getStoredIpos();
  const filtered = ipos.filter((i) => i.id !== id);
  saveStoredIpos(filtered);
  return filtered;
}

export function updateIpoStatus(id: string, newStatus: IPO['status']): IPO | null {
  const ipos = getStoredIpos();
  const index = ipos.findIndex((i) => i.id === id);
  if (index === -1) return null;

  ipos[index] = {
    ...ipos[index],
    status: newStatus,
  };
  saveStoredIpos(ipos);
  return ipos[index];
}

export function resetIpoData(): IPO[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('ipoDataUpdated'));
  }
  return INITIAL_IPOS;
}

// Formatters
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCrores(amountCr: number): string {
  if (amountCr >= 1000) {
    return `₹${(amountCr / 1000).toFixed(2)}k Cr`;
  }
  return `₹${amountCr.toLocaleString('en-IN')} Cr`;
}

export function getStatusBadgeInfo(status: IPO['status']) {
  switch (status) {
    case 'open':
      return { label: 'Live Bidding', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' };
    case 'upcoming':
      return { label: 'Upcoming', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    case 'closed':
      return { label: 'Allotment Out / Closed', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' };
    case 'listed':
      return { label: 'Listed', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  }
}
