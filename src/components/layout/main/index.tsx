import React from 'react';

import styles from '@/components/layout/main/main.module.scss';

interface MainLayoutProps {
  children: React.ReactNode;
  wide?: boolean;
}

function MainLayout({ children, wide = false }: MainLayoutProps) {
  return (
    <div className={styles.container}>
      {wide ? (
        <main className={styles.wide}>{children}</main>
      ) : (
        <main className={styles.basic}>{children}</main>
      )}
    </div>
  );
}

export default MainLayout;
