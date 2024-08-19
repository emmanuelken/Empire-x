import Link from 'next/link';

export default function Support() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Contact Support</h1>
      <Link href="/dashboard">
        <span style={{ color: 'blue', textDecoration: 'underline' }}>
          Go back to dashboard
        </span>
      </Link>
    </div>
  );
}
