import {
  saveSubscriber,
  removeSubscriber,
  getNotificationStoreStats,
} from '@/data/serverNotificationStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = await getNotificationStoreStats();
  return Response.json({
    status: 'ok',
    service: 'IPO Alerts Push Notification Service',
    stats,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, preferences, topics, isDemo } = body;

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return Response.json(
        { success: false, error: 'A valid registration token string is required.' },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get('user-agent') || undefined;

    const { created, subscriber } = await saveSubscriber(token.trim(), {
      preferences,
      topics,
      userAgent,
      isDemo: Boolean(isDemo),
    });

    return Response.json({
      success: true,
      created,
      message: created
        ? 'Subscriber successfully registered for IPO push alerts.'
        : 'Subscriber preferences updated successfully.',
      subscriber: {
        token: subscriber.token.slice(0, 10) + '...',
        topics: subscriber.topics,
        isDemo: subscriber.isDemo,
      },
    });
  } catch (err) {
    console.error('Error in /api/save-notification-token POST:', err);
    return Response.json(
      { success: false, error: 'Internal server error processing notification token.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return Response.json(
        { success: false, error: 'Token is required to unsubscribe.' },
        { status: 400 }
      );
    }

    const removed = await removeSubscriber(token.trim());

    return Response.json({
      success: true,
      removed,
      message: removed
        ? 'Token removed from alert subscriptions.'
        : 'Token was not found in subscriber list.',
    });
  } catch (err) {
    console.error('Error in /api/save-notification-token DELETE:', err);
    return Response.json(
      { success: false, error: 'Internal server error processing unsubscription.' },
      { status: 500 }
    );
  }
}
