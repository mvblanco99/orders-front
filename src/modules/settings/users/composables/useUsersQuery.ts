import { ref, watchEffect } from 'vue';
import type { QTable } from 'quasar';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/useUserStore';
import { findAllUsers } from '../api/usersApi';

export enum queryKeyUsers {
  Users = 'usersQuery',
}

export const useUsersQuery = () => {
  const userStore = useUserStore();
  const { users, searchParams, totalUsers, currentPage, totalPages } = storeToRefs(userStore);

  const columnTable = ref<QTable['columns']>([
    { label: 'Id', name: 'id', required: true, align: 'center', field: 'id' },
    { label: 'Email', name: 'email', required: true, align: 'left', field: 'email' },
    { label: 'Nombre', name: 'name', required: true, align: 'center', field: 'name' },
    { label: 'Apellido', name: 'lastName', required: true, align: 'center', field: 'lastName' },
    { label: 'Slug', name: 'slug', required: true, align: 'center', field: 'slug' },
    {
      name: 'isActive',
      required: true,
      label: 'Estado',
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

  const usersQuery = useQuery({
    queryKey: [queryKeyUsers.Users, searchParams],
    queryFn: () => findAllUsers(searchParams.value),
    retry: 0,
    staleTime: 1000 * 60 * 5,
  });

  watchEffect(() => {
    const data = usersQuery.data.value;
    if (!data) return;
    users.value = data.data;
    totalUsers.value = data.meta.total;
    currentPage.value = data.meta.page;
    totalPages.value = data.meta.totalPages;
  });

  return {
    users,
    columnTable,
    usersQuery,
    searchParams,
    totalUsers,
    currentPage,
    totalPages,
    refreshQuery: async (done: () => void) => {
      await usersQuery.refetch();
      done();
    },
  };
};
