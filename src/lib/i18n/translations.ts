export type Language = 'en' | 'hi';

export interface Translations {
  // Navigation
  allIpos: string;
  liveGmp: string;
  subscription: string;
  allotment: string;
  calendar: string;
  alerts: string;
  myProfile: string;
  alertSettings: string;
  installApp: string;
  installNow: string;
  noHeavyFiles: string;

  // Tabs
  activeIpo: string;
  allotmentListed: string;
  upcoming: string;
  all: string;
  mainboard: string;
  sme: string;
  filterByName: string;

  // Card details
  offerDate: string;
  issuePrice: string;
  gmpToday: string;
  profitLot: string;
  liveSubscription: string;
  retail: string;
  hni: string;
  qib: string;
  employee: string;
  total: string;
  viewDetails: string;
  apply: string;
  applyViaBroker: string;
  allotmentChances: string;
  perShare: string;
  oneApplication: string;
  hot: string;
  liveBidding: string;
  biddingClosed: string;
  openingSoon: string;
  allotmentStage: string;
  listed: string;

  // Calculator
  calculatorTitle: string;
  calculatorSubtitle: string;
  sebiLotteryRule: string;
  retailSubTimes: string;
  numApplications: string;
  capitalRequired: string;
  singleAppChance: string;
  combinedChance: string;
  oddsMatrix: string;
  confidenceLevel: string;
  matchRule: string;

  // Detail view & GMP Page
  backToAllIpos: string;
  getAlertsForIpo: string;
  alertsActive: string;
  biddingDates: string;
  allotmentDate: string;
  minInvestment: string;
  expectedListing: string;
  tabGmp: string;
  tabSubscription: string;
  tabMatrix: string;
  tabDetails: string;
  tabAllotment: string;
  overSubscribed: string;
  searchGmp: string;
  topGmpToday: string;
  estListingPrice: string;

  // Home Header
  homeTitle: string;
  homeSubtitle: string;
  marketPulse: string;
  openBidding: string;

  // Social & Community
  joinCommunity: string;
  communitySubtitle: string;
  joinWhatsapp: string;
  joinTelegram: string;
  followInstagram: string;
  followFacebook: string;

  // Footer & Disclaimer
  disclaimerText: string;
  goToTop: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    allIpos: 'All IPOs',
    liveGmp: 'Live GMP',
    subscription: 'Subscription',
    allotment: 'Allotment',
    calendar: 'Calendar',
    alerts: 'Alerts',
    myProfile: 'My Profile',
    alertSettings: 'Alert Settings',
    installApp: 'Install App',
    installNow: 'Install Now',
    noHeavyFiles: 'No heavy download • 1-tap add to screen',

    homeTitle: 'IPO Grey Market Premium (GMP) & Bidding',
    homeSubtitle: 'Real-time GMP rates, retail allotment chances, and day-wise bidding trends across NSE & BSE',
    marketPulse: 'NSE & BSE Live Market Pulse',
    openBidding: 'Open Bidding',

    activeIpo: 'Active IPO',
    allotmentListed: 'Allotment & listed',
    upcoming: 'Upcoming',
    all: 'All',
    mainboard: 'Mainboard',
    sme: 'SME',
    filterByName: 'Filter by name...',

    offerDate: 'Offer Date',
    issuePrice: 'Issue Price',
    gmpToday: 'GMP Today',
    profitLot: 'Profit / Lot',
    liveSubscription: 'Live Subscription',
    retail: 'Retail',
    hni: 'HNI / NII',
    qib: 'QIB',
    employee: 'Employee',
    total: 'Total',
    viewDetails: 'View Details & Bidding Status',
    apply: 'Apply',
    applyViaBroker: 'Apply via Broker',
    allotmentChances: 'Allotment Chances',
    perShare: 'per share',
    oneApplication: '1 application',
    hot: 'HOT',
    liveBidding: 'Live Bidding',
    biddingClosed: 'Bidding Closed',
    openingSoon: 'Opening Soon',
    allotmentStage: 'Allotment Out',
    listed: 'Listed',

