// src/app/api/verify-token/route.js
import { verifyToken } from '../../../utils/auth';

export async function POST(request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  try {
    if (!token) {
      return new Response(JSON.stringify({ message: 'Token not provided' }), { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }

    return new Response(JSON.stringify({ role: decoded.role }), { status: 200 });
  } catch (error) {
    console.error('Error verifying token:', error);
    return new Response(JSON.stringify({ message: 'Failed to verify token', error: error.message }), { status: 500 });
  }
}
