import type { RouteRecordRaw } from 'vue-router';

export enum UsersRoutesEnum {
  USER_LIST = 'users-list',
  ADD_USER = 'users-add',
  EDIT_USER = 'users-edit',
}

export const UsersRouter: RouteRecordRaw = {
  path: 'users',
  name: 'users-main',
  redirect: { name: UsersRoutesEnum.USER_LIST },
  children: [
    {
      path: '',
      name: UsersRoutesEnum.USER_LIST,
      component: () => import('../pages/UsersPage.vue'),
      meta: {
        title: 'Listado de Usuarios',
      },
    },
    {
      path: 'add',
      name: UsersRoutesEnum.ADD_USER,
      component: () => import('../pages/UserAddPage.vue'),
      meta: {
        title: 'Agregar Usuario',
      },
    },
    {
      path: 'edit/:id',
      name: UsersRoutesEnum.EDIT_USER,
      component: () => import('../pages/UserEditPage.vue'),
      meta: {
        title: 'Agregar Usuario',
      },
    },
  ],
};
