import { computed, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '../stores/useOrderStore';
import { findAllOrders } from '../api/ordersApi';
import type { OrderSearchParams } from '../interfaces/order.dto';

export const useOrdersQuery = () => {
  const orderStore = useOrderStore();
  const { searchParams } = storeToRefs(orderStore);

  // Parámetros activos: solo se actualizan al pulsar "Buscar"
  const activeParams = ref<OrderSearchParams>({ ...searchParams.value });

  const query = useQuery({
    queryKey: computed(() => ['orders', { ...activeParams.value }]),
    queryFn: () => findAllOrders(activeParams.value),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

  const orders = computed(() => query.data.value?.data ?? []);
  const totalOrders = computed(() => query.data.value?.meta.total ?? 0);
  const currentPage = computed(() => query.data.value?.meta.page ?? 1);

  // Confirmar la búsqueda: copia el draft al activo y resetea la página
  const commitSearch = () => {
    activeParams.value = { ...searchParams.value, offset: 0 };
  };

  // Limpiar: resetea el draft del store y los parámetros activos
  const commitClear = () => {
    orderStore.resetSearchParams();
    activeParams.value = { ...searchParams.value };
  };

  // Cambio de página: actualiza solo el offset en ambos
  const commitPage = (pagination: { page: number; rowsPerPage: number }) => {
    const offset = (pagination.page - 1) * (pagination.rowsPerPage || 10);
    searchParams.value.offset = offset;
    searchParams.value.limit = pagination.rowsPerPage || 10;
    activeParams.value = { ...searchParams.value };
  };

  return {
    orders,
    totalOrders,
    currentPage,
    searchParams,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    commitSearch,
    commitClear,
    commitPage,
  };
};
