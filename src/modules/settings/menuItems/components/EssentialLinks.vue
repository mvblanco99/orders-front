<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { MenuItemFormatted } from '../interfaces/menuItemInterfaces';
import { ItemType } from '../interfaces/menuItemInterfaces';
import { useMenuUi } from '../composables/usMenuUi';
import EssentialSubLinks from './EssentialSubLinks.vue';
import useMenuItems from '../composables/useMenuItems';

const { isSubItemOpen, currentTitle, isMiniState } = useMenuUi();
const { currentMenuItemLink } = useMenuItems();
const route = useRoute();

const props = withDefaults(defineProps<MenuItemFormatted>(), {
  caption: '',
  link: '#',
  icon: '',
});

const router = useRouter();

const navigateTo = async (link: string = '') => {
  currentTitle.value = props.title!;
  isSubItemOpen.value = false;

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
  const current = normalize(currentMenuItemLink.value);
  const target = normalize(link);
  return current === target || current.startsWith(target + '/');
};

const isParentActive = computed(() => {
  if (props.type !== ItemType.dropdown || !props.subItems) return false;
  return props.subItems.some((item) => item.link && compareRoute(item.link));
});
</script>

<template>
  <q-expansion-item
    v-if="type === ItemType.dropdown"
    group="somegroup"
    clickable
    :label="title"
    :icon="icon"
    :class="{
      'rounded-borders text-weight-medium text-white': true,
      'q-item--active': isMiniState && isParentActive,
    }"
    :active="isParentActive || (isMiniState && isParentActive)"
  >
    <q-list class="q-gutter-sm" padding>
      <EssentialSubLinks :current-route="route.fullPath" :menu-items="subItems" />
    </q-list>
  </q-expansion-item>

  <q-item
    v-else
    clickable
    v-ripple
    class="rounded-borders text-weight-medium"
    :active="compareRoute(link!)"
    @click="navigateTo(link)"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label class="item_caption text-color-primary-100" caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
