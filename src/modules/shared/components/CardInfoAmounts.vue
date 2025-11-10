<script setup lang="ts">
import BoxIcon from './BoxIcon.vue';

defineProps({
  icon: {
    type: String,
    default: 'sym_r_account_balance_wallet',
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
    default: '2rem',
  },
  title: {
    type: String,
    default: '',
  },
  amount: {
    type: [String, Number],
    default: '',
  },
  classNameContainer: {
    type: String,
    default: '',
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  shadow: {
    type: Boolean,
    default: true,
  },
  bgColor: {
    type: String,
    default: 'bg-white',
  },
});
</script>

<template>
  <div :class="classNameContainer">
    <q-card
      :bordered="bordered"
      :class="[
        bgColor + ' q-px-md q-py-sm flex items-center full-height rounded-borders',
        shadow ? 'shadow-1' : 'shadow-0',
      ]"
    >
      <q-card-section horizontal class="items-center">
        <q-card-section class="q-pa-none q-mr-md">
          <box-icon
            :icon="icon"
            size-icon="2rem"
            :color-container="colorContainer"
            :color-icon="colorIcon"
            :padding-container="'q-pa-sm'"
          />
        </q-card-section>
        <q-card-section class="q-pa-none col flex column justify-between">
          <div class="text-blue-grey-8 text-caption q-mb-xs">{{ title }}</div>
          <div class="text-weight-semi-bold">{{ amount }}</div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.card__credits .q-card:hover {
  background-color: $primary-50;
  transform: scale(1.02);
  transition: all 0.2s ease-in-out;
}
</style>
