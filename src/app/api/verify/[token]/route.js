// src/app/api/verify/[token]/route.js
import { connectToDatabase } from '@/utils/dbConnect';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  await connectToDatabase();

  const { token } = params; // Get the verification token from the URL

  try {
    // Find the user by the verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }, // Token is valid only if it hasn't expired
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'Login or sign up required' }), { status: 400 });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token after successful verification
    user.verificationTokenExpires = undefined; // Clear the token expiration

    await user.save();

    return new NextResponse(
      JSON.stringify({ message: 'Email verified successfully! You can now log in.' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying email:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to verify email', error: error.message }),
      { status: 500 }
    );
  }
}
