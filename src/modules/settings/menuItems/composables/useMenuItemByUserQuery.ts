import { watch } from 'vue';
import { findMenuItemsByUser } from '../api/menuItemApi';
import { useQuery } from '@tanstack/vue-query';

import useAuth from 'src/modules/auth/composables/useAuth';
import useMenuItems from './useMenuItems';
import type { MenuItemFormatted } from '../interfaces/menuItemInterfaces';

export const useMenuItemByUserQuery = () => {
  const { user } = useAuth();
  const { menuItemsFormatted, setMenuItemFormatted } = useMenuItems();

  const menuItemByUserQuery = useQuery({
    queryKey: ['menuItemByUser', user.value?.user.id],
    queryFn: () => findMenuItemsByUser(),
    retry: 0,

    staleTime: 1000 * 60 * 3,
  });

  watch(
    menuItemByUserQuery.data,
    (newVal) => {
      if (!newVal) return;

      const formatVal = newVal.reduce<Record<string, MenuItemFormatted>>((acc, item) => {
        if (!acc[item.id] && !item.parentId) acc[item.id] = { ...item, subItems: [] };

        if (item.parentId && !acc[item.parentId]) {
          const parent = newVal.find((i) => i.id === item.parentId);
          if (parent) acc[parent.id] = { ...parent, subItems: [] };
        }

        if (item.parentId && acc[item.parentId]) acc[item.parentId]?.subItems.push(item);

        return acc;
      }, {});

      const newMenu = Object.values(formatVal);

      setMenuItemFormatted(newMenu);
    },
    {
      immediate: true,
    },
  );

  return { menuItemsFormatted, menuItemByUserQuery };
};
