import { IPO } from '@/types/ipo';
import { AppNotification } from '@/types/user';

export interface NotificationTemplate {
  id: string;
  name: string;
  shortDesc: string;
  icon: string;
  type: AppNotification['type'];
  category: 'mainboard' | 'sme' | 'general';
  titleTemplate: string;
  bodyTemplate: string;
  defaultActionUrl: string;
  tags: string[];
}

export const PREDEFINED_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl-bidding-open',
    name: 'Bidding Open (Day 1)',
    shortDesc: 'Announce that an IPO is officially open for subscription bidding',
    icon: '🔔',
    type: 'newIpo',
    category: 'mainboard',
    titleTemplate: '🔔 Live Bidding Open: {ipoName}',
    bodyTemplate:
      '{ipoName} IPO is now officially open for subscription! Price band ₹{minPrice}–₹{maxPrice}, lot size {lotSize} shares. Bidding window closes on {closeDate}.',
    defaultActionUrl: '/ipo/{slug}',
    tags: ['Bidding', 'New IPO', 'Opening Day'],
  },
  {
    id: 'tpl-gmp-surge',
    name: 'GMP Surge Alert',
    shortDesc: 'Alert subscribers when Grey Market Premium records a significant spike',
    icon: '🚀',
    type: 'gmpSurge',
    category: 'mainboard',
    titleTemplate: '🚀 GMP Surge: {ipoName} (+{gmpPct}%)',
    bodyTemplate:
      'Grey Market Premium for {ipoName} jumped to +₹{gmp} (+{gmpPct}% expected listing gain). Estimated listing price: ₹{estListingPrice}.',
    defaultActionUrl: '/gmp',
    tags: ['GMP', 'Surge', 'Listing Pop'],
  },
  {
    id: 'tpl-allotment-out',
    name: 'Allotment Status Out',
    shortDesc: 'Notify users that allotment has been declared by the registrar',
    icon: '🎉',
    type: 'allotment',
    category: 'mainboard',
    titleTemplate: '🎉 Allotment Out: {ipoName}',
    bodyTemplate:
      '{ipoName} allotment status has been finalized by registrar ({registrar}). Check your application status now using your PAN number.',
    defaultActionUrl: '/allotment',
    tags: ['Allotment', 'Registrar', 'Status'],
  },
  {
    id: 'tpl-closing-reminder',
    name: 'Closing Day Reminder',
    shortDesc: 'Urgent notice for the final hours before the 5:00 PM bidding cutoff',
    icon: '⏰',
    type: 'closing',
    category: 'mainboard',
    titleTemplate: '⏰ Closing Today: {ipoName} (5:00 PM)',
    bodyTemplate:
      'Final hours to apply for {ipoName}! Bidding closes today at 5:00 PM sharp. Current subscription: {totalSub}x, GMP: +₹{gmp}.',
    defaultActionUrl: '/ipo/{slug}',
    tags: ['Closing', 'Deadline', 'Last Day'],
  },
  {
    id: 'tpl-high-subscription',
    name: 'Subscription Spike (Day 2/3)',
    shortDesc: 'Highlight exceptional demand across Retail, NII, and QIB books',
    icon: '🔥',
    type: 'subscription',
    category: 'mainboard',
    titleTemplate: '🔥 Heavy Demand: {ipoName} Subscribed {totalSub}x',
    bodyTemplate:
      '{ipoName} saw heavy bidding action with overall subscription crossing {totalSub}x! Retail subscribed {retailSub}x, NII book {niiSub}x.',
    defaultActionUrl: '/subscription',
    tags: ['Subscription', 'Demand', 'Institutional'],
  },
  {
    id: 'tpl-price-band',
    name: 'Price Band & Dates Announced',
    shortDesc: 'Inform users about newly announced dates and pricing parameters',
    icon: '🏷️',
    type: 'newIpo',
    category: 'mainboard',
    titleTemplate: '🏷️ Price Band Announced: {ipoName}',
    bodyTemplate:
      '{ipoName} has announced its IPO price band at ₹{minPrice}–₹{maxPrice} per share (Issue Size: ₹{issueSize} Cr). Opens {openDate}.',
    defaultActionUrl: '/ipo/{slug}',
    tags: ['Dates', 'Price Band', 'Upcoming'],
  },
  {
    id: 'tpl-listing-day',
    name: 'Listing Day Debut Alert',
    shortDesc: 'Alert on market debut morning with listing discovery details',
    icon: '📈',
    type: 'general',
    category: 'mainboard',
    titleTemplate: '📈 Listing Alert: {ipoName} Debuts Today',
    bodyTemplate:
      '{ipoName} shares debut on {exchange} today at 10:00 AM. Pre-open discovery from 9:00 AM to 9:45 AM. Issue price: ₹{maxPrice}.',
    defaultActionUrl: '/ipo/{slug}',
    tags: ['Listing', 'Stock Exchange', 'Debut'],
  },
  {
    id: 'tpl-breaking-flash',
    name: 'Breaking Flash Broadcast',
    shortDesc: 'General or custom high-priority market alert',
    icon: '📢',
    type: 'general',
    category: 'general',
    titleTemplate: '📢 Market Alert: {headline}',
    bodyTemplate:
      '{customMessage} Stay updated with real-time grey market premium and subscription movements on IPO Alerts.',
    defaultActionUrl: '/',
    tags: ['Broadcast', 'Announcement', 'Custom'],
  },
];

