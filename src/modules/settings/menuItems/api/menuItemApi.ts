import { api } from 'src/boot/axios';
import type {
  AddMenuItemToProfileResponseI,
  MenuItem,
  MenuItems,
  MenuItemsFilter,
} from '../interfaces/menuItemInterfaces';
import type {
  AddMenuItemsToProfileDto,
  MenuItemDto,
  MenusAssociated,
} from '../interfaces/menuItemDtos';

const menuItemUrl = 'menu-items';

export const findAllMenuItem = async (query: MenuItemsFilter): Promise<MenuItems> => {
  const res = await api.get(menuItemUrl, { params: { ...query, limit: 500 } });
  return res.data;
};

export const findMenuItemsByUser = async (): Promise<MenuItem[]> => {
  const res = await api.get(`${menuItemUrl}/by-user-profile`);
  return res.data;
};

export const findMenuItemById = async (id: number): Promise<MenuItem> => {
  const res = await api.get(`${menuItemUrl}/${id}`);
  return res.data;
};

export const findMenuItemByProfileId = async (profileId: number): Promise<{ id: number }[]> => {
  const res = await api.get(`${menuItemUrl}/by-user-profile/${profileId}?onlyIds=true`);
  return res.data;
};

export const postAddMenuItemToProfile = async (
  profileId: number,
  body: AddMenuItemsToProfileDto,
): Promise<AddMenuItemToProfileResponseI> => {
  const res = await api.post(`${menuItemUrl}/add-profiles/${profileId}`, { body });
  return res.data;
};

export const createMenuItem = async (body: MenuItemDto): Promise<MenuItem> => {
  const res = await api.post(menuItemUrl, body);
  return res.data;
};

export const updateMenuItem = async (payload: MenuItemDto): Promise<MenuItem> => {
  const { id, ...body } = payload;
  const res = await api.patch(`${menuItemUrl}/${id}`, body);
  return res.data;
};

export const updateMenuAssociated = async (payload: MenusAssociated): Promise<MenuItem> => {
  const { profileId, ...body } = payload;
  const res = await api.patch(`${menuItemUrl}/add-profiles/${profileId}`, body);
  return res.data;
};

export const removeMenuItem = async (id: number): Promise<void> => {
  await api.delete(`${menuItemUrl}/${id}`);
};
