import { connectToDatabase } from '@/utils/dbConnect';
import Transaction from '@/models/Transaction';
import Notification from '@/models/Notification'; // Import the Notification model
import User from '@/models/user'; // Import the User model if needed for populating user data

export async function POST(request, { params }) {
  try {
    await connectToDatabase();

    const { transactionId } = params;

    if (!transactionId) {
      return new Response(JSON.stringify({ message: 'Transaction ID is required' }), { status: 400 });
    }

    const transaction = await Transaction.findById(transactionId).populate('user'); // Populate user details if needed

    if (!transaction) {
      return new Response(JSON.stringify({ message: 'Transaction not found' }), { status: 404 });
    }

    console.log('Approving Transaction:', transactionId);

    // Update transaction status to completed
    transaction.status = 'completed';
    await transaction.save();

    // Notify the user about the approved transaction
    const userId = transaction.user._id; // Assuming the transaction has a reference to the user
    const message = `Your transaction of $${transaction.amount} has been approved.`;

    const notification = new Notification({
      userId,
      message,
      type: 'transactionApproval', // You can customize the notification type
    });

    await notification.save();

    return new Response(JSON.stringify({ message: 'Transaction approved successfully, and user notified.' }), { status: 200 });
  } catch (error) {
    console.error('Error approving transaction:', error);
    return new Response(JSON.stringify({ message: 'Failed to approve transaction', error: error.message }), { status: 500 });
  }
}
