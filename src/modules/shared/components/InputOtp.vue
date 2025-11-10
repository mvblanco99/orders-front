<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import useValidators from '../composables/useValidators';

interface Props {
  length: number;
  modelValue: string;
  disable: boolean;
  readonly: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits(['update:modelValue', 'complete']);

const inputs = ref<(HTMLInputElement | null)[]>([]);
const digits = computed(() => Array.from({ length: props.length }));

const { isNumber } = useValidators();

watch(
  () => props.length,
  async () => {
    if (modelValue.value.length > props.length) {
      modelValue.value = modelValue.value.slice(0, props.length);
    } else if (modelValue.value.length < props.length) {
      modelValue.value = modelValue.value.padEnd(props.length, '');
    }
    await nextTick();
    if (inputs.value[0]) {
      inputs.value[0].focus();
    }
  },
);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    if (value.length === props.length && value.length > 0) {
      emit('complete', value);
    }
  },
});

const updateDigit = (index: number, value: string) => {
  const newValue = modelValue.value.split('');
  newValue[index] = value;
  modelValue.value = newValue.join('');

  if (value && index < props.length - 1) {
    focusNext(index);
  }
};

const focusPrevious = (index: number) => {
  if (index > 0 && inputs.value[index - 1]) {
    inputs.value[index - 1]?.focus();
  }
};

const focusNext = (index: number) => {
  if (index < props.length - 1 && inputs.value[index + 1]) {
    inputs.value[index + 1]?.focus();
  }
};

const handlePaste = async (event: ClipboardEvent) => {
  const pastedData = event.clipboardData?.getData('text') || '';
  const validData = pastedData.slice(0, props.length).replace(/[^0-9a-zA-Z]/g, '');

  if (validData.length === props.length) {
    modelValue.value = validData;
    await nextTick();
    if (inputs.value[0]) {
      inputs.value[0].focus();
    }
  }
};
</script>

<template>
  <div class="row q-col-gutter-sm justify-center">
    <q-input
      v-for="(digit, index) in digits"
      :key="index"
      ref="inputs"
      :maxlength="1"
      :model-value="modelValue[index] || ''"
      @update:model-value="updateDigit(index, $event as string)"
      @keydown.delete="focusPrevious(index)"
      @keydown.left.prevent="focusPrevious(index)"
      @keydown.right.prevent="focusNext(index)"
      @paste="handlePaste"
      outlined
      dense
      style="width: 48px"
      type="text"
      inputmode="numeric"
      mask="#"
      :disable="disable"
      :readonly="readonly"
      class="input__otp"
      :rules="[isNumber]"
    />
  </div>
</template>

<style scoped>
.input__otp {
  font-size: 1.8rem;
}
</style>
