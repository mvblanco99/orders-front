import isAuthenticatedGuard from 'src/modules/auth/router/guards/isAuthenticatedGuard';
import type { RouteRecordRaw } from 'vue-router';

export enum OrdersRoutesEnum {
  OrderList = 'order-list',
  OrderCreate = 'order-create',
  OrderDetail = 'order-detail',
  OrderEdit = 'order-edit',
}

const OrdersRouter: RouteRecordRaw = {
  path: 'orders',
  name: 'orders-main',
  beforeEnter: isAuthenticatedGuard,
  redirect: { name: OrdersRoutesEnum.OrderList },
  children: [
    {
      path: '',
      name: OrdersRoutesEnum.OrderList,
      component: () => import('../pages/OrderListPage.vue'),
      meta: {
        title: 'Órdenes',
      },
    },
    {
      path: 'create',
      name: OrdersRoutesEnum.OrderCreate,
      component: () => import('../pages/OrderCreatePage.vue'),
      meta: {
        title: 'Crear Orden',
      },
    },
    {
      path: ':id',
      name: OrdersRoutesEnum.OrderDetail,
      component: () => import('../pages/OrderDetailPage.vue'),
      meta: {
        title: 'Detalle de Orden',
      },
    },
    {
      path: ':id/edit',
      name: OrdersRoutesEnum.OrderEdit,
      component: () => import('../pages/OrderEditPage.vue'),
      meta: {
        title: 'Editar Orden',
      },
    },
  ],
};

export default OrdersRouter;
