import { useMutation } from '@tanstack/vue-query';

import { createMenuItem, removeMenuItem, updateMenuItem } from '../api/menuItemApi';
import useMenuItems from './useMenuItems';
import type { ItemType, MenuItem } from '../interfaces/menuItemInterfaces';
import useVueQuery from 'src/modules/shared/composables/useVueQuery';

export const useMenuItemMutation = () => {
  const { invalidQuery } = useVueQuery();
  const { menuItemDto, resetMenuDto } = useMenuItems();
  const createMenu = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => invalidQuery({ queryKey: ['menuItems'], exact: false }),
  });

  const updateMenu = useMutation({
    mutationFn: updateMenuItem,
    onSuccess: () => invalidQuery({ queryKey: ['menuItems'], exact: false }),
  });

  const deleteMenu = useMutation({
    mutationFn: removeMenuItem,
    onSuccess: () => invalidQuery({ queryKey: ['menuItems'], exact: false }),
  });

  const fillMenuItemDto = (menuItem: MenuItem) => {
    menuItemDto.value = {
      id: menuItem.id,
      title: menuItem.title,
      order: menuItem.order,
      caption: menuItem.caption,
      link: menuItem.link!,
      type: menuItem.type as ItemType,
      icon: menuItem.icon,
      isActive: menuItem.isActive,
      parentId: menuItem.parentId,
    };
  };

  return {
    // State
    menuItemDto,

    // Actions
    createMenu,
    updateMenu,
    deleteMenu,
    fillMenuItemDto,
    resetMenuDto,
  };
};
