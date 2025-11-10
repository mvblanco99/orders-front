<script setup lang="ts">
import MenuContent from './MenuContent.vue';
import { useMenuUi } from '../composables/usMenuUi';
import { useQuasar } from 'quasar';

const { isMiniState, drawer } = useMenuUi();
const $q = useQuasar();
</script>
<template>
  <q-drawer
    v-model="drawer"
    show-if-above
    :mini="isMiniState"
    @mouseenter="isMiniState = false"
    @mouseleave="isMiniState = true"
    :width="280"
    :breakpoint="500"
    :mini-width="72"
    :class="[$q.dark.isActive ? 'bg-grey-9' : 'bg-transparent', 'sidebar']"
    :mini-to-overlay="isMiniState ? false : true"
  >
    <div class="sidebar__container full-height">
      <MenuContent />
    </div>
  </q-drawer>
</template>
