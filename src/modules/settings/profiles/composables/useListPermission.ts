import { useQuery } from '@tanstack/vue-query';
import { getPermission } from '../api/permissionApi';
import { computed, watch } from 'vue';

import type { PermissionBySubjectI } from '../interfaces/permissionInterface';
import { useManageStore } from './useManageStore';

export const useListPermission = () => {
  const { permissionBySubject, resetPermissionStore } = useManageStore();

  const queryPermission = useQuery({
    queryKey: ['permission'],
    queryFn: () => getPermission({ limit: 400 }),
    retry: 0,
    staleTime: 1000 * 60 * 3,
    select: (response) => {
      return Object.values(
        response.data.reduce<Record<string, PermissionBySubjectI>>((acc, item) => {
          if (!acc[item.subject]) acc[item.subject] = { subject: item.subject, permission: [] };
          acc[item.subject]?.permission?.push(item);
          return acc;
        }, {}),
      );
    },
  });

  watch(
    () => queryPermission.data.value,
    (newVal) => {
      permissionBySubject.value = newVal ?? [];
    },
  );

  const permissions = computed(() => permissionBySubject.value);

  return {
    permissionBySubject: permissions,
    resetPermissionStore,
  };
};