    backToAllIpos: 'Back to All IPOs',
    getAlertsForIpo: 'Get Alerts for this IPO',
    alertsActive: 'Alerts Active',
    biddingDates: 'Bidding Dates',
    allotmentDate: 'Allotment Date',
    minInvestment: 'Min. Investment',
    expectedListing: 'Expected Listing',
    tabGmp: 'Live GMP & Calculator',
    tabSubscription: 'Subscription Details',
    tabMatrix: 'Allotment Chances Matrix',
    tabDetails: 'Company & Financials',
    tabAllotment: 'Allotment Status',
    overSubscribed: 'Over-Subscribed',
    searchGmp: 'Search IPO GMP...',
    topGmpToday: 'Top GMP Today',
    estListingPrice: 'Est. Listing Price',

    calculatorTitle: 'Retail Allotment Matrix Calculator',
    calculatorSubtitle: 'Determine how many distinct family PAN applications you need to secure at least 1 lot.',
    sebiLotteryRule: 'SEBI Lottery Rule',
    retailSubTimes: 'Retail Subscription (x Times)',
    numApplications: 'Applications (Different PANs)',
    capitalRequired: 'Capital Required',
    singleAppChance: '1 Application Chance',
    combinedChance: 'Combined Allotment Chance',
    oddsMatrix: 'Allotment Odds Probability Matrix',
    confidenceLevel: 'Confidence Level',
    matchRule: 'Match Rule',

    joinCommunity: 'Join Our Community for Live Insights',
    communitySubtitle: 'Get instantaneous IPO grey market updates, subscription analysis, and allotment notifications across your favorite platforms.',
    joinWhatsapp: 'Join WhatsApp Channel',
    joinTelegram: 'Join Telegram Channel',
    followInstagram: 'Follow on Instagram',
    followFacebook: 'Follow Facebook Page',

