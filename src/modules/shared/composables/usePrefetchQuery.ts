import { useQueryClient } from '@tanstack/vue-query';
import { getDropDown } from 'src/modules/shared/api/DropDownsApi';

import type { ResourceDD } from 'src/modules/shared/interface/DropDown';

const usePrefetch = (resource: ResourceDD) => {
  const queryClient = useQueryClient();

  const prefetch = () =>
    queryClient.prefetchQuery({
      queryKey: ['dd-' + resource],
      queryFn: () => getDropDown(resource),
      retry: 1,
      staleTime: 1000 * 180, // 10 segundos
    });

  return {
    prefetch,
  };
};

export default usePrefetch;
