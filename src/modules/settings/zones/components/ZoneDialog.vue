<script setup lang="ts">
import { computed, ref } from 'vue';
import { QForm, useDialogPluginComponent } from 'quasar';

import { useZoneMutation } from '../composables/useZoneMutation';
import useValidators from 'src/modules/shared/composables/useValidators';

const { dialogRef, onDialogCancel } = useDialogPluginComponent();
const { zoneDto, createZoneMutation, updateZoneMutation } = useZoneMutation();
const { isRequired } = useValidators();

const myForm = ref<QForm>();
const isEditing = computed(() => !!zoneDto.value.id);

const onSubmit = async () => {
  if (!(await myForm.value?.validate())) return;

  try {
    await (isEditing.value
      ? updateZoneMutation.mutateAsync(zoneDto.value)
      : createZoneMutation.mutateAsync(zoneDto.value));
    onDialogCancel();
  } catch (error) {
    console.error('Error submitting zone:', error);
  }
};
</script>

<template>
  <q-dialog ref="dialogRef" :persistent="false">
    <q-card class="q-pa-sm" style="width: 600px; max-width: 80vw">
      <q-form ref="myForm" @submit.prevent="onSubmit">
        <q-card-section class="row justify-between items-center">
          <div class="text-h5 text-weight-semi-bold">Agregar nueva Zona</div>
          <q-space />
          <q-btn icon="sym_r_close" flat round dense @click="onDialogCancel" padding="md" />
        </q-card-section>

        <q-card-section class="flex row q-col-gutter-md">
          <q-input
            v-if="isEditing"
            class="col-12"
            v-model="zoneDto.id"
            type="text"
            dense
            outlined
            label="Código"
            :rules="[isRequired]"
          />

          <q-input
            class="col-12"
            v-model="zoneDto.name"
            label="Nombre"
            dense
            outlined
            :rules="[isRequired]"
          />

          <q-toggle class="col-12" v-model="zoneDto.isActive" label="Activo" />
        </q-card-section>

        <q-card-actions class="flex justify-end">
          <q-btn
            color="primary"
            :label="isEditing ? 'Editar' : 'Crear'"
            type="submit"
            class="rounded-borders"
            no-caps
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
