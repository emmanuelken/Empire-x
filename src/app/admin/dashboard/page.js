"use client";
import styles from '@/app/admin/dashboard/AdminDashboard.module.css';
import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth'; // Import your withAuth HOC

function AdminDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [bitcoinRate, setBitcoinRate] = useState('');
  const [tetherRate, setTetherRate] = useState('');
  const [message, setMessage] = useState('');

  // State to manage visibility
  const [showTransactions, setShowTransactions] = useState(false);
  const [showRateUpdate, setShowRateUpdate] = useState(false);
  const [showUserAccounts, setShowUserAccounts] = useState(false);

  // Fetch transactions, rates, and user details on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const transactionsRes = await fetch('/api/admin/transactions');
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData.transactions || []);

        // Fetch custom rates
        const ratesRes = await fetch('/api/custom-rates');
        const ratesData = await ratesRes.json();
        setBitcoinRate(ratesData.bitcoinRate || '');
        setTetherRate(ratesData.tetherRate || '');

        // Fetch users
        const usersRes = await fetch('/api/admin/users');
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle transaction approval
  const handleApprove = async (transactionId) => {
    try {
      // Optimistically update UI
      setTransactions(transactions.filter((txn) => txn._id !== transactionId));

      // Send approval request to server
      await fetch(`/api/admin/transactions/${transactionId}/approve`, {
        method: 'POST',
      });

      // Optional: Re-fetch transactions to ensure data consistency
      // const transactionsRes = await fetch('/api/admin/transactions');
      // const transactionsData = await transactionsRes.json();
      // setTransactions(transactionsData.transactions || []);
    } catch (error) {
      console.error('Error approving transaction:', error);
    }
  };

  // Handle rate update
  const handleRateUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/update-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bitcoinRate: parseFloat(bitcoinRate),
          tetherRate: parseFloat(tetherRate),
        }),
      });

      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error('Error updating rates:', error);
      setMessage('Failed to update rates');
    }
  };

  return (
    <div>
      <h1 className={styles.header}>Hi, Admin</h1>
      <div className={styles.toggleButtons}>
        <button onClick={() => setShowRateUpdate(!showRateUpdate)}>
          {showRateUpdate ? 'Hide Update Rates' : 'Update Rates'}
        </button>
        <button onClick={() => setShowTransactions(!showTransactions)}>
          {showTransactions ? 'Hide Transactions' : 'User Transactions'}
        </button>
        <button onClick={() => setShowUserAccounts(!showUserAccounts)}>
          {showUserAccounts ? 'Hide User Accounts' : 'User Accounts'}
        </button>
      </div>

      {showRateUpdate && (
        <div className={styles.updateRatesSection}>
          <h2>Update Rates</h2>
          <form onSubmit={handleRateUpdate}>
            <label>
              Bitcoin Rate (NGN):
              <input
                type="number"
                step="0.01"
                value={bitcoinRate}
                onChange={(e) => setBitcoinRate(e.target.value)}
              />
            </label>
            <br />
            <label>
              Tether Rate (NGN):
              <input
                type="number"
                step="0.01"
                value={tetherRate}
                onChange={(e) => setTetherRate(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Update Rates</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      )}

      {showTransactions && (
        <div className={styles.transactionsSection}>
          <h2>User Transactions</h2>
          <ul>
            {transactions.map((txn) => (
              <li key={txn.id}>
                <p>
                  User: {txn.userName} ({txn.userEmail})
                </p>
                <p>Amount: {txn.amount}</p>
                <p>Wallet Name: {txn.walletName}</p>
                <p>Status: {txn.status}</p>
                <p>Time: {txn.createdAt ? new Date(txn.createdAt).toLocaleString() : 'Invalid Date'}</p>
                <button onClick={() => handleApprove(txn.id)}>Approve</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showUserAccounts && (
        <div className={styles.userAccountsSection}>
          <h2>User Accounts</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <div>
                  <h3>Account Details</h3>
                  <p>Account Number: {user.bankAccount?.accountNumber || 'N/A'}</p>
                  <p>Bank Name: {user.bankAccount?.bankName || 'N/A'}</p>
                  <p>Account Holder Name: {user.bankAccount?.accountHolderName || 'N/A'}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Wrap the AdminDashboard with the withAuth HOC
export default withAuth(AdminDashboard, true);
