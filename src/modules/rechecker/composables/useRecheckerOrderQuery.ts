import { computed, ref, watchEffect } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { useRecheckerStore } from '../stores/useRecheckerStore';
import { findOrderForRechecker } from '../api/recheckerApi';
import type { RecheckerPartRow } from '../interfaces/rechecker.interface';

export const useRecheckerOrderQuery = () => {
  const store = useRecheckerStore();
  const { order } = storeToRefs(store);

  const activeOrderNumber = ref('');

  const query = useQuery({
    queryKey: computed(() => ['rechecker-order', activeOrderNumber.value]),
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
    activeOrderNumber.value = orderNumber.trim();
  };

  const clear = () => {
    activeOrderNumber.value = '';
    store.resetOrder();
  };

  const unassignedParts = computed<RecheckerPartRow[]>(() => {
    if (!order.value?.OrderDetails) return [];

    const rows: RecheckerPartRow[] = [];

    order.value.OrderDetails.forEach((detail) => {
      detail.Parts.forEach((part, idx) => {
        if (part.recheckerId === null) {
          rows.push({
            partRowId: `${detail.id}-${part.id}`,
            orderDetailId: detail.id,
            partId: part.id,
            partIndex: idx + 1,
            quantity: detail.quantity,
            pickerName: part.Picker ? `${part.Picker.name} ${part.Picker.lastName}` : 'Sin asignar',
            packerName: part.Packer ? `${part.Packer.name} ${part.Packer.lastName}` : 'Sin asignar',
          });
        }
      });
    });

    return rows;
  });

  return {
    order,
    unassignedParts,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    search,
    clear,
  };
};
