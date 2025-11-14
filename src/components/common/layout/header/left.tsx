'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from '@/components/common/layout/header/header.module.scss';

function LeftNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: '도서 추천', href: '/' },
    { name: '독후감 피드', href: '/reviews/feed' },
    { name: '독서 모임', href: '/groups' },
    { name: '대시보드', href: '/dashboard' }
  ];

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        그루
      </Link>
      <ul className={styles.pages}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <li key={item.href}>
              <Link href={item.href} className={`${styles.link} ${isActive ? styles.active : ''}`}>
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default LeftNavigation;
