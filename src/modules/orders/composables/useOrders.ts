import { storeToRefs } from 'pinia';
import { Loading } from 'quasar';
import { useOrderStore } from '../stores/useOrderStore';
import { findAllOrders, findOrderById, deleteOrder as apiDeleteOrder } from '../api/ordersApi';
import useNotify from '../../shared/composables/useNotify';
import useHandlerErrors from '../../shared/composables/useHandlerErrors';
import type { OrderSearchParams } from '../interfaces/order.dto';

export const useOrders = () => {
  const orderStore = useOrderStore();
  const notify = useNotify();
  const { handleApiResponseError } = useHandlerErrors();

  const { orders, orderDetail, searchParams, totalOrders, currentPage, totalPages } =
    storeToRefs(orderStore);

  /**
   * Obtener lista de órdenes con filtros
   */
  const fetchOrders = async (params?: OrderSearchParams) => {
    Loading.show({
      message: 'Cargando órdenes...',
    });

    try {
      const finalParams = params || searchParams.value;
      const response = await findAllOrders(finalParams);

      orders.value = response.data;
      totalOrders.value = response.meta.total;
      currentPage.value = response.meta.page;
      totalPages.value = response.meta.totalPages;

      return response;
    } catch (error) {
      handleApiResponseError(error);
      throw error;
    } finally {
      Loading.hide();
    }
  };

  /**
   * Obtener una orden por ID
   */
  const fetchOrderById = async (id: number) => {
    Loading.show({
      message: 'Cargando orden...',
    });

    try {
      const order = await findOrderById(id);
      orderDetail.value = order;
      return order;
    } catch (error) {
      handleApiResponseError(error);
      throw error;
    } finally {
      Loading.hide();
    }
  };

  /**
   * Eliminar una orden
   */
  const deleteOrder = async (id: number) => {
    Loading.show({
      message: 'Eliminando orden...',
    });

    try {
      await apiDeleteOrder(id);
      notify.successNotify('Orden eliminada exitosamente');
      // Refresh la lista después de eliminar
      await fetchOrders();
    } catch (error) {
      handleApiResponseError(error);
      throw error;
    } finally {
      Loading.hide();
    }
  };

  /**
   * Cambiar de página en la lista
   */
  const changePage = (page: number) => {
    searchParams.value.offset = (page - 1) * (searchParams.value.limit || 10);
    return fetchOrders();
  };

  return {
    // State
    orders,
    orderDetail,
    searchParams,
    totalOrders,
    currentPage,
    totalPages,

    // Actions
    fetchOrders,
    fetchOrderById,
    deleteOrder,
    changePage,
  };
};
