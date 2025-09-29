'use client';

import styles from '@/components/user/signup/signup.module.scss';

interface SignupButtonProps {
  handler: () => void;
  name: string;
}

function SignupButton({ handler, name }: SignupButtonProps) {
  return (
    <div className={styles.submit}>
      <button type="button" onClick={handler}>
        {name}
      </button>
    </div>
  );
}

export default SignupButton;
