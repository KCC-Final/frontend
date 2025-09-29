import { StateCreator } from 'zustand';

import { SignupSlice, SignupState } from '@/types';
import { validateSignupStep1, validateSignupStep2, validateSignupStep3 } from '@/utils/validation/signup';

const initialSignupState: SignupState = {
  signupStep: 1,
  signupInputField: {
    userId: '',
    password1: '',
    password2: '',
    nickname: '',
    email: '',
    emailVerificationCode: '',
    name: '',
    gender: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    isCheckedAllTerms: false,
    isCheckedService: false,
    isCheckedPrivacy: false
  },
  signupIdVerification: {
    isLoading: false,
    isSuccess: null,
    userId: '',
    message: ''
  },
  signupEmailVerification: {
    isLoading: false,
    isSuccess: null,
    email: '',
    message: ''
  }
};

export const createSignupSlice: StateCreator<SignupSlice> = (set, get) => ({
  ...initialSignupState,

  setSignupStep: (step) => set({ signupStep: step }),

  setSignupInputField: (field, value) =>
    set((state) => ({
      signupInputField: {
        ...state.signupInputField,
        [field]: value
      }
    })),

  setSignupIdVerification: (idVerification) => set({ signupIdVerification: idVerification }),

  setSignupEmailVerification: (emailVerification) => set({ signupEmailVerification: emailVerification }),

  signupValidateAndVerifyField: () => {
    const { signupStep, signupInputField, signupIdVerification, signupEmailVerification } = get();

    switch (signupStep) {
      case 1: {
        const { userId, password1, password2, nickname } = signupInputField;

        return validateSignupStep1(userId, signupIdVerification, password1, password2, nickname);
      }

      case 2: {
        const { email } = signupInputField;

        return validateSignupStep2(email, signupEmailVerification);
      }

      case 3: {
        const { name, gender, birthYear, birthMonth, birthDay, isCheckedService, isCheckedPrivacy } =
          signupInputField;

        return validateSignupStep3(
          name,
          gender,
          birthYear,
          birthMonth,
          birthDay,
          isCheckedService,
          isCheckedPrivacy
        );
      }

      default:
        return { isSuccess: false, message: '알 수 없는 단계입니다.' };
    }
  },

  resetSignupState: () => set(initialSignupState)
});
