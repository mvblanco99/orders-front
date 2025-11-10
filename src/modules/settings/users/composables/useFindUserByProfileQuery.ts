import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';
import { findUserByProfileId } from '../api/usersApi';
import type { UserItem } from '../interfaces/userInterface';
export const useFindUserByProfileQuery = (profileId: number) => {
  const users = ref<UserItem[]>([]);

  const findUserByProfileIdQuery = useQuery({
    queryKey: ['userByProfile', profileId],
    queryFn: () => findUserByProfileId(profileId),
    retry: 0,
    staleTime: 1000 * 60 * 3,
  });

  watch(
    findUserByProfileIdQuery.data,
    (newVal) => {
      if (!newVal) return;
      users.value = newVal.data;
    },
    {
      immediate: true,
      deep: true,
    },
  );
  return { users, findUserByProfileIdQuery };
};
