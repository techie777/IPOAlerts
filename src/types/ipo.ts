export type IpoStatus = 'upcoming' | 'open' | 'closed' | 'listed';
export type IpoCategory = 'mainboard' | 'sme';
export type ExchangeType = 'NSE' | 'BSE' | 'NSE & BSE';

export interface GmpRecord {
  id: string;
  date: string;
  gmpValue: number; // in ₹
  estimatedListingGainPct: number; // in %
  kostakRate?: number; // in ₹
  saudaRate?: number; // in ₹
  updatedAt?: string;
}

export interface SubscriptionRecord {
  day: number;
  date: string;
  qibMultiplier: number;
  niiMultiplier: number;
  bNiiMultiplier?: number; // Big HNI (>10 Lakhs)
  sNiiMultiplier?: number; // Small HNI (2-10 Lakhs)
  retailMultiplier: number;
  employeeMultiplier?: number;
  totalMultiplier: number;
  updatedAt?: string;
}

export interface IpoFinancials {
  fiscalYear: string;
  revenueCr: number;
  patCr: number;
  netWorthCr: number;
  eps: number;
  pe: number;
  ronwPct: number;
}

export interface IpoEditorialReview {
  verdict: 'Apply for Listing Gains' | 'Apply for Long Term' | 'May Apply' | 'Neutral' | 'Avoid';
  rating: number; // out of 5
  analyst: string;
  summary: string;
  strengths: string[];
  risks: string[];
}

export interface IPO {
  id: string;
  slug: string;
  name: string;
  symbol: string;
  category: IpoCategory;
  exchange: ExchangeType;
  status: IpoStatus;
  logoUrl?: string;
  sector: string;
  description: string;
  
  // Important Timelines (ISO strings YYYY-MM-DD)
  openDate: string;
  closeDate: string;
  allotmentDate: string;
  refundDate: string;
  creditDate: string;
  listingDate: string;

  // Pricing & Structure
  priceBandMin: number;
  priceBandMax: number;
  lotSize: number;
  faceValue: number;
  issueSizeCr: number;
  freshIssueCr: number;
  ofsCr: number;
  retailQuotaPct: number;
  qibQuotaPct: number;
  niiQuotaPct: number;

  // Intermediaries
  registrarName: string;
  registrarUrl: string;
  leadManagers: string[];

  // Live Metrics (Computed / Latest)
  currentGmp: number;
  currentListingGainPct: number;
  currentSubscription: number;
  
  // Outcome (if closed or listed)
  listingPrice?: number;
  listingGainPct?: number;

  // Detailed records
  gmpHistory: GmpRecord[];
  subscriptionHistory: SubscriptionRecord[];
  financials: IpoFinancials[];
  review: IpoEditorialReview;

  // Flags
  hot?: boolean;
  featured?: boolean;
}

export interface NotificationPreferences {
  webPushEnabled: boolean;
  telegramEnabled: boolean;
  emailEnabled: boolean;
  mainboardAlerts: boolean;
  smeAlerts: boolean;
  gmpSurgeAlerts: boolean; // Alert when GMP changes >15%
  allotmentOutAlerts: boolean;
  closingDayAlerts: boolean;
  emailAddress?: string;
  telegramHandle?: string;
  watchedIpoSlugs: string[];

  // Granular Alert Options
  newIpoAlerts?: boolean;
  subscriptionAlerts?: boolean;
  retailSubAlerts?: boolean;
  niiSubAlerts?: boolean;
  qibSubAlerts?: boolean;
  employeeSubAlerts?: boolean;
  gmpAlerts?: boolean;
  gmpPctAlerts?: boolean;
  gmpChangeAlerts?: boolean;
  allotmentProbabilityAlerts?: boolean;
  listingPriceAlerts?: boolean;
  listingGainLossAlerts?: boolean;
}
