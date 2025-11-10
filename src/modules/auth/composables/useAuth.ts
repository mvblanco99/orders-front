import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Loading, LocalStorage } from 'quasar';
import { storeToRefs } from 'pinia';

import useNotify from '../../shared/composables/useNotify';
import { useAuthStore } from '../stores/useAuthStore';
import { useMenuUiStore } from '../../settings/menuItems/stores/useMenuUiStore';
import type { LoginForm } from '../interfaces/auth';
import { signIn } from '../api/authApi';
import { AuthRoutes } from '../interfaces/auth-routes';

const useAuth = () => {
  const router = useRouter();
  const notify = useNotify();
  const authStore = useAuthStore();
  const menuUiStore = useMenuUiStore();

  const { user, loginForm, permission } = storeToRefs(authStore);

  const login = async () => {
    Loading.show({
      group: 'auth-login',
      message: 'Comprobando credenciales, por favor espere...',
    });
    try {
      const jwt = await signIn(loginForm.value);

      if (loginForm.value.remember) setLoginFormToLocalStore({ ...loginForm.value, password: '' });
      setJwtToLocalStore(jwt);
      void router.push('/');
    } catch {
      notify.errorNotify(`Contraseña o correo inválido`);
    } finally {
      Loading.hide('auth-login');
    }
  };

  const logout = async () => {
    await router.push({ name: AuthRoutes.LOGIN });
    authStore.clearUser();
    authStore.clearPermissions();
    menuUiStore.resetMenuUi();
    removeJwtFromLocalStore();
  };

  const getLoginFormFromLocalStore = () => {
    return LocalStorage.getItem<LoginForm>('loginForm');
  };

  const setLoginFormToLocalStore = (loginForm: LoginForm) => {
    LocalStorage.set('loginForm', loginForm);
  };

  const getJwtFromLocalStore = () => {
    return LocalStorage.getItem<string>('jwt');
  };

  const setJwtToLocalStore = (jwt: string) => {
    LocalStorage.set('jwt', jwt);
  };

  const removeJwtFromLocalStore = () => {
    LocalStorage.remove('jwt');
  };

  return {
    // props
    loginForm,
    user,
    permission,

    hasUpdateClientPermission: computed(() =>
      user.value?.user.permissions.some((item) => item.name === 'customer:update'),
    ),

    // actions
    login,
    logout,
    getJwtFromLocalStore,
    getLoginFormFromLocalStore,
  };
};

export default useAuth;
