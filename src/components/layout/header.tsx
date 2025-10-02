'use client';

import { Bell, CircleUserRound, Search } from 'lucide-react';
import Link from 'next/link';

import styles from '@/components/layout/header.module.scss';

function HeaderLayout() {
  return (
    <section className={styles.container}>
      <header className={styles.gnb}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            그루
          </Link>
          <ul className={styles.pages}>
            <li>
              <Link href="/">도서 추천</Link>
            </li>
            <li>
              <Link href="/feeds">피드</Link>
            </li>
            <li>
              <Link href="/my-library">내 서재</Link>
            </li>
            <li>
              <Link href="/groups">독서 모임</Link>
            </li>
          </ul>
        </nav>
        <nav className={styles.function}>
          <Link href="/search" className={styles.search}>
            <span>검색어를 입력하세요</span>
            <span>
              <Search size="20px" color="#333333" />
            </span>
          </Link>
          <div className={styles.user}>
            <button>
              <Bell />
            </button>
            <button>
              <CircleUserRound />
            </button>
          </div>
        </nav>
      </header>
    </section>
  );
}

export default HeaderLayout;
