//src/app/api/profile/bank-details/route.js
import {connectToDatabase} from '@/utils/dbConnect';
import User from '@/models/user';
import mongoose from 'mongoose';

export async function POST(req) {
  await connectToDatabase();

  const { userId, accountNumber, bankName, accountHolderName } = await req.json();

  if (!userId || !accountNumber || !bankName || !accountHolderName) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
  }

  try {
    // Ensure userId is valid and castable to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response(JSON.stringify({ message: 'Invalid user ID' }), { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    user.bankAccount = {
      accountNumber,
      bankName,
      accountHolderName,
    };

    await user.save();
    return new Response(JSON.stringify({ message: 'Bank details updated successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to update bank details', error: error.message }), { status: 500 });
  }
}

