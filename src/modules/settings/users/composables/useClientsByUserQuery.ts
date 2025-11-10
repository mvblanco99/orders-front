import { useQuery } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';
import { findClientsByProfile } from '../api/usersApi';
import type { ClientsAssociatesInterface } from '../interfaces/assingClientsInterfaces';

export enum queryKeyClientsByUser {
  client = `clients-by-user`,
}
const useClientsByUserQuery = (userId: number, profileId: number) => {
  const customers = ref<ClientsAssociatesInterface[]>([]);
  const findClientsByUser = useQuery({
    queryKey: [queryKeyClientsByUser.client, userId, profileId],
    queryFn: () => findClientsByProfile(userId, profileId),
    retry: 0,
    staleTime: Infinity,
    enabled: computed(() => !!userId && !!profileId),
  });

  const isLoading = computed(() => findClientsByUser.isFetching.value);

  watch(
    findClientsByUser.data,
    (newVal) => {
      if (!newVal) return;
      customers.value = newVal;
    },
    {
      immediate: true,
      deep: true,
    },
  );

  return {
    isLoading,
    customer: computed(() => customers.value.map((customer) => customer.customer)),
  };
};
export default useClientsByUserQuery;
