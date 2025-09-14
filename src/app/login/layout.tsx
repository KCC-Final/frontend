import styles from '@/components/user/login.module.scss';

interface LoginLayoutProps {
  children: React.ReactNode;
}

function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className={styles.container}>
      <section className={styles.image}>왼쪽 이미지 영역입니다.</section>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

export default LoginLayout;
