<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { MenuItem } from '../interfaces/menuItemInterfaces';
import { useMenuUi } from '../composables/usMenuUi';
import useMenuItems from '../composables/useMenuItems';

export interface EssentialLinkProps {
  menuItems: MenuItem[];
  currentRoute: string;
}
defineProps<EssentialLinkProps>();

const { isMenuOpen } = useMenuUi();
const { currentMenuItemLink } = useMenuItems();
const router = useRouter();

const navigateTo = async (link: string = '') => {
  if (isMenuOpen.value == true) isMenuOpen.value = false;
  if (!link) return;
  if (link.startsWith('http')) {
    window.open(link);
  } else {
    await router.push({ path: '/' + link });
  }
};

const compareRoute = (link: string) => {
  const normalize = (val: string | undefined) => {
    if (!val || val === '/' || val === 'home' || val === '/home') return 'home';
    return val.replace(/^\//, '');
  };
  return normalize(link) === normalize(currentMenuItemLink.value);
};
</script>

<template>
  <q-item
    class="q-ml-md"
    v-for="links in menuItems"
    :key="links.title!"
    clickable
    tag="a"
    v-ripple
    :active="compareRoute(links.link!)"
    @click="navigateTo(links.link)"
  >
    <!-- <q-item-section v-if="links.icon" avatar>
      <q-icon :name="links.icon" />
    </q-item-section> -->

    <q-item-section>
      <q-item-label>{{ links.title }}</q-item-label>
      <q-item-label class="item_caption text-color-primary-100" caption>{{
        links.caption
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
