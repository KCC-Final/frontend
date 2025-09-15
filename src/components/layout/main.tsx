import React from 'react';

import styles from './main.module.scss';

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <section className={styles.container}>
      <main className={styles.main}>{children}</main>
    </section>
  );
}

export default MainLayout;
