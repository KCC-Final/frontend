import Link from 'next/link';

import styles from '@/components/layout/header/header.module.scss';

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
          <Link href="/my-library">내 서재</Link>
        </li>
        <li>
          <Link href="/groups">독서 모임</Link>
        </li>
      </ul>
    </nav>
  );
}

export default LeftNavigation;
