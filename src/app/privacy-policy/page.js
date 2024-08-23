import Link from 'next/link';

export default function Privacy() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Read Our Policies Here</h1>
      <Link href="/dashboard">
        <span style={{ color: 'orange', textDecoration: 'underline' }}>
          BACK TO DASHBOARD
        </span>
      </Link>
    </div>
  );
}
