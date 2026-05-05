import { api } from 'src/boot/axios';
import type { PartFailure, PartFailureItem } from '../interfaces/failures.interface';
import type { AddFailureDto } from '../interfaces/failures.dto';

const resourceUrl = 'rechecker';
const failuresResourceUrl = 'failures';

/**
 * Obtener fallas de una parte
 * GET /rechecker/parts/:partId/failures
 */
export const findPartFailures = async (partId: number): Promise<PartFailureItem[]> => {
  const res = await api.get<PartFailureItem[]>(`${resourceUrl}/parts/${partId}/failures`);
  return res.data;
};

/**
 * Agregar falla a una parte
 * POST /failures
 */
export const addFailure = async (
  body: AddFailureDto,
): Promise<{ message: string; failure: PartFailure }> => {
  const res = await api.post<{ message: string; failure: PartFailure }>(
    `${resourceUrl}/${failuresResourceUrl}`,
    body,
  );
  return res.data;
};

/**
 * Eliminar falla
 * DELETE /failures/:failureId
 */
export const deleteFailure = async (failureId: number): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(
    `${resourceUrl}/${failuresResourceUrl}/${failureId}`,
  );
  return res.data;
};
