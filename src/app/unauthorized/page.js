// src/app/unauthorized/page.js
import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <Link href="/dashboard" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go back to dashboard
      </Link>
    </div>
  );
}
