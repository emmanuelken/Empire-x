'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/verifypage.module.css';

const VerifyPage = ({ params }) => {
  const [message, setMessage] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify/${params.token}`);
        const result = await response.json();

        if (response.ok) {
          setMessage(result.message);
          setIsSuccessful(true);
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          // Handle cases where the token is invalid, expired, or already used
          if (result.message.includes('already verified')) {
            setMessage('Your email has already been verified. Redirecting to login...');
            setIsSuccessful(true);
            setTimeout(() => {
              router.push('/login');
            }, 2000);
          } else {
            setMessage(result.message || 'Failed to verify email');
            setIsSuccessful(false);
            setTimeout(() => {
              router.push('/login');
            }, 2000);
          }
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
        setIsSuccessful(false);
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      } finally {
        setLoading(false);
      }
    };

    if (params.token) {
      verifyEmail();
    } else {
      setMessage('Invalid or missing verification token.');
      setIsSuccessful(false);
      setLoading(false);
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    }
  }, [params.token, router]);

  if (loading) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Email Verification</h1>
      <p className={`${styles.message} ${isSuccessful ? styles.success : styles.error}`}>
        {message}
      </p>
    </div>
  );
};

export default VerifyPage;
