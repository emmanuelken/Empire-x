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
        router.push('/'); // Redirect to login page if no token is found
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
              router.push('/login'); // Redirect if not an admin
              return;
            }

            setLoading(false); // Set loading to false to render the component
          } else {
            router.push('/login'); // Redirect to login if verification fails
          }
        } catch (error) {
          console.error('Failed to verify token:', error);
          router.push('/'); // Redirect to login on error
        }
      };

      verifyToken();
    }, [router, isAdminRoute]);

    if (loading) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
