'use client';

import withAuth from '@/components/withAuth';
import { useState, useEffect } from 'react';
import styles from '@/styles/Profile.module.css'; // Ensure this file exists and is correctly styled

const ProfilePage = () => {
  const [userId, setUserId] = useState(''); // State for user ID
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [message, setMessage] = useState('');
  const [showBankDetailsForm, setShowBankDetailsForm] = useState(false);

  useEffect(() => {
    const fetchUserIdFromToken = async () => {
      try {
        const response = await fetch('/api/getUserIdFromToken', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        const data = await response.json();
        if (response.ok) {
          setUserId(data.userId);
        } else {
          console.error('Failed to fetch user ID:', data.message);
          setMessage('Failed to fetch user ID.');
        }
      } catch (error) {
        console.error('Error fetching user ID from token:', error);
        setMessage('Error fetching user ID.');
      }
    };
    
    fetchUserIdFromToken();
  }, []);

  const handleSubmitBankDetails = async () => {
    if (!userId || !accountNumber || !bankName || !accountHolderName) {
      setMessage('Please fill in all bank details.');
      console.log({ userId, accountNumber, bankName, accountHolderName }); // Debug here
      return;
    }
  
    try {
      const response = await fetch('/api/profile/bank-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          accountNumber,
          bankName,
          accountHolderName,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        setMessage('Bank details updated successfully!');
      } else {
        setMessage(result.message || 'Failed to update bank details');
      }
    } catch (error) {
      setMessage('Failed to update bank details: ' + error.message);
    }
  };

  const handleLogout = () => {
    // Clear the token and redirect to the login page
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Remove userId if stored
    window.location.href = '/'; // Redirect to the login page or home page
  };

  return (
    <div className={styles.profileContainer}>
      <h1>Your Personal Details</h1>

      <button 
        className={styles.toggleButton} 
        onClick={() => setShowBankDetailsForm(!showBankDetailsForm)}
      >
        {showBankDetailsForm ? 'Hide' : 'Add or Update Bank Account Details'}
      </button>

      {showBankDetailsForm && (
        <div className={styles.bankDetailsForm}>
          <input
            type="text"
            placeholder="Bank Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Account Holder Name"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            className={styles.input}
          />
          <button 
            onClick={handleSubmitBankDetails}
            className={styles.submitButton}
          >
            Submit
          </button>
          {message && <p className={styles.message}>{message}</p>}
        </div>
      )}

      <h2>Settings</h2>
      {/* Add your settings components or links here */}

      <button 
        className={styles.logoutButton} 
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default withAuth(ProfilePage);
