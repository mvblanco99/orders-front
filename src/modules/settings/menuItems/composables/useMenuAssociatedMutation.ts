import { useMutation } from '@tanstack/vue-query';

import { updateMenuAssociated } from '../api/menuItemApi';
import useVueQuery from 'src/modules/shared/composables/useVueQuery';

export const useMenuAssociatedMutation = () => {
  const { invalidQuery } = useVueQuery();

  const updateAssociated = useMutation({
    mutationFn: updateMenuAssociated,
    onSuccess: () => invalidQuery({ queryKey: ['menuAssociated'], exact: false }),
  });

  return {
    // Actions
    updateAssociated,
  };
};
