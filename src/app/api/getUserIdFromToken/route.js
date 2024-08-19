import { connectToDatabase } from '@/utils/dbConnect';
import User from '@/models/user';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Missing or invalid Authorization header' }), { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    if (!decoded || !decoded.userId) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }
    
    // Fetch user from the database
    await connectToDatabase();
    const user = await User.findById(decoded.userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }
    
    // Respond with the user ID
    return new Response(JSON.stringify({ userId: decoded.userId }), { status: 200 });
  } catch (error) {
    console.error('Error fetching user ID from token:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
}
