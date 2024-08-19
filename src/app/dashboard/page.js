'use client';

import withAuth from '@/components/withAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Dashboard.module.css';
import Link from 'next/link';

const DashboardPage = () => {
  const [userName, setUserName] = useState('');
  const [btcRate, setBtcRate] = useState(null);
  const [usdtRate, setUsdtRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
            'Authorization': `Bearer ${token}`, // Use Bearer token for authorization
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
        const response = await fetch('/api/custom-rates');
        if (!response.ok) {
          throw new Error('Failed to fetch rates');
        }
        const data = await response.json();
        console.log('Fetched Rates:', data); // Check the fetched data
    
        // Access the 'ngn' field correctly
        setBtcRate(data.bitcoin.ngn);
        setUsdtRate(data.tether.ngn);
    
      } catch (error) {
        console.error('Error fetching rates:', error);
        setError('Failed to fetch rates');
      } finally {
        setLoading(false); // Ensure loading is set to false even if an error occurs
      }
    };
    

    fetchUserData();
    fetchRates();
  }, []);

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
        <p>BTC Rate: {btcRate !== null ? `₦${btcRate.toLocaleString()}` : 'Fetching rate...'}</p>
        <p>USDT Rate: {usdtRate !== null ? `₦${usdtRate.toLocaleString()}` : 'Fetching rate...'}</p>
      </div>
      <button onClick={() => router.push('/assetts')} className={styles.btn}>Convert Crypto to Cash</button>
      <nav className={styles.nav}>
      <ul>
  <li>
    <Link href="/profile">Profile</Link>
  </li>
  <li>
    <Link href="/support">Support</Link>
  </li>
  <li>
    <Link href="/history">History</Link>
  </li>
</ul>
      </nav>
    </div>
  );
};

export default withAuth(DashboardPage);
