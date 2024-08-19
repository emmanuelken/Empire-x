import Link from 'next/link';
import styles from '@/styles/Header.module.css'; // If you have styles for the header

export default function Header() {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navList}>
          <li><Link href="/">EMPIRE-X</Link></li>
          <li><Link href="/assetts">ASSETS</Link></li>
          <li><Link href="/support">SUPPORT</Link></li>
          <li><Link href="/contact">FAQs</Link></li>
        </ul>
      </nav>
    </header>
  );
}
