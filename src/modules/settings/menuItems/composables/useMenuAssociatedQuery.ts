import { useQuery } from '@tanstack/vue-query';

import { findMenuItemByProfileId } from '../api/menuItemApi';

export const useMenuAssociatedQuery = (profileId: number) => {
  const menuItemByUserQuery = useQuery({
    queryKey: ['menuAssociated', profileId],
    queryFn: () => findMenuItemByProfileId(profileId),
    retry: 0,
    staleTime: 1000 * 60 * 5, // 5 minute
  });

  return {
    menuItemByUserQuery,
  };
};
