import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import useNotify from 'src/modules/shared/composables/useNotify';
import { deleteFailure as apiDeleteFailure } from '../api/failuresApi';

export const useDeleteFailureMutation = () => {
  const { successNotify, errorNotify } = useNotify();
  const queryClient = useQueryClient();

  const deleteFailureMutation = useMutation({
    mutationFn: ({ failureId }: { failureId: number; partId: number }) =>
      apiDeleteFailure(failureId),
    onSuccess: (_data, variables) => {
      successNotify('Falla eliminada exitosamente', 2000, 'sym_r_check_circle');
      void queryClient.invalidateQueries({ queryKey: ['part-failures', variables.partId] });
      void queryClient.invalidateQueries({ queryKey: ['failures-order'] });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message ?? 'Error al eliminar la falla';
      errorNotify(message, 3000);
    },
  });

  return { deleteFailureMutation };
};
