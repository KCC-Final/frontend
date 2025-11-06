import React from 'react';

import styles from '@/components/common/layout/main/main.module.scss';

interface MainLayoutProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

function MainLayout({ children, size = 'md' }: MainLayoutProps) {
  return (
    <div className={styles.container}>
      {size === 'lg' ? (
        <main className={styles.wide}>{children}</main>
      ) : size === 'md' ? (
        <main className={styles.basic}>{children}</main>
      ) : (
        <main className={styles.small}>{children}</main>
      )}
    </div>
  );
}

export default MainLayout;
