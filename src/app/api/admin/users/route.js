import { connectToDatabase } from '@/utils/dbConnect';
import User from '@/models/user'; // Ensure the path to the User model is correct
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDatabase();

  try {
    // Fetch all users and specify the fields to return
    const users = await User.find({}, 'name email bankAccount');
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Failed to fetch users', error: error.message }, { status: 500 });
  }
}
