import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Order, OrderAssignResponse } from '../interfaces/order.interface';
import type { CreateOrderDto, UpdateOrderDto, OrderSearchParams } from '../interfaces/order.dto';

// Estado inicial para CreateOrderDto
const initialCreateOrderDto: CreateOrderDto = {
  zoneId: 0,
  totalUnits: 0,
  totalParts: 0,
  orderNumber: '',
  parts: [],
};

// Estado inicial para UpdateOrderDto
const initialUpdateOrderDto: Partial<UpdateOrderDto> = {};

// Estado inicial para filtros de búsqueda
const initialSearchParams: OrderSearchParams = {
  limit: 10,
  offset: 0,
};

export const useOrderStore = defineStore('orders', () => {
  // State
  const orders = ref<Order[]>([]);
  const orderDetail = ref<Order | null>(null);
  const orderForAssign = ref<OrderAssignResponse | null>(null);
  const createOrderDto = ref<CreateOrderDto>(structuredClone(initialCreateOrderDto));
  const updateOrderDto = ref<Partial<UpdateOrderDto>>(structuredClone(initialUpdateOrderDto));
  const searchParams = ref<OrderSearchParams>(structuredClone(initialSearchParams));
  const totalOrders = ref<number>(0);
  const currentPage = ref<number>(1);
  const totalPages = ref<number>(1);

  // Actions para resetear estados
  const resetOrders = () => {
    orders.value = [];
    totalOrders.value = 0;
    currentPage.value = 1;
    totalPages.value = 1;
  };

  const resetOrderDetail = () => {
    orderDetail.value = null;
  };

  const resetOrderForAssign = () => {
    orderForAssign.value = null;
  };

  const resetCreateOrderDto = () => {
    createOrderDto.value = structuredClone(initialCreateOrderDto);
  };

  const resetUpdateOrderDto = () => {
    updateOrderDto.value = structuredClone(initialUpdateOrderDto);
  };

  const resetSearchParams = () => {
    searchParams.value = structuredClone(initialSearchParams);
  };

  const resetAll = () => {
    resetOrders();
    resetOrderDetail();
    resetOrderForAssign();
    resetCreateOrderDto();
    resetUpdateOrderDto();
    resetSearchParams();
  };

  return {
    // State
    orders,
    orderDetail,
    orderForAssign,
    createOrderDto,
    updateOrderDto,
    searchParams,
    totalOrders,
    currentPage,
    totalPages,

    // Actions
    resetOrders,
    resetOrderDetail,
    resetOrderForAssign,
    resetCreateOrderDto,
    resetUpdateOrderDto,
    resetSearchParams,
    resetAll,
  };
});
