import type { RouteRecordRaw } from 'vue-router';

export enum ZonesRoutesEnum {
  ZONE_LIST = 'zones-list',
}

export const ZonesRouter: RouteRecordRaw = {
  path: 'zones',
  name: 'zones-main',
  redirect: { name: ZonesRoutesEnum.ZONE_LIST },
  children: [
    {
      path: '',
      name: ZonesRoutesEnum.ZONE_LIST,
      component: () => import('../pages/ZonesPage.vue'),
      meta: {
        title: 'Listado de Zonas',
      },
    },
  ],
};
