import { storeToRefs } from 'pinia';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import { useRouter } from 'vue-router';
import useNotify from 'src/modules/shared/composables/useNotify';
import { useOrderStore } from '../stores/useOrderStore';
import { createOrder } from '../api/ordersApi';

export const useCreateOrderMutation = () => {
  const orderStore = useOrderStore();
  const { createOrderDto } = storeToRefs(orderStore);
  const { successNotify, errorNotify } = useNotify();
  const queryClient = useQueryClient();
  const router = useRouter();

  const createOrderMutation = useMutation({
    mutationFn: () => createOrder(createOrderDto.value),
    onSuccess: async () => {
      successNotify('Orden creada con éxito', 2000, 'sym_r_check_circle');
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      orderStore.resetCreateOrderDto();
      await router.push({ name: 'order-list' });
    },
    onError: (error: AxiosError) => {
      if (error.status === 409) {
        errorNotify('El número de orden ya existe');
        return;
      }
      errorNotify('Error al crear la orden');
    },
  });

  return {
    createOrderDto,
    createOrderMutation,
  };
};
