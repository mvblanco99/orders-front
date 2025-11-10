import { useQuery } from '@tanstack/vue-query';
import { computed, watch } from 'vue';
import { findOneById } from '../api/usersApi';

import { useUserStore } from '../stores/useUserStore';
import { storeToRefs } from 'pinia';

export enum queryKeyUser {
  user = `find-user`,
}
const useDataUserQuery = (userId: number) => {
  const userStore = useUserStore();
  const { userDetail } = storeToRefs(userStore);

  const findUser = useQuery({
    queryKey: [queryKeyUser.user, userId],
    queryFn: () => findOneById(userId),
    retry: 0,
    enabled: computed(() => !!userId),
  });

  const isLoading = findUser.isFetched.value;

  watch(
    findUser.data,
    (newVal) => {
      if (!newVal) return;
      userDetail.value = newVal;
    },
    {
      immediate: true,
      deep: true,
    },
  );

  return {
    isLoading,
    userDetail,
  };
};
export default useDataUserQuery;
