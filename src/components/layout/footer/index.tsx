import styles from '@/components/layout/footer/footer.module.scss';

function Footer() {
  return (
    <section className={styles.container}>
      <footer className={styles.footer}>
        <h1>그루</h1>
        <nav>
          <h2>교육기관</h2>
          <ul>
            <li>
              <a href="https://www.sw.or.kr">한국소프트웨어산업협회</a>
            </li>
            <li>
              <a href="http://www.kcc.co.kr">KCC정보통신</a>
            </li>
          </ul>
        </nav>
        <nav>
          <h2>깃허브</h2>
          <ul>
            <li>
              <a href="https://github.com/KCC-Final">TreeVerse</a>
            </li>
            <li>
              <a href="https://github.com/YunSung-Choi97">최윤성</a>
            </li>
            <li>
              <a href="https://github.com/y2on5oo">김연수</a>
            </li>
            <li>
              <a href="https://github.com/umyunho">엄윤호</a>
            </li>
          </ul>
        </nav>
        <div>©Groo. All rights reserved.</div>
      </footer>
    </section>
  );
}

export default Footer;
