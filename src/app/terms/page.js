import Link from 'next/link';

export default function Terms() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Our Terms Of Service</h1>
      <Link href="/dashboard">
        <span style={{ color: 'orange', textDecoration: 'underline' }}>
          BACK TO DASHBOARD
        </span>
      </Link>
    </div>
  );
}
