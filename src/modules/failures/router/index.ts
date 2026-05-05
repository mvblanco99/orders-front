import isAuthenticatedGuard from 'src/modules/auth/router/guards/isAuthenticatedGuard';
import type { RouteRecordRaw } from 'vue-router';

export enum FailuresRoutesEnum {
  FailuresRegister = 'failures-register',
  FailuresPartDetail = 'failures-part-detail',
}

const FailuresRouter: RouteRecordRaw = {
  path: 'failures',
  name: 'failures-main',
  beforeEnter: isAuthenticatedGuard,
  redirect: { name: FailuresRoutesEnum.FailuresRegister },
  children: [
    {
      path: '',
      name: FailuresRoutesEnum.FailuresRegister,
      component: () => import('../pages/FailuresPage.vue'),
      meta: { title: 'Fallas de pedidos' },
    },
    {
      path: 'part/:partId',
      name: FailuresRoutesEnum.FailuresPartDetail,
      component: () => import('../pages/FailuresPartPage.vue'),
      meta: { title: 'Fallas de parte' },
    },
  ],
};

export default FailuresRouter;
