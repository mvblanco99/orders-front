import isAuthenticatedGuard from 'src/modules/auth/router/guards/isAuthenticatedGuard';
import type { RouteRecordRaw } from 'vue-router';

const DashboardRouter: RouteRecordRaw = {
  path: '/',
  beforeEnter: isAuthenticatedGuard,
  redirect: {
    name: 'home',
  },
  children: [
    {
      path: 'home',
      name: 'home',
      meta: {
        title: 'Pagina de Inicio',
      },
      component: () => import('../pages/HomePage.vue'),
    },
  ],
};

export default DashboardRouter;
