import { ref, computed } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import useNotify from 'src/modules/shared/composables/useNotify';
import { useOrderStore } from '../stores/useOrderStore';
import { updateOrderHeader } from '../api/ordersApi';
import type { UpdateOrderHeaderDto } from '../interfaces/order.dto';

export const useUpdateOrderHeaderMutation = (orderId: number) => {
  const orderStore = useOrderStore();
  const { successNotify, errorNotify } = useNotify();
  const queryClient = useQueryClient();

  const headerDto = ref<UpdateOrderHeaderDto>({
    orderNumber: '',
    zoneId: 0,
    totalUnits: 0,
  });

  const canSubmit = computed(
    () =>
      !!headerDto.value.orderNumber && headerDto.value.zoneId > 0 && headerDto.value.totalUnits > 0,
  );

  const updateHeaderMutation = useMutation({
    mutationFn: () => updateOrderHeader(orderId, headerDto.value),
    onSuccess: () => {
      successNotify('Cabecera actualizada con éxito', 2000, 'sym_r_check_circle');
      void queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
    onError: (error: AxiosError) => {
      if (error.status === 409) {
        errorNotify('El número de orden ya existe');
        return;
      }
      errorNotify('Error al actualizar la cabecera');
    },
  });

  return {
    headerDto,
    canSubmit,
    updateHeaderMutation,
    resetUpdateOrderDto: orderStore.resetUpdateOrderDto,
  };
};
