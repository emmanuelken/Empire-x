'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const HomePage = () => {
  const [showForm, setShowForm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null); // To handle registration status
  const [resendAttempts, setResendAttempts] = useState(0); // Track resend attempts
  const [resendTimeout, setResendTimeout] = useState(null); // Manage resend timeout
  const router = useRouter();

  useEffect(() => {
    // Clean up resend timeout if component unmounts
    return () => {
      if (resendTimeout) {
        clearTimeout(resendTimeout);
      }
    };
  }, [resendTimeout]);

  const handleRegister = async (event) => {
    event.preventDefault();
    const { name, email, password } = formData;

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        setRegistrationStatus('pending'); // Set registration status to pending
        setMessage('Registration successful! Please check your email to verify your account.');
      } else {
        setMessage(result.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

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
        localStorage.setItem('token', result.token); // Assuming the token is returned in the response
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

  const handleSignUpClick = () => setShowForm('register');
  const handleLoginClick = () => setShowForm('login');

  const handleResendVerification = async () => {
    if (resendAttempts >= 2) {
      setMessage('You can only resend the verification email twice.');
      return;
    }

    try {
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();
      if (response.ok) {
        setResendAttempts(prev => prev + 1);
        setMessage('Verification email resent. Please check your inbox.');
        // Set a timeout to manage resend limit (1 minute)
        const timeout = setTimeout(() => setResendAttempts(0), 60000);
        setResendTimeout(timeout);
      } else {
        setMessage(result.message || 'Failed to resend verification email');
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  return (
    <div className={styles.home}>
      <h1>Welcome to EMPIRE-X</h1>
      {message && <p>{message}</p>}
      {!showForm ? (
        <div>
          <button onClick={handleSignUpClick}>Create Account</button>
          <button onClick={handleLoginClick}>Already Have an account? Login</button>
        </div>
      ) : showForm === 'register' ? (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Register</button>
          </form>
          {registrationStatus === 'pending' && (
            <div>
              <p>If you didn't receive the email, you can resend it:</p>
              <button onClick={handleResendVerification} disabled={resendAttempts >= 2}>
                {resendAttempts >= 2 ? 'Resend limit reached' : 'Resend Verification Email'}
              </button>
            </div>
          )}
          <button onClick={() => setShowForm(null)}>Back</button>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Login</button>
          </form>
          <button onClick={() => setShowForm(null)}>Back</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
