<script setup lang="ts">
// import { defineProps } from 'vue';

defineProps({
  icon: {
    type: String,
    default: 'sym_r_check',
  },
  colorIcon: {
    type: String,
    default: 'primary',
  },
  colorContainer: {
    type: String,
    default: 'bg-indigo-1',
  },
  sizeIcon: {
    type: String,
    default: 'sm',
  },
  paddingContainer: {
    type: String,
    default: 'q-pa-md',
  },
});
</script>

<template>
  <div
    :class="'box-icon__container rounded-borders' + ' ' + colorContainer + ' ' + paddingContainer"
  >
    <q-icon :name="icon" :color="colorIcon" :size="sizeIcon" />
  </div>
</template>

<style scoped>
.box-icon__container {
  width: max-content;
}
</style>
