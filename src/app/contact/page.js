import Link from 'next/link';

export default function Contact() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Have a Question?</h1>
      <p>Contact Us</p>
      <Link href="/dashboard">
        <span style={{ color: 'orange', textDecoration: 'underline' }}>
          BACK TO DASHBOARD
        </span>
      </Link>
    </div>
  );
}

  