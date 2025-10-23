import styles from '@/components/common/layout/header/header.module.scss';
import LeftNavigation from '@/components/common/layout/header/left';
import RightNavigation from '@/components/common/layout/header/right';

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
