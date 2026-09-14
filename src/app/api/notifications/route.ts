import { getServerNotifications } from '@/data/serverNotificationsDataStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const notifications = await getServerNotifications();
    return Response.json({
      success: true,
      notifications,
      total: notifications.length,
    });
  } catch (err) {
    console.error('Error in GET /api/notifications:', err);
    return Response.json({ success: false, notifications: [] }, { status: 500 });
  }
}
