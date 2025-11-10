<script lang="ts" setup>
import { useQuasar } from 'quasar';

interface Props {
  title: string;
  subTitle?: string;
  buttonLabel?: string;
  empty?: boolean;
  hasButtons?: boolean;
  hasIconBeforeTitle?: boolean;
  iconButton?: string;
}

interface Emits {
  (event: 'openDialog'): void;
}

const $q = useQuasar();

/* const isDesktopXs = () => {
  return $q.screen.xs ? 'text-bold text-h5 q-my-none' : 'text-bold text-h4 q-my-none';
}; */
withDefaults(defineProps<Props>(), {
  hasButtons: false,
});
const emits = defineEmits<Emits>();
</script>

<template>
  <div class="row col-12 justify-between q-py-sm q-px-none q-mb-sm">
    <div v-if="hasIconBeforeTitle" class="flex q-mb-md q-mr-md">
      <slot name="iconBeforeTitle"></slot>
      <h2 :class="`q-my-none `">
        <slot name="beforeTitle"></slot>
        {{ title }}
      </h2>
      <p v-if="subTitle?.length" class="text-blue-grey-8">{{ subTitle }}</p>
    </div>
    <div v-else>
      <h2 :class="`q-my-none `">
        <slot name="beforeTitle"></slot>
        {{ title }}
      </h2>
      <p v-if="subTitle?.length" class="text-blue-grey-8">{{ subTitle }}</p>
    </div>

    <div>
      <div class="flex items-center justify-end q-gutter-sm">
        <slot name="extra-actions"></slot>
        <q-btn
          class="rounded-borders"
          v-if="buttonLabel"
          :outline="empty ? false : true"
          color="primary"
          :icon="iconButton ? iconButton : 'sym_r_add'"
          :label="$q.screen.xs ? '' : `${buttonLabel}`"
          no-caps
          @click="emits('openDialog')"
        />
      </div>
    </div>
  </div>
  <q-page-sticky expand position="top"> </q-page-sticky>
</template>
