import crypto from 'crypto';
import User from '../models/user';

async function generateUniqueReferralCode() {
  let referralCode;
  let isUnique = false;

  while (!isUnique) {
    referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    const existingUser = await User.findOne({ referralCode });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return referralCode;
}

export default generateUniqueReferralCode;

  