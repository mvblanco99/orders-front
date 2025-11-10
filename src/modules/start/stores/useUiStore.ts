import { defineStore } from 'pinia';
import { Dark, LocalStorage } from 'quasar';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isMenuOpen: false,
    isMiniState: true,
    isDarkMode: false,
    isSubItemOpen: false,
    currentTitle: '',
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
  },
});
