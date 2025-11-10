<script setup lang="ts">
interface Props {
  classLeft?: string;
  classRight?: string;
}
withDefaults(defineProps<Props>(), {
  classLeft: 'col-xs-12 col-sm-3',
  classRight: 'col-xs-12 col-sm-9',
});
</script>

<template>
  <q-card class="shadow-card">
    <div class="row q-col-gutter-md">
      <div :class="classLeft">
        <slot name="left"> </slot>
      </div>

      <div :class="classRight">
        <slot name="right"> </slot>
      </div>
    </div>
  </q-card>
</template>

<style scoped></style>
