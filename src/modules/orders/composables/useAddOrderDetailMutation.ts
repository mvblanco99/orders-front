import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import useNotify from 'src/modules/shared/composables/useNotify';
import { addOrderDetail } from '../api/ordersApi';
import type { AddOrderDetailDto } from '../interfaces/order.dto';

export const useAddOrderDetailMutation = (orderId: number, orderNumber: Ref<string>) => {
  const { successNotify, errorNotify } = useNotify();
  const queryClient = useQueryClient();

  const addDetailDto = ref<AddOrderDetailDto>({
    quantity: 0,
    pickerId: 0,
  });

  const canSubmit = computed(
    () => addDetailDto.value.quantity > 0 && addDetailDto.value.pickerId > 0,
  );

  const addDetailMutation = useMutation({
    mutationFn: () => addOrderDetail(orderNumber.value, addDetailDto.value),
    onSuccess: () => {
      successNotify('Parte agregada correctamente', 2000, 'sym_r_check_circle');
      void queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message ?? 'Error al agregar la parte';
      errorNotify(message, 3000);
    },
  });

  const resetAddDetailDto = () => {
    addDetailDto.value = { quantity: 0, pickerId: 0 };
  };

  return {
    addDetailDto,
    canSubmit,
    addDetailMutation,
    resetAddDetailDto,
  };
};
