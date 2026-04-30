import { api } from 'src/boot/axios';
import type {
  Order,
  OrderDetail,
  OrdersResponse,
  OrderAssignResponse,
  AssignPartsResponse,
} from '../interfaces/order.interface';
import type {
  CreateOrderDto,
  AddOrderDetailDto,
  UpdateOrderDto,
  UpdateOrderHeaderDto,
  UpdateOrderDetailDto,
  AssignPartsDto,
  OrderSearchParams,
} from '../interfaces/order.dto';

const resourceUrl = 'orders';

/**
 * Crear una nueva orden
 * POST /orders
 */
export const createOrder = async (body: CreateOrderDto): Promise<Order> => {
  const res = await api.post<Order>(resourceUrl, body);
  return res.data;
};

/**
 * Listar órdenes con filtros y paginación
 * GET /orders
 */
export const findAllOrders = async (params?: OrderSearchParams): Promise<OrdersResponse> => {
  const res = await api.get<OrdersResponse>(resourceUrl, { params });
  return res.data;
};

/**
 * Obtener una orden por ID
 * GET /orders/:id
 */
/**
 * Obtener una orden por ID
 * GET /orders/:id
 */
export const findOrderById = async (id: number, viewAll = false): Promise<Order> => {
  const res = await api.get<Order>(`${resourceUrl}/${id}`, { params: { viewAll } });
  return res.data;
};

/**
 * Obtener orden para asignación (partes sin asignar)
 * GET /orders/assign/:orderNumber
 */
export const findOrderForAssign = async (orderNumber: string): Promise<OrderAssignResponse> => {
  const res = await api.get<OrderAssignResponse>(`${resourceUrl}/assign/${orderNumber}`);
  return res.data;
};

/**
 * Actualizar una orden existente
 * PATCH /orders/:id
 */
export const updateOrder = async (id: number, body: UpdateOrderDto): Promise<Order> => {
  const res = await api.patch<Order>(`${resourceUrl}/${id}`, body);
  return res.data;
};

/**
 * Actualizar la cabecera de una orden (número, zona, totalUnits)
 * PATCH /orders/:id/header
 */
export const updateOrderHeader = async (id: number, body: UpdateOrderHeaderDto): Promise<Order> => {
  const res = await api.patch<Order>(`${resourceUrl}/${id}/header`, body);
  return res.data;
};

/**
 * Agregar un nuevo detalle/parte a una orden existente
 * POST /orders/:orderNumber/details
 */
export const addOrderDetail = async (
  orderNumber: string,
  body: AddOrderDetailDto,
): Promise<OrderDetail> => {
  const res = await api.post<OrderDetail>(`${resourceUrl}/${orderNumber}/details`, body);
  return res.data;
};

/**
 * Actualizar el detalle de una orden (cantidad, picker, rechecker, packer)
 * PATCH /orders/details/:id
 */
export const updateOrderDetail = async (
  id: number,
  body: UpdateOrderDetailDto,
): Promise<OrderDetail> => {
  const res = await api.patch<OrderDetail>(`${resourceUrl}/details/${id}`, body);
  return res.data;
};

/**
 * Deshabilitar un detalle de la orden y su parte asociada (soft delete)
 * DELETE /orders/details/:id
 */
export const removeOrderDetail = async (id: number): Promise<void> => {
  await api.delete(`${resourceUrl}/details/${id}`);
};

/**
 * Asignación masiva de rechecker y packer a partes
 * PATCH /orders/assign
 */
export const assignParts = async (body: AssignPartsDto): Promise<AssignPartsResponse> => {
  const res = await api.patch<AssignPartsResponse>(`${resourceUrl}/assign`, body);
  return res.data;
};

/**
 * Eliminar una orden (soft delete)
 * DELETE /orders/:id
 */
export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`${resourceUrl}/${id}`);
};
