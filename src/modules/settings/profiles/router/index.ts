import type { RouteRecordRaw } from 'vue-router';

export enum ProfileRoutesEnum {
  PROFILES = 'profiles',
}

export const ProfileRouter: RouteRecordRaw = {
  path: 'profiles',
  name: ProfileRoutesEnum.PROFILES,
  meta: {
    title: 'Administrador de perfiles',
  },
  component: () => import('../pages/ProfilePages.vue'),
};
