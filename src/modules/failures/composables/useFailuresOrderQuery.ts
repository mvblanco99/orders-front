import { computed, ref, watchEffect } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { useFailuresStore } from '../stores/useFailuresStore';
import { findOrderForRechecker } from 'src/modules/rechecker/api/recheckerApi';
import type { FailuresPartRow } from '../interfaces/failures.interface';

export const useFailuresOrderQuery = () => {
  const store = useFailuresStore();
  const { order } = storeToRefs(store);

  const activeOrderNumber = ref('');

  const query = useQuery({
    queryKey: computed(() => ['failures-order', activeOrderNumber.value]),
    queryFn: () => findOrderForRechecker(activeOrderNumber.value),
    enabled: computed(() => !!activeOrderNumber.value),
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  watchEffect(() => {
    if (query.data.value) {
      store.order = query.data.value;
    }
  });

  const search = (orderNumber: string) => {
    store.order = null;
    store.selectedPartId = null;
    activeOrderNumber.value = orderNumber.trim();
  };

  const clear = () => {
    activeOrderNumber.value = '';
    store.resetOrder();
  };

  const myParts = computed<FailuresPartRow[]>(() => {
    if (!order.value?.OrderDetails) return [];

    const rows: FailuresPartRow[] = [];

    order.value.OrderDetails.forEach((detail) => {
      detail.Parts.forEach((part, idx) => {
        if (part.recheckerId !== null) {
          rows.push({
            partRowId: `${detail.id}-${part.id}`,
            orderDetailId: detail.id,
            partId: part.id,
            partIndex: idx + 1,
            quantity: detail.quantity,
            pickerName: part.Picker ? `${part.Picker.name} ${part.Picker.lastName}` : 'Sin asignar',
            packerName: part.Packer ? `${part.Packer.name} ${part.Packer.lastName}` : 'Sin asignar',
            recheckerName: part.Rechecker
              ? `${part.Rechecker.name} ${part.Rechecker.lastName}`
              : 'Sin asignar',
            failuresCount: part.Failures?.length ?? 0,
          });
        }
      });
    });

    return rows;
  });

  return {
    order,
    myParts,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    search,
    clear,
    refetch: query.refetch,
  };
};
