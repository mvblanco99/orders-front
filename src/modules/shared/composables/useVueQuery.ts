import type { InvalidateQueryFilters } from '@tanstack/vue-query';
import { useQueryClient } from '@tanstack/vue-query';

const useVueQuery = () => {
  const queryClient = useQueryClient();
  const removeQuery = (queryName: InvalidateQueryFilters) => {
    queryClient.removeQueries(queryName);
  };

  const invalidQuery = (queryName: InvalidateQueryFilters) => {
    void queryClient.invalidateQueries(queryName);
  };

  return {
    invalidQuery,
    removeQuery,
  };
};

export default useVueQuery;
