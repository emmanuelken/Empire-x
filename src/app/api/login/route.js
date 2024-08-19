// src/app/api/login/route.js
import { connectToDatabase } from '../../../utils/dbConnect';
import User from '../../../models/user';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your .env.local

export async function POST(request) {
  await connectToDatabase();

  const { email, password } = await request.json();

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password.' }),
        { status: 400 }
      );
    }

    if (!user.isVerified) {
      return new Response(
        JSON.stringify({ message: 'Email not verified. Please check your email.' }),
        { status: 400 }
      );
    }

    // Generate JWT token with user role
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Include role in the token
      JWT_SECRET,
      { expiresIn: '4h' } // Token expires in 4 hours
    );

    return new Response(
      JSON.stringify({ message: 'Login successful.', token }), // Include token in response
      { status: 200 }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to log in', error: error.message }),
      { status: 500 }
    );
  }
}
