import { defineStore } from 'pinia';
import { Dark, LocalStorage } from 'quasar';

export const useMenuUiStore = defineStore('menuUi', {
  state: () => ({
    isMenuOpen: false,
    isMiniState: true,
    isDarkMode: false,
    isSubItemOpen: false,
    currentTitle: '',
    drawer: false,
  }),
  actions: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;

      this.isMiniState = false;
      if (this.isMenuOpen == false) this.isMiniState = true;
    },
    toggleMiniState() {
      this.isMiniState = !this.isMiniState;
    },
    toggleSubItem() {
      this.isSubItemOpen = !this.isSubItemOpen;
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },

    updateTheme(isDarkMode: boolean) {
      const theme = isDarkMode ? 'dark' : 'light';
      document.body.setAttribute('data-theme', theme);
    },

    toggleDark() {
      this.isDarkMode = !this.isDarkMode;
      LocalStorage.set('isDarkMode', this.isDarkMode);
      Dark.set(this.isDarkMode);
      this.updateTheme(this.isDarkMode);
    },

    checkDarkMode() {
      this.isDarkMode = LocalStorage.getItem('isDarkMode') || false;
      Dark.set(this.isDarkMode);
      this.updateTheme(this.isDarkMode);
    },
    resetMenuUi() {
      this.isMiniState = true;
      this.drawer = false;
      this.isMenuOpen = false;
      this.isSubItemOpen = false;
      this.currentTitle = '';
    },
  },
});
