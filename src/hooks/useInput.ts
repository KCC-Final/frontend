import { useState } from 'react';

type useInputTextReturnType = [
  string,
  React.ChangeEventHandler<HTMLInputElement>,
  React.Dispatch<React.SetStateAction<string>>
];

/**
 * useState에서 얻은 value, setValue를 이용하여 changeValue를 만들어서 반환하는 함수.
 *
 * input 태그 사용할 때 많은 경우에 changeValue가 필요하기 때문에 반복을 줄이기 위해 생성.
 * @param initialValue 상태의 초기값 (useState('초기값')과 동일)
 * @returns [value, changeValue, setValue]: 초기값, 변경하는 이벤트 함수, 상태 변경 함수
 */
export const useInputText = (initialValue: string): useInputTextReturnType => {
  const [value, setValue] = useState(initialValue);
  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  return [value, changeValue, setValue];
};
