import type { RouteRecordRaw } from 'vue-router';
import { AuthRoutes } from '../interfaces/auth-routes';

const AuthRouter: RouteRecordRaw = {
  path: '/auth',
  name: 'auth',
  component: () => import('../layouts/AuthLayout.vue'),
  children: [
    {
      path: 'login',
      name: AuthRoutes.LOGIN,
      component: () => import('../pages/SigninPage.vue'),
    },
    {
      path: 'change-password',
      name: AuthRoutes.CHANGE_PASSWORD,
      component: () => import('../layouts/ChangePasswordLayout.vue'),
      children: [
        {
          path: '',
          name: AuthRoutes.CHANGE_PASSWORD_REQUEST,
          component: () => import('../pages/ChangePasswordRequestPage.vue'),
        },
        {
          path: 'verify',
          name: AuthRoutes.CHANGE_PASSWORD_VERIFY,
          component: () => import('../pages/ChangePasswordVerifyPage.vue'),
        },
        {
          path: 'reset',
          name: AuthRoutes.CHANGE_PASSWORD_RESET,
          component: () => import('../pages/ChangePasswordResetPage.vue'),
        },
      ],
    },
  ],
};

export default AuthRouter;
