import Link from 'next/link';

import styles from './header.module.scss';

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
        <div className={styles.user}>
          <button>알림</button>
          <button>회원</button>
        </div>
      </header>
    </section>
  );
}

export default HeaderLayout;
