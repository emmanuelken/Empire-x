'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent, isAdminRoute = false) => {
  const AuthComponent = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login'); // Redirect to login page if no token is found
        return;
      }

      const verifyToken = async () => {
        try {
          const res = await fetch('/api/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();

            if (isAdminRoute && data.role !== 'admin') {
              router.push('/'); // Redirect to the homepage if not an admin
              return;
            }

            setLoading(false); // Set loading to false to render the component
          } else if (res.status === 401 || res.status === 403) {
            router.push('/login'); // Redirect to login if unauthorized
          } else {
            router.push('/'); // Redirect to homepage on other errors
          }
        } catch (error) {
          console.error('Failed to verify token:', error);
          router.push('/'); // Redirect to homepage on error
        }
      };

      verifyToken();
    }, [router]); // Removed `isAdminRoute` from dependencies

    if (loading) {
      return <p>Loading...</p>; // Show loading message until verification is complete
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
