import { ref, computed } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import useNotify from 'src/modules/shared/composables/useNotify';
import { useOrderStore } from '../stores/useOrderStore';
import { updateOrderDetail } from '../api/ordersApi';
import type { UpdateOrderDetailDto } from '../interfaces/order.dto';

export const useUpdateOrderDetailMutation = (orderId: number) => {
  const orderStore = useOrderStore();
  const { successNotify, errorNotify } = useNotify();
  const queryClient = useQueryClient();

  const detailDto = ref<UpdateOrderDetailDto>({
    quantity: 0,
    pickerId: 0,
    recheckerId: null,
    packerId: null,
  });

  const canSubmit = computed(() => detailDto.value.quantity > 0 && detailDto.value.pickerId > 0);

  const updateDetailMutation = useMutation({
    mutationFn: (detailId: number) => updateOrderDetail(detailId, detailDto.value),
    onSuccess: (updatedDetail) => {
      successNotify('Parte actualizada con éxito', 2000, 'sym_r_check_circle');
      if (orderStore.orderDetail?.OrderDetails) {
        const idx = orderStore.orderDetail.OrderDetails.findIndex((d) => d.id === updatedDetail.id);
        if (idx !== -1) {
          orderStore.orderDetail.OrderDetails[idx] = updatedDetail;
        }
      }
      void queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
    onError: (error: AxiosError) => {
      if (error.status === 400) {
        errorNotify('La cantidad excede el total del pedido');
        return;
      }
      if (error.status === 404) {
        errorNotify('Detalle de orden no encontrado');
        return;
      }
      errorNotify('Error al actualizar la parte');
    },
  });

  return {
    detailDto,
    canSubmit,
    updateDetailMutation,
  };
};
