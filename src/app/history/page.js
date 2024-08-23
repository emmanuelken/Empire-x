'use client';

import React, { useState, useEffect } from 'react';
import withAuth from '@/components/withAuth';
import styles from '@/styles/History.module.css';

const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        console.log('Token:', token); // Debugging line
        console.log('User ID:', userId); // Debugging line
    
        const response = await fetch('/api/transaction-history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Adjust if necessary
            'userId': userId // Ensure this header is set and matches backend expectations
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
    
        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1>Your Transaction History</h1>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>$ Amount</th>
              <th>Payment Rate</th>
              <th>Amount Paid</th>
              <th>Wallet Used</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                <td>${transaction.amount}</td>
                <td>₦{transaction.conversionRate}</td>
                <td>₦{transaction.expectedAmount}</td>
                <td>{transaction.walletName}</td>
                <td>{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default withAuth(HistoryPage);
