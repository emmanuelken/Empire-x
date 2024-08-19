import User from '@/models/user';
import { connectToDatabase } from '@/utils/dbConnect';

export async function POST(req) {
  try {
    await connectToDatabase();

    const { userId } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    user.role = 'admin';
    await user.save();

    return new Response(JSON.stringify({ message: 'User promoted to admin successfully!' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to promote user', error: error.message }), { status: 500 });
  }
}
