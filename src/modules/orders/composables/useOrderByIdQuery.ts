import { watchEffect } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '../stores/useOrderStore';
import { findOrderById } from '../api/ordersApi';

export const useOrderByIdQuery = (orderId: number, viewAll = false) => {
  const orderStore = useOrderStore();
  const { orderDetail } = storeToRefs(orderStore);

  const query = useQuery({
    queryKey: ['order', orderId, viewAll],
    queryFn: () => findOrderById(orderId, viewAll),
    staleTime: 1000 * 60 * 5,
  });

  // Sincronizar con el store cada vez que lleguen datos frescos
  watchEffect(() => {
    const data = query.data.value;
    if (data) {
      orderStore.orderDetail = data;
    }
  });

  return {
    order: query.data,
    orderDetail,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    query,
  };
};
