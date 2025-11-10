import { ref } from 'vue';
import { LocalStorage } from 'quasar';

import type {
  MenuItem,
  MenuItemFormatted,
  MenuItemsFilter,
} from '../interfaces/menuItemInterfaces';
import { defineStore } from 'pinia';

import type { MenuItemDto } from '../interfaces/menuItemDtos';

const initStateDto: MenuItemDto = {
  id: undefined,
  title: '',
  order: 0,
  caption: undefined,
  link: undefined,
  type: undefined,
  icon: undefined,
  isActive: false,
  parentId: undefined,
};

export const useMenuItemStore = defineStore('menuItem', () => {
  const menuItems = ref<MenuItem[]>([]);
  const menuItemsFormatted = ref<MenuItemFormatted[] | undefined>([]);
  const menuFilters = ref<MenuItemsFilter>({});
  const menuItemDto = ref<MenuItemDto>(structuredClone(initStateDto));
  const currentMenuItemLink = ref<string>('/');

  const setMenuItemLink = (newLink: string) => {
    currentMenuItemLink.value = newLink;
    LocalStorage.set('currentMenuItemLink', newLink);
  };

  const resetMenuItemLink = () => {
    currentMenuItemLink.value = '/';
    LocalStorage.removeItem('currentMenuItemLink');
    resetMenuItems();
  };

  const getMenuItemLinkFromLocalStorage = () => {
    return LocalStorage.getItem<string>('currentMenuItemLink') ?? '/';
  };

  const fillCurrentMenuLink = () => {
    currentMenuItemLink.value = getMenuItemLinkFromLocalStorage();
  };

  const resetMenuItems = () => {
    menuItemsFormatted.value = [];
    LocalStorage.removeItem('menuItems');
  };

  const resetMenuDto = () => {
    menuItemDto.value = structuredClone(initStateDto);
  };

  const setMenuItemsFormatted = (newMenu: MenuItemFormatted[]) => {
    LocalStorage.set('menuItems', newMenu);
    menuItemsFormatted.value = newMenu;
  };

  const getMenuItemFromLocalStorage = () => {
    return LocalStorage.getItem<MenuItemFormatted[]>('menuItemsFormatted') ?? undefined;
  };

  const fillMenu = () => {
    menuItemsFormatted.value = getMenuItemFromLocalStorage();
  };

  fillMenu();
  fillCurrentMenuLink();

  return {
    // State
    menuItems,
    menuFilters,
    menuItemDto,
    menuItemsFormatted,
    currentMenuItemLink,

    // Actions
    resetMenuItems,
    resetMenuDto,
    setMenuItemsFormatted,
    setMenuItemLink,
    resetMenuItemLink,
  };
});
