import { computed, ref, watch } from 'vue';
import { Loading } from 'quasar';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

import { useDropDownStore } from '../store/useDropDownStore';
import type { DropDownsParamByType } from '../interface/DropDown';
import { getDropDownByType } from '../api/DropDownsApi';

export enum queryDropDownByType {
  PROFILES_BY_TENANT = 'profiles-by-tenant',
}

const useDropDownByType = (resource: DropDownsParamByType) => {
  const store = useDropDownStore();
  const { profilesByTenant } = storeToRefs(store);
  const type = ref<string>('');

  const queryDropDown = useQuery({
    queryKey: ['dd-by-type-' + resource, type],
    queryFn: () => getDropDownByType(resource, type.value),
    retry: 0,
    staleTime: Infinity,
    enabled: computed(() => !!type.value),
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
      case 'profiles-by-tenant':
        store.profilesByTenant = newVal;
        break;
    }
  });

  return {
    profilesByTenant,
    type,
  };
};

export default useDropDownByType;
