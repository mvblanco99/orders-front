import { ref } from 'vue';
import { defineStore } from 'pinia';
import type {
  RequestPassword,
  VerifyCode,
  ResetPassword,
} from '../interfaces/resetPasswordInterface';

export const useResetPasswordStore = defineStore('resetPassword', () => {
  const requestPasswordForm = ref<RequestPassword>({
    email: '',
  });
  const verifyCodeForm = ref<VerifyCode>({
    email: '',
    code: '',
  });
  const resetPasswordForm = ref<ResetPassword>({
    sessionToken: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Action to set the session token
  const setSessionToken = (token: string) => {
    resetPasswordForm.value.sessionToken = token;
  };

  const clearRequestPasswordForm = () => {
    requestPasswordForm.value = {
      email: '',
    };
  };
  const clearVerifyCodeForm = () => {
    verifyCodeForm.value = {
      email: '',
      code: '',
    };
  };
  const clearResetPasswordForm = () => {
    resetPasswordForm.value = {
      sessionToken: '',
      newPassword: '',
      confirmPassword: '',
    };
  };
  const clearAllForms = () => {
    clearRequestPasswordForm();
    clearVerifyCodeForm();
    clearResetPasswordForm();
  };
  return {
    // state
    requestPasswordForm,
    verifyCodeForm,
    resetPasswordForm,

    // actions
    setSessionToken,
    clearRequestPasswordForm,
    clearVerifyCodeForm,
    clearResetPasswordForm,
    clearAllForms,
  };
});
