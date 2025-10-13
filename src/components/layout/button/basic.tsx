import clsx from 'clsx';

import styles from '@/components/layout/button/button.module.scss';

interface BasicButtonProps {
  name: string;
  buttonType?: 'submit' | 'reset' | 'button';
  handler?: () => void;
  classname?: string;
  width?: 'grow' | 'auto';
  height?: '48' | '36' | 'auto';
  bgColor?: string;
  disabled?: boolean;
}

function BasicButton({
  name,
  buttonType = 'button',
  handler,
  classname,
  width = 'auto',
  height = 'auto',
  bgColor = 'green',
  disabled = false
}: BasicButtonProps) {
  return (
    <button
      type={buttonType}
      onClick={handler}
      className={clsx(styles.basic, classname, {
        [styles.grow]: width === 'grow',
        [styles.lg]: height === '48',
        [styles.md]: height === '36',
        [styles.green]: bgColor === 'green',
        [styles.gray]: bgColor === 'gray',
        [styles.disabled]: disabled === true
      })}>
      {name}
    </button>
  );
}

export default BasicButton;
