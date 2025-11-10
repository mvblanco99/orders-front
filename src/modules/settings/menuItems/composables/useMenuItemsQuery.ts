import { ref, watchEffect } from 'vue';
import type { QTable } from 'quasar';
import { useQuery } from '@tanstack/vue-query';

import { findAllMenuItem } from '../api/menuItemApi';
import useMenuItems from './useMenuItems';

export const useMenuItemsQuery = () => {
  const { menuItems, menuFilters } = useMenuItems();

  const columnTable = ref<QTable['columns']>([
    {
      name: 'order',
      required: true,
      label: 'Lugar',
      align: 'center',
      field: 'order',
    },
    {
      name: 'link',
      required: true,
      label: 'Enlace',
      align: 'left',
      field: 'link',
    },
    {
      name: 'title',
      required: true,
      label: 'Titulo',
      align: 'center',
      field: 'title',
    },
    {
      name: 'caption',
      required: true,
      label: 'Descripción',
      align: 'center',
      field: 'caption',
    },
    {
      name: 'type',
      required: true,
      label: 'Tipo',
      align: 'center',
      field: 'type',
    },
    {
      name: 'icon',
      required: true,
      label: 'Icono',
      align: 'center',
      field: 'icon',
    },
    {
      name: 'parentId',
      required: true,
      label: 'Padre',
      align: 'center',
      field: 'parentId',
    },
    {
      name: 'isActive',
      required: true,
      label: 'Status',
      align: 'center',
      field: 'isActive',
      sortable: true,
    },
    {
      name: 'actions',
      required: true,
      label: 'Acc.',
      align: 'center',
      field: 'actions',
      style: 'position: sticky; right:0; background-color: #d6eaf8;',
      headerStyle: 'background-color: #d6eaf8; position: sticky; right:0',
    },
  ]);

  const menuItemByUserQuery = useQuery({
    queryKey: ['menuItems', menuFilters],
    queryFn: () => findAllMenuItem(menuFilters.value),
    retry: 0,
    staleTime: 1000,
  });

  watchEffect(() => {
    if (!menuItemByUserQuery.data.value?.data) return;
    menuItems.value = menuItemByUserQuery.data.value.data;
  });

  return {
    columnTable,
    menuItemByUserQuery,
    menuItems,
    menuFilters,
    refreshQuery: async (done: () => void) => {
      await menuItemByUserQuery.refetch();
      done();
    },
  };
};
