// utils/auth.js
import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Return the decoded token with user info
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
