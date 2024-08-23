import Link from 'next/link';
import styles from '@/styles/Footer.module.css'; // If you have styles for the footer

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav>
        <ul className={styles.navList}>
          <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          <li><Link href="/terms">Terms of Service</Link></li>
          <li><Link href="/admin/dashboard">Empire</Link></li>
        </ul>
      </nav>
    </footer>
  );
}
