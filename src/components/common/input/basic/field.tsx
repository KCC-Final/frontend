'use client';

import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import styles from '@/components/common/input/input.module.scss';

interface BasicInputFieldProps {
  classname?: string;
  inputType: string;
  inputPlaceholder?: string;
  inputValue?: string;
  inputChange?: React.ChangeEventHandler<HTMLInputElement>;
  additionalButton?: React.ReactNode;
  isError?: boolean;
}

function BasicInputField({
  classname,
  inputType,
  inputPlaceholder,
  inputValue,
  inputChange,
  additionalButton,
  isError = false
}: BasicInputFieldProps) {
  // 비밀번호 보일지 여부
  const [showPassword, setShowPassword] = useState(false);

  // 비밀번호 표시 토클 아이콘
  const passwordToggleHandler = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={clsx(styles.input_field, classname, { [styles.error]: isError })}>
      <input
        type={inputType !== 'password' ? inputType : showPassword ? 'text' : 'password'}
        placeholder={inputPlaceholder}
        value={inputValue}
        onChange={inputChange}
      />
      {inputType === 'password' && inputValue && (
        <button type="button" onClick={passwordToggleHandler}>
          {showPassword ? <EyeOff size="20" color="#555555" /> : <Eye size="20" color="#555555" />}
        </button>
      )}
      {additionalButton}
    </div>
  );
}

export default BasicInputField;
