import Image from 'next/image';

import treeImage from '@/assets/login-tree.jpg';
import styles from '@/components/user/signup/signup.module.scss';

interface SignupLayoutProps {
  children: React.ReactNode;
}

function SignupLayout({ children }: SignupLayoutProps) {
  return (
    <div className={styles.container}>
      <section className={styles.image}>
        <Image src={treeImage} alt="tree image" fill />
      </section>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

export default SignupLayout;
