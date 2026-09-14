import { sendIpoAlert } from '@/lib/firebase/sendIpoAlert';
import { getNotificationStoreStats, getAllSubscribers } from '@/data/serverNotificationStore';
import { isFirebaseAdminConfigured } from '@/lib/firebase/adminApp';
import { createServerNotification } from '@/data/serverNotificationsDataStore';

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

    // 1. Save to notification feed database so all users see it on /notifications
    const savedNotification = await createServerNotification({
      title: title.trim(),
      message: message.trim(),
      actionUrl: url || '/',
      category: category || 'general',
      type:
        topic === 'gmpSurge'
          ? 'gmpSurge'
          : topic === 'allotment'
          ? 'allotment'
          : topic === 'closing'
          ? 'closing'
          : topic === 'subscription'
          ? 'subscription'
          : 'general',
      isRead: false,
    });

    let targetTokens: string[] | undefined;
    if (testTokenOnly) {
      const subscribers = await getAllSubscribers();
      if (subscribers.length > 0) {
        targetTokens = [subscribers[0].token];
      }
    }

    // 2. Dispatch live FCM Web Push
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
      notification: savedNotification,
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
