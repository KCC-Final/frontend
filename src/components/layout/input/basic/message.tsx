import clsx from 'clsx';

import styles from '@/components/layout/input/input.module.scss';

interface BasicInputMessageProps {
  message: string;
  status: boolean | null;
}

function BasicInputMessage({ message, status }: BasicInputMessageProps) {
  return (
    <>
      {message && (
        <div
          className={clsx(styles.message, {
            [styles.success]: status === true,
            [styles.fail]: status === false
          })}>
          {message}
        </div>
      )}
    </>
  );
}

export default BasicInputMessage;
