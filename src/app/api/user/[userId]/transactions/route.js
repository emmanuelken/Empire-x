//Getting Transactions based on User Id
//src/app/api/user/[userId]/transactions/route.js
import {connectToDatabase} from '@/utils/dbConnect';
import Transaction from '@/models/Transaction';
import User from '@/models/user';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    // Log the params object to see what is being passed
    console.log('Received params:', params);

    // Destructure userId from params
    const { userId } = params;

    // Log the userId before validation
    console.log('Received userId:', userId);

    // Validate the userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid userId format:', userId);
      return new Response(JSON.stringify({ message: 'Invalid userId format' }), { status: 400 });
    }

    await connectToDatabase();

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Fetch transactions for the user
    const transactions = await Transaction.find({ user: userId });

    return new Response(JSON.stringify({ transactions }), { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
}
