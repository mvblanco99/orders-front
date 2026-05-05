import { api } from 'src/boot/axios';
import type { RecheckerOrder } from '../interfaces/rechecker.interface';
import type { AssignRecheckerDto } from '../interfaces/rechecker.dto';

const resourceUrl = 'rechecker';

/**
 * Obtener orden con partes sin rechecker asignado
 * GET /orders/rechecker/:orderNumber
 */
export const findOrderForRechecker = async (orderNumber: string): Promise<RecheckerOrder> => {
  const res = await api.get<RecheckerOrder>(`${resourceUrl}/orders/${orderNumber}`);
  return res.data;
};

/**
 * Asignar rechecker a partes seleccionadas
 * PATCH /rechecker/parts/assign
 */
export const assignRechecker = async (
  body: AssignRecheckerDto,
): Promise<{ message: string; partsUpdated: number }> => {
  const res = await api.patch<{ message: string; partsUpdated: number }>(
    `${resourceUrl}/parts/assign`,
    body,
  );
  return res.data;
};
