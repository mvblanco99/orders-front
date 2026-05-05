import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { RecheckerOrder } from '../interfaces/rechecker.interface';

export const useRecheckerStore = defineStore('rechecker', () => {
  // State
  const order = ref<RecheckerOrder | null>(null);
  const orderNumber = ref<string>('');
  const packerId = ref<number | null>(null);

  // Actions
  const resetOrder = () => {
    order.value = null;
    orderNumber.value = '';
    packerId.value = null;
  };

  return {
    order,
    orderNumber,
    packerId,
    resetOrder,
  };
});
