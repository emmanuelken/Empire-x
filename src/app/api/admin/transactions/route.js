// src/app/api/admin/transactions/route.js
import { connectToDatabase } from '@/utils/dbConnect';
import Transaction from '@/models/Transaction';

export async function GET(request) {
  try {
    await connectToDatabase();

    // Fetch transactions and populate the user field
    const transactions = await Transaction.find({ status: 'pending' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    console.log('Fetched Transactions:', transactions); // Log fetched transactions

    // Format the response
    const transactionsWithUserDetails = transactions.map(transaction => ({
      id: transaction._id,
      userName: transaction.user ? transaction.user.name : 'Unknown User',
      userEmail: transaction.user ? transaction.user.email : 'Unknown Email',
      amount: transaction.amount,
      walletName: transaction.walletName,
      status: transaction.status,
      createdAt: transaction.createdAt.toISOString(),
    }));

    console.log('Formatted Transactions:', transactionsWithUserDetails); // Log formatted transactions

    return new Response(JSON.stringify({ transactions: transactionsWithUserDetails }), { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch transactions', error: error.message }), { status: 500 });
  }
}
