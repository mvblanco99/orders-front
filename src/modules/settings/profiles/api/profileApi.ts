import { api } from 'src/boot/axios';

import type {
  DataFilterI,
  ProfileDtoI,
  ProfileI,
  ProfileItemI,
  ProfilePermissionsI,
  ProfileResponseI,
} from '../interfaces/profileInterfaces';

const profileUrl = 'profiles';

export const postProfile = async (body: ProfileDtoI) => {
  try {
    const res = await api.post<ProfileItemI>(profileUrl, body);
    return res.data;
  } catch (error) {
    console.error('Error en postProfile:', error);
    throw new Error('Error al crear el perfil');
  }
};

export const getProfiles = async (query?: DataFilterI) => {
  const res = await api.get<ProfileResponseI>(profileUrl, { timeout: 1000 * 30, params: query });
  return res.data;
};

export const getProfilesById = async (id: number) => {
  const res = await api.get<ProfileI>(`${profileUrl}/${id}`, { timeout: 1000 * 30 });
  return res.data;
};

//falta saber el tipado de la data que deberia mandar para actualizar
export const patchProfile = async (id: number, body: ProfileDtoI) => {
  try {
    const res = await api.patch(`${profileUrl}/${id}`, body, { timeout: 1000 * 30 });
    return res.data;
  } catch (error) {
    console.error(`Error en patchProfile para el perfil ${id}:`, error);
    throw new Error('Error al actualizar perfil');
  }
};

export const delProfile = async (id: number) => {
  try {
    return await api.delete(`${profileUrl}/${id}`, { timeout: 1000 * 30 });
  } catch (error) {
    console.error(`Error en delProfile para el perfil ${id}:`, error);
    throw new Error('Error al eliminar perfil');
  }
};

export const PostPermissions = async (id: number, data: ProfilePermissionsI) => {
  try {
    const res = await api.post(`${profileUrl}/${id}/permissions`, data);
    return res.data;
  } catch (error) {
    console.error(`Error en PostPermissions para el perfil ${id}:`, error);
    throw new Error('Error al asignar permisos');
  }
};

export const delPermissions = async (id: number, data: ProfilePermissionsI) => {
  try {
    return await api.patch(`${profileUrl}/${id}/permissions`, data);
  } catch (error) {
    console.error(`Error en delPermissions para el perfil ${id}:`, error);
    throw new Error('Error al eliminar permisos');
  }
};
