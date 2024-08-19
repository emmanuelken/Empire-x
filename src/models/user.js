import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// src/models/user.js
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  referralCode: String,
  resendAttempts: { type: Number, default: 0 },
  lastResend: Date,
  bankAccount: {
    accountNumber: String,
    bankName: String,
    accountHolderName: String,
  },
});

// Add methods for password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Use `mongoose.models.User` to check if the model already exists
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
