import { computed, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { getProfiles } from '../api/profileApi';
import { useManageStore } from './useManageStore';

export const useListProfile = () => {
  const { dataFilter, profiles, profilePagination } = useManageStore();

  const paginationParams = computed(() => ({
    page: profilePagination.value.page,
    rowsPerPage: profilePagination.value.rowsPerPage,
  }));

  const queryProfile = useQuery({
    queryKey: ['profiles', dataFilter.value, paginationParams],
    queryFn: () =>
      getProfiles({
        ...dataFilter.value,
        limit: profilePagination.value.rowsPerPage,
        offset: profilePagination.value.rowsPerPage * (profilePagination.value.page - 1),
      }),
    retry: 0,
    staleTime: 1000 * 60 * 3,
  });

  watch(
    () => queryProfile.data.value,
    (newVal) => {
      if (!queryProfile.isFetched.value || queryProfile.isFetching.value) return;

      if (newVal?.data.length === 0 && dataFilter.value.offset! > 0) {
        profilePagination.value.page -= 1;
        return;
      }
      profiles.value = newVal?.data ?? [];
      profilePagination.value.rowsNumber = newVal?.total ?? 0;
    },
    {
      immediate: true,
    },
  );

  return { profiles, queryProfile, dataFilter };
};
