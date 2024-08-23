//src/api/notifications/route.js
import { connectToDatabase } from '@/utils/dbConnect';
import Notification from '@/models/Notification'; // Adjust the import path based on your project structure

export async function GET(request) {
  await connectToDatabase();

  try {
    // Fetch notifications from the database
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(3).exec();
    
    return new Response(JSON.stringify({ notifications }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch notifications' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