/**
 * Replaces placeholders in template string with live IPO data.
 */
export function interpolateTemplate(
  template: NotificationTemplate,
  ipo?: IPO | null,
  customVars?: Record<string, string>
): {
  title: string;
  body: string;
  actionUrl: string;
  category: 'mainboard' | 'sme' | 'general';
  type: AppNotification['type'];
} {
  const ipoName = ipo?.name || 'Company Name';
  const slug = ipo?.slug || 'ipo-details';
  const minPrice = ipo?.priceBandMin?.toString() || '100';
  const maxPrice = ipo?.priceBandMax?.toString() || '120';
  const lotSize = ipo?.lotSize?.toString() || '100';
  const gmp = ipo?.currentGmp?.toString() || '45';
  const gmpPct = (ipo?.currentListingGainPct || 0).toFixed(2);
  const estListingPrice = ((ipo?.priceBandMax || 100) + (ipo?.currentGmp || 0)).toString();
  const issueSize = ipo?.issueSizeCr?.toLocaleString('en-IN') || '500';
  const registrar = ipo?.registrarName || 'Registrar';
  const exchange = ipo?.exchange || 'NSE & BSE';
  const openDate = ipo?.openDate || 'Soon';
  const closeDate = ipo?.closeDate || 'Closing Date';
  const totalSub = (ipo?.currentSubscription || 1.5).toFixed(1);

  // Latest subscription breakdown if available
  const latestSub = ipo?.subscriptionHistory?.[ipo.subscriptionHistory.length - 1];
  const retailSub = (latestSub?.retailMultiplier || ipo?.currentSubscription || 1.2).toFixed(1);
  const niiSub = (latestSub?.niiMultiplier || 1.8).toFixed(1);
  const qibSub = (latestSub?.qibMultiplier || 2.4).toFixed(1);

  const variables: Record<string, string> = {
    ipoName,
    slug,
    minPrice,
    maxPrice,
    lotSize,
    gmp,
    gmpPct,
    estListingPrice,
    issueSize,
    registrar,
    exchange,
    openDate,
    closeDate,
    totalSub,
    retailSub,
    niiSub,
    qibSub,
    headline: customVars?.headline || 'Key Market Update',
    customMessage:
      customVars?.customMessage ||
      'Important IPO development observed. Check full breakdown and live stats.',
    ...customVars,
  };

  let title = template.titleTemplate;
  let body = template.bodyTemplate;
  let actionUrl = template.defaultActionUrl;

  Object.entries(variables).forEach(([key, val]) => {
    const reg = new RegExp(`\\{${key}\\}`, 'g');
    title = title.replace(reg, val);
    body = body.replace(reg, val);
    actionUrl = actionUrl.replace(reg, val);
  });

  const category = (ipo?.category as 'mainboard' | 'sme') || template.category;

  return {
    title,
    body,
    actionUrl,
    category,
    type: template.type,
  };
}
