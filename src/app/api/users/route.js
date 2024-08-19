//src/app/api/users/route.js
import { connectToDatabase } from '@/utils/dbConnect';
import User from '@/models/user';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your .env.local

export async function GET(request) {
  await connectToDatabase();

  // Extract token from Authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ message: 'Token is required' }), { status: 401 });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' from the start

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }

    // Fetch user data
    const user = await User.findById(userId).select('name'); // Only select the name field
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ name: user.name }), { status: 200 });
  } catch (error) {
    console.error('Error verifying token or fetching user:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch user', error: error.message }), { status: 500 });
  }
}
