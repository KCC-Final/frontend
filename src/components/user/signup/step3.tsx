'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import BasicInputContainer from '@/components/layout/input/basic/container';
import BasicInputField from '@/components/layout/input/basic/field';
import styles from '@/components/user/signup/signup.module.scss';
import useBoundStore from '@/stores';
import { SignupInputFieldKey } from '@/types';

type ChangeInputEvent = React.ChangeEvent<HTMLInputElement>;
type ChangeSelectEvent = React.ChangeEvent<HTMLSelectElement>;

const GENDER_OPTIONS = [
  { value: 'm', label: '남자' },
  { value: 'f', label: '여자' }
];

function SignupStep3() {
  // 회원가입 저장소의 state 및 actions 불러오기
  const {
    name,
    gender,
    birthYear,
    birthMonth,
    birthDay,
    isCheckedAllTerms,
    isCheckedService,
    isCheckedPrivacy,
    setSignupInputField
  } = useBoundStore(
    useShallow((state) => ({
      name: state.signupInputField.name,
      gender: state.signupInputField.gender,
      birthYear: state.signupInputField.birthYear,
      birthMonth: state.signupInputField.birthMonth,
      birthDay: state.signupInputField.birthDay,
      isCheckedAllTerms: state.signupInputField.isCheckedAllTerms,
      isCheckedService: state.signupInputField.isCheckedService,
      isCheckedPrivacy: state.signupInputField.isCheckedPrivacy,
      setSignupInputField: state.setSignupInputField
    }))
  );

  /**
   * type = text인 input태그의 ChangeEventHandler
   */
  const changeInputHandler = (field: SignupInputFieldKey) => (event: ChangeInputEvent) => {
    setSignupInputField(field, event.target.value);
  };

  /**
   * type = checkbox인 input태그의 ChangeEventHandler
   */
  const changeCheckboxHandler = (field: SignupInputFieldKey) => (event: ChangeInputEvent) => {
    setSignupInputField(field, event.target.checked);
  };

  /**
   * select 태그의 ChangeEventHandler
   */
  const changeSelectHandler = (field: SignupInputFieldKey) => (event: ChangeSelectEvent) => {
    setSignupInputField(field, event.target.value);
  };

  /**
   * 전체 동의 체크박스 클릭시 동작할 ChangeEventHandler
   */
  const changeCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignupInputField('isCheckedAllTerms', event.target.checked);
    setSignupInputField('isCheckedService', event.target.checked);
    setSignupInputField('isCheckedPrivacy', event.target.checked);
  };

  // 선택할 년, 월, 일 생성
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const [daysInMonth, setDaysInMonth] = useState<string[]>([]);

  // 선택한 년, 월을 기준으로 일 목록 생성
  useEffect(() => {
    if (birthYear && birthMonth) {
      // 선택한 년, 월
      const yearNum = parseInt(birthYear);
      const monthNum = parseInt(birthMonth);

      // 선택한 년, 월의 마지막 일
      const days = new Date(yearNum, monthNum, 0).getDate();

      // 선택한 년, 월의 선택 가능한 일 할당
      const daysArray = Array.from({ length: days }, (_, i) => String(i + 1).padStart(2, '0'));
      setDaysInMonth(daysArray);

      // 월이 바뀌었을 때 기존에 선택한 '일'이 유효하지 않으면 초기화
      if (parseInt(birthDay) > days) {
        setSignupInputField('birthDay', '');
      }
    } else {
      setDaysInMonth([]);
    }
  }, [birthYear, birthMonth]);

  // 개별 체크박스 상태가 변하면 전체 체크박스 상태 수정
  useEffect(() => {
    if (isCheckedService && isCheckedPrivacy) {
      if (!isCheckedAllTerms) {
        setSignupInputField('isCheckedAllTerms', true);
      }
    } else {
      if (isCheckedAllTerms) {
        setSignupInputField('isCheckedAllTerms', false);
      }
    }
  }, [isCheckedService, isCheckedPrivacy]);

  return (
    <>
      <BasicInputContainer labelName="이름">
        <BasicInputField
          inputType="text"
          inputPlaceholder="이름을 입력해주세요."
          inputValue={name}
          inputChange={changeInputHandler('name')}
        />
      </BasicInputContainer>
      <div className={styles.gender}>
        <div>성별</div>
        <div className={styles.options}>
          {GENDER_OPTIONS.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={gender === option.value}
                onChange={changeInputHandler('gender')}
                hidden
              />
              <div className={clsx({ [styles.checked]: gender === option.value })}>{option.label}</div>
            </label>
          ))}
        </div>
      </div>
      <div className={styles.birth}>
        <div>생년월일</div>
        <div className={styles.select}>
          <select name="year" value={birthYear} onChange={changeSelectHandler('birthYear')}>
            <option value="">년</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select name="month" value={birthMonth} onChange={changeSelectHandler('birthMonth')}>
            <option value="">월</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            name="day"
            value={birthDay}
            onChange={changeSelectHandler('birthDay')}
            disabled={!birthYear || !birthMonth}>
            <option value="">일</option>
            {daysInMonth.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.agreements}>
        <div>약관동의</div>
        <div>
          <label className={styles.all}>
            <input type="checkbox" checked={isCheckedAllTerms} onChange={changeCheckAll} />
            <span>전체 동의</span>
          </label>
          <div className={styles.individual}>
            <label>
              <input
                type="checkbox"
                checked={isCheckedService}
                onChange={changeCheckboxHandler('isCheckedService')}
              />
              <span>서비스 이용약관 동의 (필수)</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={isCheckedPrivacy}
                onChange={changeCheckboxHandler('isCheckedPrivacy')}
              />
              <span>개인정보 수집 및 이용 동의 (필수)</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupStep3;
