<script lang="ts" setup>
import { ref, watchEffect } from 'vue';

interface Props {
  date: string | null;
  label?: string;
  optionsFn?: (date: string) => boolean;
}

interface Emits {
  (e: 'selection', date: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const showPopupDate = ref(false);

const newDate = ref<string>('');

newDate.value = props.date || '';

const onChange = (date: string) => {
  emits('selection', date);
  showPopupDate.value = false;
};

watchEffect(() => {
  if (props.date) newDate.value = props.date;
});
</script>

<template>
  <q-input
    outlined
    v-model="newDate"
    :label="label || 'Date'"
    @update:model-value="emits('selection', newDate)"
  >
    <template v-slot:append>
      <q-icon name="sym_r_event" class="cursor-pointer">
        <q-popup-proxy
          v-model="showPopupDate"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="newDate"
            mask="YYYY-MM-DD"
            no-unset
            @update:model-value="onChange"
            :options="optionsFn"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Cerrar" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
