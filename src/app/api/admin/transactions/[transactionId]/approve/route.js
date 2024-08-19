import { connectToDatabase } from '@/utils/dbConnect';
import Transaction from '@/models/Transaction';

export async function POST(request, { params }) {
  try {
    await connectToDatabase();

    const { transactionId } = params;

    if (!transactionId) {
      return new Response(JSON.stringify({ message: 'Transaction ID is required' }), { status: 400 });
    }

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return new Response(JSON.stringify({ message: 'Transaction not found' }), { status: 404 });
    }

    console.log('Approving Transaction:', transactionId);

    transaction.status = 'completed';
    await transaction.save();

    return new Response(JSON.stringify({ message: 'Transaction approved successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error approving transaction:', error);
    return new Response(JSON.stringify({ message: 'Failed to approve transaction', error: error.message }), { status: 500 });
  }
}
