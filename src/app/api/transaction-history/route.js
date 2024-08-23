import { connectToDatabase } from '@/utils/dbConnect';
import Transaction from '@/models/Transaction';
import User from '@/models/user';
import mongoose from 'mongoose';

export async function GET(request) {
  await connectToDatabase();

  try {
    // Retrieve user ID from headers
    const userId = request.headers.get('userId');
    console.log('Received userId:', userId); // Debugging line

    // Check if userId is valid
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return new Response(JSON.stringify({ message: 'Invalid or missing User ID' }), { status: 400 });
    }

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Fetch user transactions
    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });

    return new Response(JSON.stringify({ transactions }), { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error); // Improved error logging
    return new Response(JSON.stringify({ message: 'Failed to fetch transactions', error: error.message }), { status: 500 });
  }
};
