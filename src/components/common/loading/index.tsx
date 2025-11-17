import clsx from 'clsx';

import styles from '@/components/common/loading/loading.module.scss';

interface PageLoadingProps {
  isLoading?: boolean;
}

function PageLoading({ isLoading = true }: PageLoadingProps) {
  return (
    <section className={clsx(styles.loading, { [styles.hidden]: !isLoading })}>
      <div className={styles.spinner} />
      <p>로딩 중...</p>
    </section>
  );
}

export default PageLoading;
