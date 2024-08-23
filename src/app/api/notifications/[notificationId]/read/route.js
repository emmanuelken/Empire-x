// src/app/api/notifications/[notificationId]/read/route.js
import { connectToDatabase } from '@/utils/dbConnect';
import Notification from '@/models/Notification';

export async function POST(request, { params }) {
  try {
    await connectToDatabase();

    const { notificationId } = params;

    if (!notificationId) {
      return new Response(JSON.stringify({ message: 'Notification ID is required' }), { status: 400 });
    }

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return new Response(JSON.stringify({ message: 'Notification not found' }), { status: 404 });
    }

    notification.read = true; // Mark the notification as read
    await notification.save();

    return new Response(JSON.stringify({ message: 'Notification marked as read' }), { status: 200 });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return new Response(JSON.stringify({ message: 'Failed to mark notification as read', error: error.message }), { status: 500 });
  }
}
