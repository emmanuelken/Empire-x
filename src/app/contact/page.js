import Link from 'next/link';

export default function Contact() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Our Contacts</h1>
      <p>Contact Us</p>
      <Link href="/dashboard">
        <span style={{ color: 'blue', textDecoration: 'underline' }}>
          Go back to dashboard
        </span>
      </Link>
    </div>
  );
}

  