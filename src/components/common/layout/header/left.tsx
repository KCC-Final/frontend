import Link from 'next/link';

import styles from '@/components/common/layout/header/header.module.scss';

function LeftNavigation() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        그루
      </Link>
      <ul className={styles.pages}>
        <li>
          <Link href="/">도서 추천</Link>
        </li>
        <li>
          <Link href="/reviews/feed">피드</Link>
        </li>
        <li>
          <Link href="/groups">독서 모임</Link>
        </li>
        <li>
          <Link href="/dashboard">대시보드</Link>
        </li>
      </ul>
    </nav>
  );
}

export default LeftNavigation;
