import { connectToDatabase } from '@/utils/dbConnect';
import User from '@/models/user';

export async function POST(request) {
  try {
    const { userId, newName } = await request.json(); // change `newUserName` to `newName`
    if (!userId || !newName) { // change `newUserName` to `newName`
      return new Response(JSON.stringify({ message: 'User ID and new name are required' }), { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findByIdAndUpdate(userId, { name: newName }, { new: true }); // change `userName` to `name`

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Name updated successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error updating name:', error.message);
    return new Response(JSON.stringify({ message: 'Failed to update name', error: error.message }), { status: 500 });
  }
}
