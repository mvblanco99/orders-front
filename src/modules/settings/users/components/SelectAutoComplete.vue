<script setup lang="ts">
import { ref } from 'vue';
import type { DropDown } from 'src/modules/shared/interface/DropDown';

interface Props {
  options: DropDown[];
  label: string;
}

interface Emits {
  (e: 'selection', model: DropDown): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const options2 = ref<DropDown[]>(props.options);
const model = ref();

const filterFn = (val: string, update: (fn: () => void) => void) => {
  if (val === '') {
    update(() => (options2.value = props.options));
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options2.value = props.options.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
};
</script>

<template>
  <q-select
    clearable
    v-model="model"
    map-options
    use-input
    :options="options2"
    :label="label"
    input-debounce="0"
    @filter="filterFn"
    @update:model-value="emits('selection', model || { value: undefined })"
  />
</template>

<style scoped></style>
