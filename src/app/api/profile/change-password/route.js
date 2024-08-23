import { connectToDatabase } from '@/utils/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { userId, currentPassword, newPassword } = await request.json();
    if (!userId || !currentPassword || !newPassword) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Current password is incorrect' }), { status: 400 });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return new Response(JSON.stringify({ message: 'Password changed successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error changing password:', error.message);
    return new Response(JSON.stringify({ message: 'Failed to change password', error: error.message }), { status: 500 });
  }
}
