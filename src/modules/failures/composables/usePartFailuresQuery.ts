import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useRoute } from 'vue-router';
import { findPartFailures } from '../api/failuresApi';

export const usePartFailuresQuery = () => {
  const route = useRoute();

  const partId = computed(() => {
    const id = Number(route.params.partId);
    return isNaN(id) ? null : id;
  });

  const query = useQuery({
    queryKey: computed(() => ['part-failures', partId.value]),
    queryFn: () => findPartFailures(partId.value!),
    enabled: computed(() => partId.value !== null),
    staleTime: 0,
    retry: 0,
  });

  return {
    failures: computed(() => query.data.value ?? []),
    partId,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
