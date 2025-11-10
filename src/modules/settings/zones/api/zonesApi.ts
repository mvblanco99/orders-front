import { api } from 'src/boot/axios';
import type { ZoneResponse, ZoneItem, ZoneDto } from '../interfaces/ZoneInterface';

const resourceUrl = 'zones';

export const findAllZones = async ({ limit = 10, offset = 0, inputSearch = '' }) => {
  const params = { limit, offset, inputSearch: inputSearch || undefined };
  const res = await api.get<ZoneResponse>(resourceUrl, { params });
  return res.data;
};

export const findZoneById = async (id: number): Promise<ZoneItem> => {
  const res = await api.get(`${resourceUrl}/${id}`);
  return res.data;
};

export const createZone = async (body: ZoneDto) => {
  const res = await api.post(`${resourceUrl}`, body);
  return res.data;
};

export const updateZone = async (body: Partial<ZoneDto>) => {
  const { id, ...rest } = body;
  const res = await api.patch(`${resourceUrl}/${id}`, rest);
  return res.data;
};

export const deleteZone = async (zoneId: number) => {
  const res = await api.delete(`${resourceUrl}/${zoneId}`);
  return res.data;
};
