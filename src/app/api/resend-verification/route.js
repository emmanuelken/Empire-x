import { connectToDatabase } from '@/utils/dbConnect';
import User from '@/models/user';
import { sendVerificationEmail } from '@/utils/email';

export async function POST(request) {
  await connectToDatabase();

  const { email } = await request.json();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    const now = Date.now();
    const resendInterval = 60000; // 1 minute
    const maxResendAttempts = 2;

    if (user.isVerified) {
      return new Response(JSON.stringify({ message: 'User already verified' }), { status: 400 });
    }

    if (user.resendAttempts >= maxResendAttempts) {
      return new Response(JSON.stringify({ message: 'Maximum resend attempts reached' }), { status: 400 });
    }

    if (user.lastResend && now - user.lastResend < resendInterval) {
      return new Response(JSON.stringify({ message: `We can resend the email in ${Math.ceil((resendInterval - (now - user.lastResend)) / 1000)} seconds` }), { status: 429 });
    }

    // Update resend attempts and last resend time
    user.resendAttempts += 1;
    user.lastResend = now;
    await user.save();

    const verificationURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/${user.verificationToken}`;

    await sendVerificationEmail(email, verificationURL);

    return new Response(JSON.stringify({ message: 'Verification email resent. Please check your inbox.' }), { status: 200 });
  } catch (error) {
    console.error('Error resending verification email:', error);
    return new Response(JSON.stringify({ message: 'Failed to resend verification email', error: error.message }), { status: 500 });
  }
}
