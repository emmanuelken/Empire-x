import { connectToDatabase } from '@/utils/dbConnect';
import Transaction from '@/models/Transaction';
import User from '@/models/user';
import { getConversionRate } from '@/utils/conversionUtils';

export async function POST(req, { params }) {
  await connectToDatabase();

  const { userId, transactionId, walletName, amount } = await req.json();
  const { assetId, networkId } = params;

  if (!userId || !transactionId || !walletName || amount === undefined) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
  }

  try {
    // Use the environment variable to get the API base URL
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/api/fetchAssets`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const assets = await response.json();

    // Validate assetId
    const asset = assets.find(a => a.id === assetId);
    if (!asset) {
      return new Response(JSON.stringify({ message: 'Invalid asset ID format' }), { status: 400 });
    }

    // Validate networkId
    if (!networkId) {
      return new Response(JSON.stringify({ message: 'Invalid network ID format' }), { status: 400 });
    }

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Get conversion rate
    const conversionRate = await getConversionRate(assetId);
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
    return new Response(JSON.stringify({ message: 'Transaction Process Completed. You will be credited in less than 5 mins.', transaction: newTransaction }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to submit transaction', error: error.message }), { status: 500 });
  }
}
