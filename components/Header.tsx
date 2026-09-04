'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import styles from './Header.module.css';

const NAV = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' }
];

export default function Header() {
  const pathname = usePathname();
  const { lines: allLines } = useCart();
  // Matches the basket page's own definition: a line with no size picked yet isn't
  // really "in the basket", so it shouldn't count here either — otherwise the badge
  // can show 1 while the basket page (correctly) says it's empty.
  const lines = allLines.filter((l) => !!l.size);
  const { session, initials } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === '/';
  const onCreatePage = pathname?.startsWith('/create-your-own');

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  return (
    <header className={styles.bar}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <Logo />
        </div>

        <div className={styles.right}>
          {!onCreatePage && (
            <div className={`${styles.ctaWrap} ${scrolled ? styles.show : ''}`}>
              <Link href="/create-your-own" className="btn btn-lime btn-sm">
                Create your own
              </Link>
            </div>
          )}

          <nav className={styles.nav} aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href={session ? '/account' : '/sign-in'}
            className={`${styles.iconBtn} ${session ? styles.avatar : ''}`}
            aria-label={session ? 'My account' : 'Sign in'}
          >
            {session ? initials : <PersonIcon />}
          </Link>

          <Link href="/basket" className={styles.iconBtn} aria-label="Basket">
            <BasketIcon />
            {lines.length > 0 && <span className={styles.badge}>{lines.length}</span>}
          </Link>

          <button
            className={styles.burger}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <div className={`${styles.mobileNav} ${mobileOpen ? styles.open : ''}`}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? styles.active : ''}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        {!onCreatePage && (
          <Link href="/create-your-own" onClick={() => setMobileOpen(false)}>
            Create your own
          </Link>
        )}
      </div>
    </header>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function BasketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
