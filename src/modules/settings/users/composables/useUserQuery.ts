import { ref, watchEffect } from 'vue';
import type { QTable } from 'quasar';
import { useQuery } from '@tanstack/vue-query';
import { useUserManager } from './useUserManager';
import { findAllUsers } from '../api/usersApi';
import type { UserItem } from '../interfaces/userInterface';

export enum queryKeyUsers {
  Users = 'userSettingQuery',
}

export const useUserQuery = () => {
  const { users } = useUserManager();

  const columnTable = ref<QTable['columns']>([
    {
      label: 'Id',
      name: 'id',
      required: true,
      align: 'center',
      field: 'id',
    },
    {
      label: 'Email',
      name: 'email',
      required: true,
      align: 'left',
      field: 'email',
    },
    {
      label: 'Usuario',
      name: 'name',
      required: true,
      align: 'center',
      field: 'name',
    },
    {
      label: 'Tenant',
      name: 'tenant',
      required: true,
      align: 'center',
      field: (row: UserItem) => row?.tenant?.name,
    },
    {
      label: 'Tipo',
      name: 'Tipo',
      required: true,
      align: 'center',
      field: (row: UserItem) => row?.tenant?.typeTenant,
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

  const userQuery = useQuery({
    queryKey: [queryKeyUsers.Users],
    queryFn: findAllUsers,
    retry: 0,
    staleTime: 1000 * 60 * 60,
  });

  watchEffect(() => {
    if (!userQuery.data.value?.data) return;
    users.value = userQuery.data.value.data;
  });

  return {
    columnTable,
    userQuery,
    users,
    refreshQuery: async (done: () => void) => {
      await userQuery.refetch();
      done();
    },
  };
};
