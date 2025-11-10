import type { RouteRecordRaw } from 'vue-router';

export enum MenuRoutesEnum {
  MENU_LIST = 'menus-list',
}

const MenuItemRouter: RouteRecordRaw = {
  path: 'menus',
  name: MenuRoutesEnum.MENU_LIST,
  meta: {
    title: 'Listado de Menu Items',
  },
  component: () => import('../pages/MenuItemsPage.vue'),
};

export default MenuItemRouter;
