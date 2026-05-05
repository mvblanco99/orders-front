import DashboardRouter from 'src/modules/dashboard/router';
import FailuresRouter from 'src/modules/failures/router';
import OrdersRouter from 'src/modules/orders/router';
import RecheckerRouter from 'src/modules/rechecker/router';
import SettingsRouter from 'src/modules/settings/router';
import type { RouteRecordRaw } from 'vue-router';

const StartRouter: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main',
    beforeEnter: [],
    component: () => import('../layouts/MainLayout.vue'),
    children: [DashboardRouter, SettingsRouter, OrdersRouter, RecheckerRouter, FailuresRouter],
  },
  {
    path: '/catch-all(.*)*',
    component: () => import('../pages/ErrorNotFoundPage.vue'),
  },
];

export default StartRouter;
