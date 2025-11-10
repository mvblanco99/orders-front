import { useRouter } from 'vue-router';
import { LocalStorage } from 'quasar';
import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/modules/auth/stores/useAuthStore';

export default boot(async () => {
  const authStore = useAuthStore();
  const router = useRouter();

  const jwt = LocalStorage.getItem('jwt');

  if (jwt) {
    const isValid = await authStore.checkUserJwt();
    if (!isValid) {
      authStore.clearUser();
      authStore.clearPermissions();
      LocalStorage.remove('jwt');
      void router.push({ name: 'login' });
    }
  }
});
