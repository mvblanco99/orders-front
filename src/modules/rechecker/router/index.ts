import isAuthenticatedGuard from 'src/modules/auth/router/guards/isAuthenticatedGuard';
import type { RouteRecordRaw } from 'vue-router';

export enum RecheckerRoutesEnum {
  RecheckerAssign = 'rechecker-assign',
}

const RecheckerRouter: RouteRecordRaw = {
  path: 'rechecker',
  name: 'rechecker-main',
  beforeEnter: isAuthenticatedGuard,
  redirect: { name: RecheckerRoutesEnum.RecheckerAssign },
  children: [
    {
      path: '',
      name: RecheckerRoutesEnum.RecheckerAssign,
      component: () => import('../pages/RecheckerPage.vue'),
      meta: {
        title: 'Rechecker',
      },
    },
  ],
};

export default RecheckerRouter;
