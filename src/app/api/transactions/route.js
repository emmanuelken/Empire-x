//src/app/api/transactions/route.js
import { connectToDatabase } from '../../../utils/dbConnect';
import Transaction from '../../../models/Transaction';
import User from '../../../models/user';
import { getConversionRate } from '../../../utils/conversionUtils'; // Updated import path

export async function POST(request) {
  await connectToDatabase();

  const { userId, assetId, networkId, amount, transactionId, walletName } = await request.json();

  try {
    // Validate input
    if (!userId || !amount || !transactionId || !walletName || !assetId || !networkId) {
      return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
    }

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Get conversion rate
    const conversionRate = await getConversionRate(assetId); // function call
    const expectedAmount = amount * conversionRate;

    // Create a new transaction record
    const newTransaction = new Transaction({
      user: userId,
      asset: assetId,
      network: networkId,
      amount,
      transactionId,
      walletName,
      conversionRate,
      expectedAmount,
      status: 'pending',
    });

    await newTransaction.save();

    // TODO: Add external system integration here for processing

    return new Response(JSON.stringify({ message: 'Transaction created successfully!', transaction: newTransaction }), { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return new Response(JSON.stringify({ message: 'Failed to create transaction', error: error.message }), { status: 500 });
  }
}