    disclaimerText: 'We are NOT a SEBI Registered Advisory. Grey Market Premium (GMP) numbers are unofficial street indications published for educational/informational purposes only.',
    goToTop: 'Back to Top',
  },
  hi: {
    allIpos: 'सभी आईपीओ',
    liveGmp: 'लाइव GMP',
    subscription: 'सब्सक्रिप्शन',
    allotment: 'अलॉटमेंट',
    calendar: 'कैलेंडर',
    alerts: 'अलर्ट्स',
    myProfile: 'मेरी प्रोफाइल',
    alertSettings: 'अलर्ट सेटिंग्स',
    installApp: 'ऐप इंस्टॉल करें',
    installNow: 'अभी इंस्टॉल करें',
    noHeavyFiles: 'बिना भारी डाउनलोड • 1-टैप में स्क्रीन पर जोड़ें',

    homeTitle: 'आईपीओ ग्रे मार्केट प्रीमियम (GMP) और लाइव बोली',
    homeSubtitle: 'एनएसई और बीएसई पर रियल-टाइम जीएमपी दरें, खुदरा आवंटन संभावना और दिन-वार बोली के आंकड़े',
    marketPulse: 'NSE और BSE लाइव मार्केट पल्स',
    openBidding: 'बोली चालू',

    activeIpo: 'चालू आईपीओ (Active)',
    allotmentListed: 'आवंटन और लिस्टेड',
    upcoming: 'आगामी आईपीओ',
    all: 'सभी आईपीओ',
    mainboard: 'मेनबोर्ड',
    sme: 'एसएमई (SME)',
    filterByName: 'नाम से खोजें...',

    offerDate: 'ऑफर तिथि',
    issuePrice: 'इश्यू प्राइस',
    gmpToday: 'आज का GMP',
    profitLot: 'प्रति लॉट मुनाफा',
    liveSubscription: 'लाइव सब्सक्रिप्शन',
    retail: 'रिटेल (खुदरा)',
    hni: 'एचएनआई / NII',
    qib: 'क्यूआईबी (QIB)',
    employee: 'कर्मचारी कोटा',
    total: 'कुल',
    viewDetails: 'विवरण और बोली स्थिति देखें',
    apply: 'अप्लाई करें',
    applyViaBroker: 'ब्रोकर से अप्लाई करें',
    allotmentChances: 'आवंटन संभावना',
    perShare: 'प्रति शेयर',
    oneApplication: '1 आवेदन',
    hot: 'हॉट',
    liveBidding: 'लाइव बोली जारी',
    biddingClosed: 'बोली समाप्त',
    openingSoon: 'जल्द खुलेगा',
    allotmentStage: 'आवंटन जारी',
    listed: 'लिस्टेड',

    backToAllIpos: 'सभी आईपीओ पर वापस जाएं',
    getAlertsForIpo: 'इस IPO के लिए अलर्ट पाएं',
    alertsActive: 'अलर्ट सक्रिय',
    biddingDates: 'बोली तिथियां',
    allotmentDate: 'आवंटन तिथि',
    minInvestment: 'न्यूनतम निवेश',
    expectedListing: 'संभावित लिस्टिंग',
    tabGmp: 'लाइव जीएमपी और कैलकुलेटर',
    tabSubscription: 'सब्सक्रिप्शन विवरण',
    tabMatrix: 'आवंटन संभावना मैट्रिक्स',
    tabDetails: 'कंपनी और वित्तीय विवरण',
    tabAllotment: 'आवंटन स्थिति',
    overSubscribed: 'ओवर-सब्सक्राइब',
    searchGmp: 'आईपीओ जीएमपी खोजें...',
    topGmpToday: 'आज का उच्चतम जीएमपी',
    estListingPrice: 'अनुमानित लिस्टिंग मूल्य',

    calculatorTitle: 'रिटेल आवंटन संभावना कैलकुलेटर (Matrix)',
    calculatorSubtitle: 'जानिए कम से कम 1 लॉट पाने के लिए आपको परिवार के कितने अलग-अलग पैन (PAN) से आवेदन करना चाहिए।',
    sebiLotteryRule: 'सेबी लॉटरी नियम',
    retailSubTimes: 'रिटेल सब्सक्रिप्शन (कितने गुना)',
    numApplications: 'कुल आवेदन (अलग-अलग पैन)',
    capitalRequired: 'आवश्यक कुल पूंजी',
    singleAppChance: '1 आवेदन पर चयन संभावना',
    combinedChance: 'संयुक्त आवंटन संभावना',
    oddsMatrix: 'आवंटन संभावना मैट्रिक्स तालिका',
    confidenceLevel: 'सफलता का स्तर',
    matchRule: 'अनुशंसित नियम',

    joinCommunity: 'ताज़ा अपडेट और इनसाइट्स के लिए हमारे सोशल मीडिया से जुड़ें',
    communitySubtitle: 'लाइव जीएमपी (GMP) दरें, बोली के आंकड़े और आवंटन परिणाम सीधे अपने पसंदीदा प्लेटफॉर्म पर पाएं।',
    joinWhatsapp: 'व्हाट्सएप चैनल से जुड़ें',
    joinTelegram: 'टेलीग्राम चैनल से जुड़ें',
    followInstagram: 'इंस्टाग्राम पर फॉलो करें',
    followFacebook: 'फेसबुक पेज फॉलो करें',

    disclaimerText: 'हम सेबी (SEBI) पंजीकृत सलाहकार नहीं हैं। ग्रे मार्केट प्रीमियम (GMP) केवल शैक्षिक और सूचनात्मक उद्देश्यों के लिए प्रकाशित अनौपचारिक दरें हैं।',
    goToTop: 'ऊपर जाएं',
  },
};
