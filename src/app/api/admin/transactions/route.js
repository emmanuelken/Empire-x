import { connectToDatabase } from '@/utils/dbConnect';
import Transaction from '@/models/Transaction';

export async function GET(request) {
  try {
    await connectToDatabase();

    // Fetch transactions and populate the user field
    const transactions = await Transaction.find({ status: 'pending' })
      .populate('user', 'name email') // Populate the user's name and email
      .sort({ createdAt: -1 }); // Optional: sort by time, most recent first

    console.log('Fetched Transactions:', transactions); // Log the fetched transactions

    // Format the response to include the necessary fields
    const transactionsWithUserDetails = transactions.map(transaction => ({
      id: transaction._id,
      userName: transaction.user ? transaction.user.name : 'Unknown User',
      userEmail: transaction.user ? transaction.user.email : 'Unknown Email',
      amount: transaction.amount,
      walletName: transaction.walletName,
      status: transaction.status,
      createdAt: transaction.createdAt.toISOString(), // Format date
    }));

    return new Response(JSON.stringify({ transactions: transactionsWithUserDetails }), { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch transactions', error: error.message }), { status: 500 });
  }
}
