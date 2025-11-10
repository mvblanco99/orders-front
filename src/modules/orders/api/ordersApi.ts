import { api } from 'src/boot/axios';
import type {
  Order,
  OrdersResponse,
  OrderAssignResponse,
  AssignPartsResponse,
} from '../interfaces/order.interface';
import type {
  CreateOrderDto,
  UpdateOrderDto,
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
export const findOrderById = async (id: number): Promise<Order> => {
  const res = await api.get<Order>(`${resourceUrl}/${id}`);
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
