import { INITIAL_IPOS } from '@/data/mockIpos';
import {
  hasAlertBeenSent,
  recordAlertSent,
  updateLastCronCheck,
  getNotificationStoreStats,
} from '@/data/serverNotificationStore';
import { sendIpoAlert, IpoAlertPayload } from '@/lib/firebase/sendIpoAlert';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handleCronCheck(request);
}

export async function POST(request: Request) {
  return handleCronCheck(request);
}

async function handleCronCheck(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Verify CRON_SECRET if configured in environment
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    const queryKey = searchParams.get('key');
    if (queryKey !== cronSecret) {
      return Response.json(
        { error: 'Unauthorized. Invalid or missing cron authentication token.' },
        { status: 401 }
      );
    }
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0]!;
  const force = searchParams.get('force') === 'true';

  const dispatchedAlerts: Array<{
    eventKey: string;
    ipoName: string;
    topic: string;
    result: unknown;
  }> = [];

  let skippedDuplicates = 0;
  const ipos = INITIAL_IPOS;

  for (const ipo of ipos) {
    const candidateAlerts: Array<{
      eventKey: string;
      payload: IpoAlertPayload;
    }> = [];

    // 1. Newly Opened IPO Alert
    if (ipo.status === 'open') {
      candidateAlerts.push({
        eventKey: `${ipo.id}:open:${ipo.openDate}`,
        payload: {
          title: `🔔 New IPO Open: ${ipo.name}`,
          body: `${ipo.name} is now open for bidding! Price band ₹${ipo.priceBandMin}–₹${ipo.priceBandMax}, closes ${ipo.closeDate}.`,
          url: `/ipo/${ipo.slug}`,
          category: ipo.category,
          topic: 'newIpo',
          tag: `ipo-open-${ipo.id}`,
          customData: {
            ipoId: ipo.id,
            slug: ipo.slug,
            symbol: ipo.symbol,
            type: 'open',
          },
        },
      });
    }

    // 2. Closing Day Alert (Closes today)
    if (ipo.status === 'open' && ipo.closeDate === todayStr) {
      candidateAlerts.push({
        eventKey: `${ipo.id}:closing_today:${todayStr}`,
        payload: {
          title: `⏰ Closing Today: ${ipo.name}`,
          body: `Final hours to bid for ${ipo.name}! Bidding closes at 5:00 PM today. Current GMP +₹${ipo.currentGmp} (+${ipo.currentListingGainPct}%).`,
          url: `/ipo/${ipo.slug}`,
          category: ipo.category,
          topic: 'closingReminder',
          tag: `ipo-closing-${ipo.id}`,
          customData: {
            ipoId: ipo.id,
            slug: ipo.slug,
            symbol: ipo.symbol,
            type: 'closing_reminder',
          },
        },
      });
    }

    // 3. Price Band Announced Alert (for upcoming IPOs with known price bands)
    if (ipo.status === 'upcoming' && ipo.priceBandMin > 0 && ipo.priceBandMax > 0) {
      candidateAlerts.push({
        eventKey: `${ipo.id}:price_band:${ipo.priceBandMin}-${ipo.priceBandMax}`,
        payload: {
          title: `🏷️ Price Band Announced: ${ipo.name}`,
          body: `${ipo.name} fixed price band at ₹${ipo.priceBandMin}–₹${ipo.priceBandMax} per share. Issue size ₹${ipo.issueSizeCr} Cr.`,
          url: `/ipo/${ipo.slug}`,
          category: ipo.category,
          topic: 'priceBand',
          tag: `ipo-priceband-${ipo.id}`,
          customData: {
            ipoId: ipo.id,
            slug: ipo.slug,
            symbol: ipo.symbol,
            type: 'price_band',
          },
        },
      });
    }

    // 4. Allotment Declared Alert
    if (ipo.status === 'closed' || ipo.status === 'listed') {
      candidateAlerts.push({
        eventKey: `${ipo.id}:allotment:${ipo.allotmentDate}`,
        payload: {
          title: `🎉 Allotment Out: ${ipo.name}`,
          body: `${ipo.name} IPO allotment status published! Registrar: ${ipo.registrarName}. Check your application result.`,
          url: `/allotment`,
          category: ipo.category,
          topic: 'allotment',
          tag: `ipo-allotment-${ipo.id}`,
          customData: {
            ipoId: ipo.id,
            slug: ipo.slug,
            symbol: ipo.symbol,
            type: 'allotment',
          },
        },
      });
    }

    // 5. Significant GMP Surge Alert (GMP > 40% gain)
    if (ipo.currentListingGainPct >= 40) {
      const gmpTier = Math.floor(ipo.currentListingGainPct / 25) * 25;
      candidateAlerts.push({
        eventKey: `${ipo.id}:gmp_surge:${gmpTier}pct`,
        payload: {
          title: `🚀 GMP Surge: ${ipo.name} (+${ipo.currentListingGainPct}%)`,
          body: `Live GMP reaches +₹${ipo.currentGmp} (+${ipo.currentListingGainPct}% premium). High grey market interest!`,
          url: `/gmp`,
          category: ipo.category,
          topic: 'gmpSurge',
          tag: `ipo-gmp-${ipo.id}`,
          customData: {
            ipoId: ipo.id,
            slug: ipo.slug,
            symbol: ipo.symbol,
            type: 'gmp_surge',
          },
        },
      });
    }

    // Process candidate alerts for this IPO
    for (const candidate of candidateAlerts) {
      const alreadySent = await hasAlertBeenSent(candidate.eventKey);

      if (alreadySent && !force) {
        skippedDuplicates++;
        continue;
      }

      // Genuine change: dispatch push alert
      const sendResult = await sendIpoAlert(candidate.payload);

      // Record sent event state in database so it is never repeated
      await recordAlertSent(candidate.eventKey, {
        ipoId: ipo.id,
        eventType: candidate.payload.topic,
        title: candidate.payload.title,
      });

      dispatchedAlerts.push({
        eventKey: candidate.eventKey,
        ipoName: ipo.name,
        topic: candidate.payload.topic || 'general',
        result: sendResult,
      });
    }
  }

  await updateLastCronCheck(now.toISOString());
  const storeStats = await getNotificationStoreStats();

  return Response.json({
    success: true,
    timestamp: now.toISOString(),
    summary: {
      totalIposChecked: ipos.length,
      alertsDispatched: dispatchedAlerts.length,
      skippedDuplicates,
      totalSubscribers: storeStats.totalSubscribers,
    },
    dispatchedAlerts,
  });
}
