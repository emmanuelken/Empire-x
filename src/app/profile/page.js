'use client';

import withAuth from '@/components/withAuth'; // Ensure this HOC is correctly implemented
import { useState, useEffect } from 'react';
import styles from '@/styles/Profile.module.css'; // Ensure this file exists and is correctly styled

const ProfilePage = () => {
  const [userId, setUserId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [userName, setUserName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [email, setEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showBankDetailsForm, setShowBankDetailsForm] = useState(false);
  const [showNameUpdateForm, setShowNameUpdateForm] = useState(false);
  const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('/api/profile/details', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to fetch user details:', errorData.message);
          setMessage('Failed to fetch user details.');
          return;
        }
  
        const data = await response.json();
        setUserId(data.userId);
        setUserName(data.user.name); // Corrected to match API response
        setEmail(data.user.email);
        setReferralCode(data.user.referralCode)
      } catch (error) {
        console.error('Error fetching user details:', error);
        setMessage('Error fetching user details.');
      }
    };
  
    fetchUserDetails();
  }, []);
  
  const handleSubmitBankDetails = async () => {

    const userId = localStorage.getItem('userId');
    if (!userId || !accountNumber.trim() || !bankName.trim() || !accountHolderName.trim()) {
      setMessage('Please fill in all bank details.');
      return;
    }
  
    try {
      const response = await fetch('/api/profile/bank-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId,
          accountNumber: accountNumber.trim(),
          bankName: bankName.trim(),
          accountHolderName: accountHolderName.trim(),
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
  
  const handleUpdateUserName = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !newName) { // Change `newUserName` to `newName`
      setMessage('Please enter a new name.');
      return;
    }
  
    try {
      const response = await fetch('/api/profile/update-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId,
          newName, // Change `newUserName` to `newName`
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        setUserName(newName); // Change `newUserName` to `newName`
        setMessage('Name updated successfully!');
        setNewName(''); // Change `newUserName` to `newName`
      } else {
        setMessage(result.message || 'Failed to update name');
      }
    } catch (error) {
      setMessage('Failed to update name: ' + error.message);
    }
  };
  
  

  const handleChangePassword = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !currentPassword || !newPassword) {
      setMessage('Please enter both current and new passwords.');
      return;
    }

    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setMessage(result.message || 'Failed to change password');
      }
    } catch (error) {
      setMessage('Failed to change password: ' + error.message);
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
      <p><strong>User Name:</strong> {userName}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Referral Code:</strong> {referralCode}</p>

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

      <button 
        className={styles.toggleButton} 
        onClick={() => setShowNameUpdateForm(!showNameUpdateForm)}
      >
        {showNameUpdateForm ? 'Hide' : 'Update User Name'}
      </button>

      {showNameUpdateForm && (
        <div className={styles.nameUpdateForm}>
          <input
            type="text"
            placeholder="New User Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={styles.input}
          />
          <button 
            onClick={handleUpdateUserName}
            className={styles.submitButton}
          >
            Update Name
          </button>
          {message && <p className={styles.message}>{message}</p>}
        </div>
      )}

      <button 
        className={styles.toggleButton} 
        onClick={() => setShowPasswordChangeForm(!showPasswordChangeForm)}
      >
        {showPasswordChangeForm ? 'Hide' : 'Change Password'}
      </button>

      {showPasswordChangeForm && (
        <div className={styles.passwordChangeForm}>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
          />
          <button 
            onClick={handleChangePassword}
            className={styles.submitButton}
          >
            Change Password
          </button>
          {message && <p className={styles.message}>{message}</p>}
        </div>
      )}

      <button 
        onClick={handleLogout}
        className={styles.logoutButton}
      >
        Logout
      </button>
    </div>
  );
};

export default withAuth(ProfilePage);
