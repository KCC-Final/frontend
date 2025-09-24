'use client';

import { useEffect, useState } from 'react';

import type { Step } from '@/components/user/signup/index';
import styles from '@/components/user/signup/signup.module.scss';
import { validate } from '@/utils/validation';

import type { Dispatch, SetStateAction, ChangeEventHandler } from 'react';

interface SignupStep1Props {
  setStep: Dispatch<SetStateAction<Step>>;
  name: string;
  changeName: ChangeEventHandler<HTMLInputElement>;
  gender: string;
  changeGender: ChangeEventHandler<HTMLInputElement>;
  birthYear: string;
  changeBirthYear: ChangeEventHandler<HTMLSelectElement>;
  birthMonth: string;
  changeBirthMonth: ChangeEventHandler<HTMLSelectElement>;
  birthDay: string;
  changeBirthDay: ChangeEventHandler<HTMLSelectElement>;
  setBirthDay: Dispatch<SetStateAction<string>>;
  checkService: boolean;
  changeCheckService: ChangeEventHandler<HTMLInputElement>;
  setCheckService: Dispatch<SetStateAction<boolean>>;
  checkPrivacy: boolean;
  changeCheckPrivacy: ChangeEventHandler<HTMLInputElement>;
  setCheckPrivacy: Dispatch<SetStateAction<boolean>>;
}

const GENDER_OPTIONS = [
  { value: 'm', label: '남자' },
  { value: 'f', label: '여자' }
];

function SignupStep3({
  setStep,
  name,
  changeName,
  gender,
  changeGender,
  birthYear,
  changeBirthYear,
  birthMonth,
  changeBirthMonth,
  birthDay,
  changeBirthDay,
  setBirthDay,
  checkService,
  changeCheckService,
  setCheckService,
  checkPrivacy,
  changeCheckPrivacy,
  setCheckPrivacy
}: SignupStep1Props) {
  // 회원가입 입력 폼의 value에 사용할 값과 onChange에 사용할 함수

  const [checkAll, setCheckAll] = useState(false);

  // 선택할 년, 월, 일 생성
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const [daysInMonth, setDaysInMonth] = useState<string[]>([]);

  /**
   * 전체 동의 체크박스 클릭시 동작할 함수
   */
  const changeCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckAll(event.target.checked);
    setCheckService(event.target.checked);
    setCheckPrivacy(event.target.checked);
  };

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
        setBirthDay('');
      }
    } else {
      setDaysInMonth([]);
    }
  }, [birthYear, birthMonth]);

  // 개별 체크박스 상태가 변하면 전체 체크박스 상태 수정
  useEffect(() => {
    if (checkService && checkPrivacy) {
      if (!checkAll) {
        setCheckAll(true);
      }
    } else {
      if (checkAll) {
        setCheckAll(false);
      }
    }
  }, [checkService, checkPrivacy]);

  // 회원가입 요청 전 이름, 성별, 생년월일, 약관 동의 확인
  useEffect(() => {
    if (!validate.name(name).result) {
      setStep({ value: 3, canNextStep: false, reason: validate.name(name).message });
      return;
    } else if (!validate.gender(gender).result) {
      setStep({ value: 3, canNextStep: false, reason: validate.gender(gender).message });
      return;
    } else if (!validate.birth(birthYear, birthMonth, birthDay).result) {
      setStep({
        value: 3,
        canNextStep: false,
        reason: validate.birth(birthYear, birthMonth, birthDay).message
      });
      return;
    } else if (!(checkPrivacy && checkService)) {
      setStep({
        value: 3,
        canNextStep: false,
        reason: '필수 약관에 모두 동의해야 합니다.'
      });
      return;
    } else {
      setStep({ value: 3, canNextStep: true, reason: '' });
    }
  }, [name, gender, birthYear, birthMonth, birthDay, checkPrivacy, checkService]);

  return (
    <>
      <div className={styles.name}>
        <div>이름</div>
        <input
          type="text"
          name="name"
          value={name}
          onChange={changeName}
          placeholder="이름을 입력해주세요."
        />
      </div>
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
                onChange={changeGender}
                hidden
              />
              <span className={`${gender === option.value ? styles.checked : ''}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className={styles.birth}>
        <div>생년월일</div>
        <div className={styles.select}>
          <select name="year" value={birthYear} onChange={changeBirthYear}>
            <option value="">년</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select name="month" value={birthMonth} onChange={changeBirthMonth}>
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
            onChange={changeBirthDay}
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
            <input type="checkbox" checked={checkAll} onChange={changeCheckAll} />
            <span>전체 동의</span>
          </label>
          <div className={styles.individual}>
            <label>
              <input type="checkbox" checked={checkService} onChange={changeCheckService} />
              <span>서비스 이용약관 동의 (필수)</span>
            </label>
            <label>
              <input type="checkbox" checked={checkPrivacy} onChange={changeCheckPrivacy} />
              <span>개인정보 수집 및 이용 동의 (필수)</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupStep3;
