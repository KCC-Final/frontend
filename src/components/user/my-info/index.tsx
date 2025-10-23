'use client';

import clsx from 'clsx';
import { Pencil, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { fetchGroo } from '@/apis';
import BasicButton from '@/components/common/button/basic';
import BasicInputContainer from '@/components/common/input/basic/container';
import BasicInputField from '@/components/common/input/basic/field';
import BasicInputMessage from '@/components/common/input/basic/message';
import styles from '@/components/user/my-info/my-info.module.scss';
import { useInputText } from '@/hooks/useInput';
import useBoundStore from '@/stores';
import { devLogger } from '@/utils/dev-logger';
import { ApiError } from '@/utils/error/api';
import { changeImageUrlFromBase64 } from '@/utils/format/base64';
import { validate } from '@/utils/validation/signup';

function MyInfo() {
  // 전역 상태에서 내 정보 및 설정 함수 불러오기
  const { myInfo, setMyInfo } = useBoundStore(
    useShallow((state) => ({ myInfo: state.myInfo, setMyInfo: state.setMyInfo }))
  );

  // 수정 모드 상태
  const [isEditMode, setEditMode] = useState({ edit: false, password: false, email: false });

  // 파일 입력 참조, 선택한 파일 및 미리보기 URL 상태
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(changeImageUrlFromBase64(''));

  // 수정가능한 input 필드 상태
  const [nickname, changeNickname, setNickname] = useInputText('');
  const [introduction, changeIntroduction, setIntroduction] = useInputText('');
  const [password1, changePassword1, setPassword1] = useInputText('');
  const [password2, changePassword2, setPassword2] = useInputText('');
  const [email, changeEmail, setEmail] = useInputText('');
  const [emailVerificationCode, changeEmailVerificationCode, setEmailVerificationCode] = useInputText('');

  // 이메일 인증 상태
  const [emailVerification, setEmailVerification] = useState<{ status: boolean | null; email: string }>({
    status: null,
    email: ''
  });

  /** 수정모드에서 이미지 클릭 시 파일 선택 */
  const selectFileHandler = () => {
    if (isEditMode.edit) fileInputRef.current?.click();
  };

  /** 파일 선택 시 미리보기 */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // 선택한 파일이 있는 경우 파일 객체 상태에 저장
      const file = event.target.files[0];
      setSelectedFile(file);

      // 이미 미리보기가 설정된 경우 URL 해제
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      // 새로 선택한 파일로부터 미리보기 URL 생성 및 상태에 저장
      setPreviewUrl(URL.createObjectURL(file));
      devLogger(`선택한 파일: ${file.name}`);
    }
  };

  /** 비밀번호 수정 모드 설정 */
  const setPasswordEditMode = (status: boolean) => () => {
    if (status) {
      setEditMode((prev) => ({ ...prev, password: true }));
    } else {
      setPassword1('');
      setPassword2('');
      setEditMode((prev) => ({ ...prev, password: false }));
    }
  };

  /** 이메일 수정 모드 설정 */
  const setEmailEditMode = (status: boolean) => () => {
    if (status) {
      setEditMode((prev) => ({ ...prev, email: true }));
    } else {
      setEmail(myInfo!.email);
      setEmailVerificationCode('');
      setEmailVerification({ status: null, email: '' });
      setEditMode((prev) => ({ ...prev, email: false }));
    }
  };

  /** 이메일 인증코드 전송 요청 */
  const sendVerificationCode = async () => {
    if (!validate.email(email).result) {
      alert(validate.email(email).message);
      return;
    }
    try {
      const result = await fetchGroo.user.sendEmailCode({ purpose: 'updateEmail', email: email });
      alert(`${email}로 인증코드를 전송하였습니다.`);
      devLogger(`${email}로 인증코드 ${result.data}를 전송하였습니다.`);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '인증코드 전송에 실패하였습니다.';
      alert(message);
    }
  };

  /** 이메일 인증확인 요청 */
  const verifyEmailCode = async () => {
    try {
      const result = await fetchGroo.user.verifyEmail({
        purpose: 'updateEmail',
        email: email,
        code: emailVerificationCode
      });

      if (email === result.data) {
        setEmailVerification({ status: true, email: email });
        alert(`이메일 ${email}는 인증에 성공했습니다.`);
      } else {
        setEmailVerification({ status: false, email: result.data });
        alert('현재 작성하신 email과 인증한 이메일이 일치하지 않습니다.');
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '이메일 인증에 실패하였습니다.';
      alert(message);
    }
  };

  /** 수정 버튼 */
  const editHandler = () => {
    setEditMode({ edit: true, password: false, email: false });
  };

  /** 취소 버튼 */
  const cancelHandler = () => {
    setEditMode({ edit: false, password: false, email: false });
    setNickname(myInfo!.nickname);
    setIntroduction(myInfo!.introduction || '');
    setPassword1('');
    setPassword2('');
    setEmail(myInfo!.email);
    setEmailVerificationCode('');
    setSelectedFile(null);
    setPreviewUrl(changeImageUrlFromBase64(myInfo!.profileImage));
  };

  const submitHandler = async () => {
    // 닉네임 검증
    if (nickname !== myInfo!.nickname && !validate.nickname(nickname).result) {
      alert(validate.nickname(nickname).message);
      return;
    }
    // 비밀번호1 검증
    if (password1 && !validate.password(password1).result) {
      alert(validate.password(password1).message);
      return;
    }
    // 비밀번호2 검증
    if (password2 && !validate.passwordConfirm(password1, password2).result) {
      alert(validate.passwordConfirm(password1, password2).message);
      return;
    }
    // 이메일 검증
    if (email !== myInfo!.email && (emailVerification.status !== true || emailVerification.email !== email)) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    // 모든 검증이 완료된 경우 수정 요청
    const formData = new FormData();

    // TODO: 이미지 formData 처리 로직 수정 필요 (기존 파일 유지, 파일 삭제 등)
    const updateRequestData = {
      profileImage: '',
      nickname: nickname !== myInfo!.nickname ? nickname : '',
      introduction: introduction !== (myInfo!.introduction || '') ? introduction : '',
      password1: password1,
      password2: password2,
      email: email !== myInfo!.email ? email : '',
      name: ''
    };
    formData.append(
      'updateRequest',
      new Blob([JSON.stringify(updateRequestData)], { type: 'application/json' })
    );
    if (selectedFile) {
      formData.append('profileImage', selectedFile, selectedFile.name);
    }

    try {
      const result = await fetchGroo.user.editMyInfo(formData);
      alert('회원 정보가 성공적으로 수정되었습니다.');
      setMyInfo(result.data);
      setEditMode({ edit: false, password: false, email: false });
    } catch (error) {
      alert('회원 정보 수정에 실패하였습니다.');
      devLogger(error);
    }
  };

  useEffect(() => {
    setNickname(myInfo?.nickname || '');
    setIntroduction(myInfo?.introduction || '');
    setEmail(myInfo?.email || '');
  }, []);

  const viewImageUrl = previewUrl || changeImageUrlFromBase64(myInfo?.profileImage);

  return (
    <section className={styles.container}>
      {/* 프로필 영역 */}
      <div>
        <h2 className={styles.title}>프로필</h2>
        <div className={styles.profile_section}>
          <div
            className={clsx(styles.profile_image_wrapper, { [styles.editable]: isEditMode.edit })}
            onClick={selectFileHandler}>
            {viewImageUrl ? (
              <Image
                src={viewImageUrl}
                alt={`${myInfo?.nickname}님의 프로필 이미지`}
                width={120}
                height={120}
              />
            ) : (
              <UserIcon size={60} color="#777777" />
            )}
            {isEditMode.edit && (
              <div className={styles.edit_icon_overlay}>
                <Pencil size={32} color="#ffffff" />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              hidden={true}
            />
          </div>
          <div className={styles.profile_details}>
            {isEditMode.edit ? (
              <BasicInputField
                inputType="text"
                inputPlaceholder="닉네임을 입력해주세요."
                inputValue={nickname}
                inputChange={changeNickname}
                isError={!!nickname && !validate.nickname(nickname).result}
              />
            ) : (
              <p className={styles.nickname}>{myInfo?.nickname}</p>
            )}
            {isEditMode.edit ? (
              <BasicInputField
                inputType="text"
                inputPlaceholder="나를 표현할 한 줄 자기소개를 추가해주세요."
                inputValue={introduction}
                inputChange={changeIntroduction}
              />
            ) : (
              <p className={styles.introduction}>
                {myInfo?.introduction || '나를 표현할 한 줄 자기소개를 추가해주세요.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 계정 정보 영역 */}
      <div className={styles.info_section}>
        <h2 className={styles.title}>계정 정보</h2>
        <div className={styles.info_table}>
          <div className={styles.info_row}>
            <span className={styles.label}>아이디</span>
            <span className={styles.value}>
              <span>{myInfo?.userId}</span>
            </span>
          </div>
          <div className={styles.info_row}>
            <span className={styles.label}>비밀번호</span>
            <span className={styles.value}>
              {isEditMode.edit ? (
                isEditMode.password ? (
                  <>
                    <BasicInputContainer>
                      <BasicInputField
                        inputType="password"
                        inputPlaceholder="비밀번호를 입력해주세요."
                        inputValue={password1}
                        inputChange={changePassword1}
                        isError={!!password1 && !validate.password(password1).result}
                      />
                      {password1 && (
                        <BasicInputMessage message={validate.password(password1).message} status={false} />
                      )}
                    </BasicInputContainer>
                    <BasicInputContainer>
                      <BasicInputField
                        inputType="password"
                        inputPlaceholder="비밀번호를 다시 한번 입력해주세요."
                        inputValue={password2}
                        inputChange={changePassword2}
                        isError={!!password2 && !validate.passwordConfirm(password1, password2).result}
                      />
                      {password2 && (
                        <BasicInputMessage
                          message={validate.passwordConfirm(password1, password2).message}
                          status={false}
                        />
                      )}
                    </BasicInputContainer>
                    <BasicButton name="취소" bgColor="gray" handler={setPasswordEditMode(false)} />
                  </>
                ) : (
                  <>
                    <span>●●●●●●●●</span>
                    <BasicButton name="수정" handler={setPasswordEditMode(true)} />
                  </>
                )
              ) : (
                <span>●●●●●●●●</span>
              )}
            </span>
          </div>
          <div className={styles.info_row}>
            <span className={styles.label}>이메일</span>
            <span className={styles.value}>
              {isEditMode.edit ? (
                isEditMode.email ? (
                  <>
                    <BasicInputContainer>
                      <BasicInputField
                        inputType="email"
                        inputPlaceholder="이메일을 입력해주세요."
                        inputValue={email}
                        inputChange={changeEmail}
                        additionalButton={<BasicButton name="인증요청" handler={sendVerificationCode} />}
                      />
                    </BasicInputContainer>
                    <BasicInputContainer>
                      <BasicInputField
                        inputType="text"
                        inputPlaceholder="인증코드를 입력해주세요."
                        inputValue={emailVerificationCode}
                        inputChange={changeEmailVerificationCode}
                        additionalButton={<BasicButton name="확인" handler={verifyEmailCode} />}
                      />
                    </BasicInputContainer>
                    <BasicButton name="취소" bgColor="gray" handler={setEmailEditMode(false)} />
                  </>
                ) : (
                  <>
                    <span>{myInfo?.email}</span>
                    <BasicButton name="수정" handler={setEmailEditMode(true)} />
                  </>
                )
              ) : (
                <span>{myInfo?.email}</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 사용자 정보 영역 */}
      <div className={styles.info_section}>
        <h2 className={styles.title}>사용자 정보</h2>
        <div className={styles.info_table}>
          <div className={styles.info_row}>
            <span className={styles.label}>이름</span>
            <span className={styles.value}>
              <span>{myInfo?.name}</span>
            </span>
          </div>
          <div className={styles.info_row}>
            <span className={styles.label}>성별</span>
            <span className={styles.value}>
              <span>{myInfo?.gender === 'm' ? '남성' : '여성'}</span>
            </span>
          </div>
          <div className={styles.info_row}>
            <span className={styles.label}>생년월일</span>
            <span className={styles.value}>
              <span>{myInfo?.birth}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.action_buttons}>
        {isEditMode.edit ? (
          <>
            <BasicButton name="수정취소" height="36" bgColor="gray" handler={cancelHandler} />
            <BasicButton name="수정완료" height="36" handler={submitHandler} />
          </>
        ) : (
          <BasicButton name="회원 정보 수정" height="36" handler={editHandler} />
        )}
      </div>
    </section>
  );
}

export default MyInfo;
