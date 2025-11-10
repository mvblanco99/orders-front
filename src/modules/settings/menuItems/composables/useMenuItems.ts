import { storeToRefs } from 'pinia';
import { useMenuItemStore } from '../stores/useMenuItemStore';

const useMenuItems = () => {
  const store = useMenuItemStore();

  const { menuItems, menuFilters, menuItemDto, menuItemsFormatted, currentMenuItemLink } =
    storeToRefs(store);

  return {
    menuItems,
    menuFilters,
    menuItemDto,
    menuItemsFormatted,
    currentMenuItemLink,

    // Actions
    resetMenuItems: store.resetMenuItems,
    resetMenuDto: store.resetMenuDto,
    setMenuItemFormatted: store.setMenuItemsFormatted,
    setCurrentMenuItemLink: store.setMenuItemLink,
    resetMenuItemLink: store.resetMenuItemLink,
  };
};

export default useMenuItems;
