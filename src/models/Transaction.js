import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  asset: {
    type: String, // Changed from ObjectId to String
    ref: 'Asset',
    required: true,
  },
  network: {
    type: String, // Changed from ObjectId to String
    ref: 'Network',
    required: true,
  },
  amount: {
    type: Number, // Amount in USD
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true, // Ensuring each transaction ID is unique
  },
  walletName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  conversionRate: {
    type: Number, // Conversion rate from USD to Naira
    required: true,
  },
  expectedAmount: {
    type: Number, // Amount in Naira
    required: true,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Adding indexes to improve query performance
TransactionSchema.index({ user: 1 });
TransactionSchema.index({ asset: 1 });
TransactionSchema.index({ network: 1 });
TransactionSchema.index({ transactionId: 1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
