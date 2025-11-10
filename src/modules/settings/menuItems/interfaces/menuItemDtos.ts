import type { ItemType } from './menuItemInterfaces';

export interface AddMenuItemsToProfileDto {
  ids: number[];
}

export interface MenusAssociated {
  profileId: number;
  menuIds: number[];
}

export interface MenuItemDto {
  id: number | undefined;
  title: string;
  order: number;
  caption: string | undefined;
  link: string | undefined;
  type: ItemType | undefined;
  icon: string | undefined;
  isActive?: boolean;
  parentId: number | undefined;
}
