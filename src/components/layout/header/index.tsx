import styles from '@/components/layout/header/header.module.scss';
import LeftNavigation from '@/components/layout/header/left';
import RightNavigation from '@/components/layout/header/right';

function HeaderLayout() {
  return (
    <section className={styles.container}>
      <header className={styles.gnb}>
        <LeftNavigation />
        <RightNavigation />
      </header>
    </section>
  );
}

export default HeaderLayout;
