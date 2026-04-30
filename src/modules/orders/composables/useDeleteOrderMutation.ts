import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import useNotify from 'src/modules/shared/composables/useNotify';
import { deleteOrder as apiDeleteOrder } from '../api/ordersApi';

export const useDeleteOrderMutation = () => {
  const { successNotify, errorNotify } = useNotify();
  const queryClient = useQueryClient();

  const deleteOrderMutation = useMutation({
    mutationFn: (id: number) => apiDeleteOrder(id),
    onSuccess: () => {
      successNotify('Orden eliminada exitosamente', 2000, 'sym_r_check_circle');
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message ?? 'Error al eliminar la orden';
      errorNotify(message, 3000);
    },
  });

  return { deleteOrderMutation };
};
