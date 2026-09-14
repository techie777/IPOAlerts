import {
  getServerNotifications,
  createServerNotification,
  updateServerNotification,
  deleteServerNotification,
  clearAllServerNotifications,
  resetServerNotifications,
} from '@/data/serverNotificationsDataStore';
import { sendIpoAlert } from '@/lib/firebase/sendIpoAlert';
import { isFirebaseAdminConfigured } from '@/lib/firebase/adminApp';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const notifications = await getServerNotifications();
    return Response.json({
      success: true,
      notifications,
      total: notifications.length,
      firebaseConfigured: isFirebaseAdminConfigured(),
    });
  } catch (err) {
    console.error('Error in GET /api/admin/notifications:', err);
    return Response.json(
      { success: false, error: 'Failed to retrieve notifications.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      message,
      type = 'general',
      category = 'general',
      actionUrl = '/',
      ipoSlug,
      dispatchPush = false,
    } = body;

    if (!title || !message) {
      return Response.json(
        { success: false, error: 'Title and message are required.' },
        { status: 400 }
      );
    }

    const created = await createServerNotification({
      title: title.trim(),
      message: message.trim(),
      type,
      category,
      actionUrl: actionUrl.trim(),
      ipoSlug,
      isRead: false,
    });

    let pushResult = null;
    if (dispatchPush) {
      pushResult = await sendIpoAlert({
        title: created.title,
        body: created.message,
        url: created.actionUrl || '/',
        category: created.category === 'general' ? undefined : created.category,
        topic: created.type,
      });
    }

    return Response.json({
      success: true,
      notification: created,
      pushResult,
      message: dispatchPush
        ? 'Notification saved and push alert dispatched to subscribers!'
        : 'Notification created successfully.',
    });
  } catch (err) {
    console.error('Error in POST /api/admin/notifications:', err);
    return Response.json(
      { success: false, error: 'Failed to create notification.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, message, type, category, actionUrl, ipoSlug, isRead } = body;

    if (!id) {
      return Response.json(
        { success: false, error: 'Notification ID is required for editing.' },
        { status: 400 }
      );
    }

    const updated = await updateServerNotification(id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(message !== undefined && { message: message.trim() }),
      ...(type !== undefined && { type }),
      ...(category !== undefined && { category }),
      ...(actionUrl !== undefined && { actionUrl: actionUrl.trim() }),
      ...(ipoSlug !== undefined && { ipoSlug }),
      ...(isRead !== undefined && { isRead }),
    });

    if (!updated) {
      return Response.json(
        { success: false, error: 'Notification not found.' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      notification: updated,
      message: 'Notification updated successfully.',
    });
  } catch (err) {
    console.error('Error in PUT /api/admin/notifications:', err);
    return Response.json(
      { success: false, error: 'Failed to update notification.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const action = url.searchParams.get('action');

    if (action === 'clear') {
      await clearAllServerNotifications();
      return Response.json({
        success: true,
        message: 'All notifications cleared.',
      });
    }

    if (action === 'reset') {
      const resetList = await resetServerNotifications();
      return Response.json({
        success: true,
        notifications: resetList,
        message: 'Notifications reset to sample defaults.',
      });
    }

    if (!id) {
      return Response.json(
        { success: false, error: 'Notification ID or action is required.' },
        { status: 400 }
      );
    }

    const deleted = await deleteServerNotification(id);
    if (!deleted) {
      return Response.json(
        { success: false, error: 'Notification not found.' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Notification deleted successfully.',
    });
  } catch (err) {
    console.error('Error in DELETE /api/admin/notifications:', err);
    return Response.json(
      { success: false, error: 'Failed to delete notification.' },
      { status: 500 }
    );
  }
}
