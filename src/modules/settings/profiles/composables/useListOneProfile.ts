import { computed, ref, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { getProfilesById } from '../api/profileApi';

import { useManageStore } from './useManageStore';

export const useListOneProfile = () => {
  const { profileItem, permissionItem } = useManageStore();
  const idSelected = ref(0);

  const queryProfileById = useQuery({
    queryKey: ['profileItem', idSelected],
    queryFn: () => getProfilesById(idSelected.value),
    retry: 0,
    staleTime: 3000000,
    enabled: computed(() => !!idSelected.value),
  });

  watch(
    () => queryProfileById.data.value,
    (newVal) => {
      if (!newVal?.Permissions) return;

      profileItem.value = newVal;
      permissionItem.value = [...newVal.Permissions];
    },
    {
      deep: true,
    },
  );
  return { profileItem, queryProfileById, idSelected };
};
