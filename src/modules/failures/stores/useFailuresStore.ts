import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { FailuresOrder } from '../interfaces/failures.interface';

export const useFailuresStore = defineStore('failures', () => {
  // State
  const order = ref<FailuresOrder | null>(null);
  const orderNumber = ref<string>('');
  const selectedPartId = ref<number | null>(null);

  // Actions
  const resetOrder = () => {
    order.value = null;
    orderNumber.value = '';
    selectedPartId.value = null;
  };

  return {
    order,
    orderNumber,
    selectedPartId,
    resetOrder,
  };
});
