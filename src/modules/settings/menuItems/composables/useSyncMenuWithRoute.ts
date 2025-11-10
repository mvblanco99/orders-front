import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuItemStore } from '../stores/useMenuItemStore';

export const useSyncMenuWithRoute = () => {
  const route = useRoute();
  const menuStore = useMenuItemStore();

  watch(
    () => route.path,
    (newPath) => {
      menuStore.setMenuItemLink(newPath.replace(/^\//, ''));
    },
    { immediate: true },
  );
};

export default useSyncMenuWithRoute;
