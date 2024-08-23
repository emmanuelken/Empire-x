'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <nav>
        <button className={styles.navToggle} onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`${styles.navList} ${menuOpen ? styles.open : ''}`}>
          <li><Link href="/">EMPIRE-X</Link></li>
          <li><Link href="/assetts">ASSETS</Link></li>
          <li><Link href="/support">SUPPORT</Link></li>
          <li><Link href="/contact">FAQs</Link></li>
        </ul>
      </nav>
    </header>
  );
}
