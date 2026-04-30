import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import useNotify from 'src/modules/shared/composables/useNotify';
import { useOrderStore } from '../stores/useOrderStore';
import { removeOrderDetail } from '../api/ordersApi';

export const useRemoveOrderDetailMutation = (orderId: number) => {
  const orderStore = useOrderStore();
  const { successNotify, errorNotify } = useNotify();
  const queryClient = useQueryClient();

  const removeDetailMutation = useMutation({
    mutationFn: (detailId: number) => removeOrderDetail(detailId),
    onSuccess: (_data, detailId) => {
      successNotify('Parte eliminada con éxito', 2000, 'sym_r_check_circle');
      if (orderStore.orderDetail?.OrderDetails) {
        orderStore.orderDetail.OrderDetails = orderStore.orderDetail.OrderDetails.filter(
          (d) => d.id !== detailId,
        );
      }
      void queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
    onError: (error: AxiosError) => {
      if (error.status === 404) {
        errorNotify('Detalle de orden no encontrado');
        return;
      }
      errorNotify('Error al eliminar la parte');
    },
  });

  return {
    removeDetailMutation,
  };
};
