'use client';

export const dynamic = 'force-dynamic';

import withAuth from '@/components/withAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Dashboard.module.css';
import Link from 'next/link';

const DashboardPage = () => {
  const [userName, setUserName] = useState('');
  const [btcRate, setBtcRate] = useState(null);
  const [usdtRate, setUsdtRate] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false); // State for showing notifications
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      }
    };

    const fetchRates = async () => {
      try {
        const response = await fetch('/api/custom-rates', {
          cache: 'no-store', // Prevent caching of the response
        });
        if (!response.ok) {
          throw new Error('Failed to fetch rates');
        }
    
        const data = await response.json();
        const bitcoinRate = data.find(rate => rate.asset === 'bitcoin');
        const tetherRate = data.find(rate => rate.asset === 'tether');
        
        setBtcRate(bitcoinRate ? bitcoinRate.rate : 'Not Available');
        setUsdtRate(tetherRate ? tetherRate.rate : 'Not Available');
      } catch (error) {
        console.error('Error fetching rates:', error);
        setError('Failed to fetch rates');
      }
    };
    

    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    const fetchData = async () => {
      await fetchUserData();
      await fetchRates();
      setLoading(false);  // Set loading to false after all data is fetched
    };

    fetchData();

    const intervalId = setInterval(fetchNotifications, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleClearNotification = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });

      if (response.ok) {
        setNotifications(notifications.map(notification => 
          notification._id === notificationId ? { ...notification, read: true } : notification
        ));
      }
    } catch (error) {
      console.error('Failed to clear notification:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.dashboard}>
      <h1>Hi, {userName}</h1>
      <p>Welcome to EMPIRE-X</p>
      <div className={styles.rates}>
        <p>BTC Rate: {btcRate !== null ? `₦${btcRate}` : 'Fetching rate...'}</p>
        <p>USDT Rate: {usdtRate !== null ? `₦${usdtRate}` : 'Fetching rate...'}</p>
      </div>
      <button onClick={() => router.push('/assetts')} className={styles.btn}>Convert Crypto to Cash</button>
      
      <div className={styles.notifications}>
        <h2>Notifications</h2>
        <button 
          className={styles.showNotificationsBtn} 
          onClick={() => setShowNotifications(!showNotifications)}
        >
          {showNotifications ? 'Hide Notifications' : 'Show Notifications'}
        </button>
        {showNotifications && (
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li key={notification._id} className={notification.read ? styles.read : ''}>
                  <h4>{notification.message}</h4>
                  {!notification.read && (
                    <button onClick={() => handleClearNotification(notification._id)}>OK</button>
                  )}
                </li>
              ))
            ) : (
              <li>No notifications</li>
            )}
          </ul>
        )}
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><Link href="/profile">Profile</Link></li>
          <li><Link href="/support">Support</Link></li>
          <li><Link href="/history">History</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default withAuth(DashboardPage);
