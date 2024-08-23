import { connectToDatabase } from '@/utils/dbConnect';
import User from '@/models/user';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function fetchUserIdFromToken(token) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getUserIdFromToken`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user ID: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.userId; // Ensure this returns the correct userId
  } catch (error) {
    console.error('Error fetching user ID from token:', error);
    throw error;
  }
}

export async function GET(request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Missing or invalid Authorization header' }), { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Fetch user ID from token
    const userId = await fetchUserIdFromToken(token);
    
    if (!userId) {
      return new Response(JSON.stringify({ message: 'Invalid token or user ID not found' }), { status: 401 });
    }
    
    // Connect to database and fetch user details
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }
    
    // Respond with user details
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
}
