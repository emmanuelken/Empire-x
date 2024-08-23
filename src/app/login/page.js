'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import styles from '@/styles/login.module.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = formData;
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token); // Store the token in localStorage
  
        // Decode the token to extract the userId
        const decodedToken = jwtDecode(result.token);
        console.log('Decoded Token:', decodedToken); // Log the decoded token
  
        const userId = decodedToken.userId;
  
        // Check if userId is undefined
        if (!userId) {
          console.error('userId is undefined in the decoded token');
        }
  
        // Store the userId in localStorage
        localStorage.setItem('userId', userId);
  
        router.push('/dashboard'); // Redirect to the dashboard
      } else {
        setMessage(result.message || 'Login failed');
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.title}>Login to EMPIRE-X</h1>
      {message && <p className={styles.message}>{message}</p>}
      <form className={styles.form} onSubmit={handleLogin}>
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          className={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button className={styles.button} type="submit">Login</button>
      </form>
      <button className={styles.backButton} onClick={() => router.push('/')}>Back to Home</button>
    </div>
  );
};

export default LoginPage;
