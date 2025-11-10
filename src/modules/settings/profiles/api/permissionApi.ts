import { api } from 'src/boot/axios';
import type { DataFilterI, PermissionResponseI } from '../interfaces/permissionInterface';

const permissionUrl = 'permissions';

export const getPermission = async (params?: DataFilterI) => {
  const res = await api.get<PermissionResponseI>(permissionUrl, {
    timeout: 1000 * 30,
    params: params,
  });
  return res.data;
};
