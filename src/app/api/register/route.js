// src/app/api/register/route.js
import { connectToDatabase } from '@/utils/dbConnect';
import User from '@/models/user';
import generateUniqueReferralCode from '@/utils/generateReferralCode';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '@/utils/email';

const JWT_SECRET = process.env.JWT_SECRET; // Use the secret from environment variables

export async function POST(request) {
  await connectToDatabase();

  const { name, email, password } = await request.json();
  const verificationToken = crypto.randomBytes(20).toString('hex');
  const verificationTokenExpires = Date.now() + 3600000; // 1 hour

  const referralCode = await generateUniqueReferralCode();

  // Default role is 'user'
  const newUser = new User({
    name,
    email,
    password,
    referralCode,
    verificationToken,
    verificationTokenExpires,
    isVerified: false, // User is initially not verified
    role: 'user' // Set default role to 'user'
  });

  try {
    await newUser.save();

    // Generate JWT token with user role
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '4h' });

    // Use the base URL from environment variables
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Default to localhost if not set
    const verificationURL = `${baseURL}/emailVerify/${verificationToken}`;

    // Use the sendVerificationEmail function to send the email
    await sendVerificationEmail(email, verificationURL);

    return new Response(
      JSON.stringify({ message: 'Registration successful. Please check your email to verify your account.' }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to create user', error: error.message }),
      { status: 500 }
    );
  }
}
