//src/services/userNotification.js
import Notification from '@/models/Notification';

/**
 * Create a notification for a user.
 * @param {string} userId - The ID of the user to notify.
 * @param {string} message - The notification message.
 * @param {string} type - The type of notification.
 */
export async function notifyUser(userId, message, type) {
  try {
    const notification = new Notification({
      userId,
      message,
      type,
    });
    await notification.save();
    console.log('Notification created successfully.');
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
