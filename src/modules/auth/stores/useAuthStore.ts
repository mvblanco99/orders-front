import { ref } from 'vue';
import { defineStore } from 'pinia';
import { LocalStorage, Notify } from 'quasar';

import useHandlerErrors from '../../shared/composables/useHandlerErrors';
import type { User, LoginForm } from '../interfaces/auth';
import { getMe, validateJwt } from '../api/authApi';

const initialState = {
  loginForm: {
    email: '',
    password: '',
    remember: false,
  },
  token: '',
  permission: '',
};

export const useAuthStore = defineStore('auth', () => {
  const { handleApiResponseError } = useHandlerErrors();
  const loginForm = ref<LoginForm>({ ...initialState.loginForm });
  const user = ref<User | undefined>(undefined);
  const permission = ref<string>(initialState.permission);

  const clearLoginForm = () => {
    loginForm.value = { ...initialState.loginForm };
  };

  const clearUser = () => {
    user.value = undefined;
  };

  const clearPermissions = () => {
    permission.value = initialState.permission;
  };

  const logout = () => {
    clearUser();
    clearPermissions();
    LocalStorage.remove('jwt');
    Notify.create({
      message: 'Has cerrado sesión exitosamente.',
      type: 'positive',
    });
  };

  const checkUserJwt = async () => {
    const existingToken = LocalStorage.getItem<string>('jwt');
    try {
      const { token, jwt } = await validateJwt();
      const refreshedToken = [token, jwt, existingToken].find(
        (value): value is string =>
          typeof value === 'string' &&
          value.length > 0 &&
          value !== 'undefined' &&
          value !== 'null',
      );

      if (refreshedToken) {
        LocalStorage.set('jwt', refreshedToken);
      } else {
        LocalStorage.remove('jwt');
        throw new Error('Token inválido');
      }

      if (!user.value?.user.id) {
        const userData = await getMe();
        user.value = userData;
      }

      return true;
    } catch (error) {
      if (existingToken) {
        handleApiResponseError(error);
      }
      return false;
    }
  };

  return {
    // state
    loginForm,
    user,
    permission,

    // getters

    // actions
    clearLoginForm,
    clearUser,
    clearPermissions,
    checkUserJwt,
    logout,
  };
});
