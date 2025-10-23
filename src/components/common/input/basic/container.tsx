import clsx from 'clsx';

import styles from '@/components/common/input/input.module.scss';

interface BasicInputContainerProps {
  containerClassName?: string;
  labelName?: string;
  children: React.ReactNode;
}

function BasicInputContainer({ containerClassName, labelName, children }: BasicInputContainerProps) {
  return (
    <div className={clsx(styles.basic, containerClassName)}>
      {labelName && <div className={styles.name}>{labelName}</div>}
      {children}
    </div>
  );
}

export default BasicInputContainer;
