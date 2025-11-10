export enum ItemType {
  separator = 'separator',
  link = 'link',
  dropdown = 'dropdown',
}
export interface MenuItem {
  id: number;
  title: string;
  order: number;
  caption?: string;
  link?: string;
  type?: ItemType;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parentId?: number;
}

export interface MenuItemFormatted {
  id?: number;
  title?: string;
  order?: number;
  caption?: string;
  link?: string;
  type?: ItemType;
  icon?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  subItems: MenuItem[];
}

export interface MenuItems {
  data: MenuItem[];
  total: number;
}

export interface MenuItemsFilter {
  limit?: number;
  offset?: number;
  profileId?: number;
  parentId?: number;
  inputSearch?: string;
}

export interface AddMenuItemToProfileResponseI {
  message: string;
  data: number[];
}
