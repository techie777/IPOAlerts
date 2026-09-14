import { sendIpoAlert } from '@/lib/firebase/sendIpoAlert';
import { getNotificationStoreStats, getAllSubscribers } from '@/data/serverNotificationStore';
import { isFirebaseAdminConfigured } from '@/lib/firebase/adminApp';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = await getNotificationStoreStats();
  const configured = isFirebaseAdminConfigured();

  return Response.json({
    firebaseConfigured: configured,
    stats,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, url, category, topic, testTokenOnly } = body;

    if (!title || !message) {
      return Response.json(
        { error: 'Title and message are required for broadcast.' },
        { status: 400 }
      );
    }

    let targetTokens: string[] | undefined;
    if (testTokenOnly) {
      const subscribers = await getAllSubscribers();
      if (subscribers.length > 0) {
        targetTokens = [subscribers[0].token];
      }
    }

    const result = await sendIpoAlert({
      title: title.trim(),
      body: message.trim(),
      url: url || '/',
      category: category || undefined,
      topic: topic || 'broadcast',
      targetTokens,
    });

    return Response.json({
      success: result.success,
      details: result,
    });
  } catch (err) {
    console.error('Error in /api/admin/broadcast-alert:', err);
    return Response.json(
      { error: 'Failed to dispatch broadcast push alert.' },
      { status: 500 }
    );
  }
}
