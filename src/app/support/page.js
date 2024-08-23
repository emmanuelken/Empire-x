import Link from 'next/link';

export default function Support() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Contact Support</h1>
      <Link href="/dashboard">
        <span style={{ color: 'orange', textDecoration: 'underline' }}>
          BACK TO DASHBOARD
        </span>
      </Link>
    </div>
  );
}
