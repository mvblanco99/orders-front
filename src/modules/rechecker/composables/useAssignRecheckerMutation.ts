import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import useNotify from 'src/modules/shared/composables/useNotify';
import { assignRechecker as apiAssignRechecker } from '../api/recheckerApi';

export const useAssignRecheckerMutation = () => {
  const { successNotify, errorNotify } = useNotify();
  const queryClient = useQueryClient();

  const assignRecheckerMutation = useMutation({
    mutationFn: apiAssignRechecker,
    onSuccess: (data) => {
      const count = data.partsUpdated;
      successNotify(
        `${count} ${count === 1 ? 'parte actualizada' : 'partes actualizadas'} exitosamente`,
        2000,
        'sym_r_check_circle',
      );
      void queryClient.invalidateQueries({ queryKey: ['rechecker-order'] });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message ?? 'Error al asignar el rechecker';
      errorNotify(message, 3000);
    },
  });

  return { assignRecheckerMutation };
};
