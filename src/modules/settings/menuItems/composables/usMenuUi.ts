import { storeToRefs } from 'pinia';

import { useMenuUiStore } from '../stores/useMenuUiStore';

export const useMenuUi = () => {
  const store = useMenuUiStore();
  const { isMenuOpen, isDarkMode, isMiniState, isSubItemOpen, currentTitle, drawer } =
    storeToRefs(store);

  return {
    isMenuOpen,
    isDarkMode,
    isMiniState,
    isSubItemOpen,
    currentTitle,
    drawer,
    toggleMenu: store.toggleMenu.bind(store),
    toggleDark: store.toggleDark.bind(store),
    checkDarkMode: store.checkDarkMode.bind(store),
    toggleSubItem: store.toggleSubItem.bind(store),
    toggleMiniState: store.toggleMiniState.bind(store),
    toggleDrawer: store.toggleDrawer.bind(store),
  };
};
