import type { RouteRecordRaw } from 'vue-router';

import isAuthenticatedGuard from 'src/modules/auth/router/guards/isAuthenticatedGuard';
import MenuItemRouter, { MenuRoutesEnum } from '../menuItems/router';
import { ProfileRouter } from '../profiles/router';
import { UsersRouter } from '../users/router';
import { ZonesRouter } from '../zones/router';

const SettingsRouter: RouteRecordRaw = {
  path: '/settings',
  beforeEnter: isAuthenticatedGuard,
  redirect: {
    name: MenuRoutesEnum.MENU_LIST,
  },
  children: [MenuItemRouter, ProfileRouter, UsersRouter, ZonesRouter],
};

export default SettingsRouter;
