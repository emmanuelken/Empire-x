'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/verifypage.module.css';

const VerifyPage = ({ params }) => {
  const [message, setMessage] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify/${params.token}`);
        const result = await response.json();
        if (response.ok) {
          setMessage(result.message);
          setIsSuccessful(true);
          // Redirect to login page after successful verification
          setTimeout(() => {
            router.push('/login');
          }, 3000); // Wait 3 seconds before redirecting
        } else {
          setMessage(result.message || 'Verification failed');
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
      }
    };

    verifyEmail();
  }, [params.token, router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Email Verification</h1>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default VerifyPage;
