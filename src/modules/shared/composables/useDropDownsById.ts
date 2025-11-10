import { Loading } from 'quasar';
import { computed, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

import type { ResourceDDById } from '../interface/DropDown';
import { getDropDownById } from '../api/DropDownsApi';
import { useDropDownStore } from '../store/useDropDownStore';

const useDropDownById = (resource: ResourceDDById, id: number) => {
  const store = useDropDownStore();
  const { clientsForTeleOperator, usersByManufacturer } = storeToRefs(store);

  const queryDropDown = useQuery({
    queryKey: ['dd-' + resource],
    queryFn: () => getDropDownById(resource, id),
    retry: 0,
    staleTime: Infinity,
    enabled: computed(() => !!id) || id > 0,
  });

  watch(queryDropDown.isLoading, (isLoading) => {
    if (isLoading) {
      Loading.show({ group: 'loading' });
    } else {
      Loading.hide('loading');
    }
  });

  watch(queryDropDown.data, (newVal) => {
    if (!newVal?.length) return;

    switch (resource) {
      case 'searchForTeleoperatorClientsByUserId':
        store.clientsForTeleOperator = newVal;
        break;
      case 'users-by-manufacturer-id':
        store.usersByManufacturer = newVal;
        break;
    }
  });

  return {
    clientsForTeleOperator,
    usersByManufacturer,
  };
};

export default useDropDownById;
