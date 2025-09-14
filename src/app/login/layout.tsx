import Image from 'next/image';

import treeImage from '@/assets/login-tree.jpg';
import styles from '@/components/user/login.module.scss';

interface LoginLayoutProps {
  children: React.ReactNode;
}

function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className={styles.container}>
      <section className={styles.image}>
        <Image src={treeImage} alt="tree image" fill />
      </section>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

export default LoginLayout;
