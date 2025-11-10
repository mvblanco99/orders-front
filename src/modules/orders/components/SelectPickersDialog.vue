<script setup lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';

const { dialogRef, onDialogCancel } = useDialogPluginComponent();
const filter = ref('');
</script>
<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-pa-sm" style="width: 850px; max-width: 80vw">
      <q-card-section class="row items-center q-py-none q-pr-none">
        <div class="text-h5 text-weight-semi-bold">Asignar almacenistas</div>
        <q-space />
        <q-btn icon="sym_r_close" flat round dense @click="onDialogCancel" padding="md" />
      </q-card-section>

      <q-card-actions class="row justify-end">
        <q-table
          :rows="[]"
          :columns="[
            {
              label: 'Email',
              name: 'email',
              required: true,
              align: 'left',
              field: 'email',
            },
            {
              label: 'Usuario',
              name: 'name',
              required: true,
              align: 'center',
              field: 'name',
            },
          ]"
          row-key="id"
          no-data-label="No hay almacenistas seleccionado."
          no-results-label="No se encontraron resultados."
          bordered
          class="full-width q-mt-md shadow-1"
          :pagination="{ rowsPerPage: 5 }"
          :filter="filter"
        >
          <template v-slot:top-left>
            <q-input dense debounce="400" outlined clearable v-model="filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="sym_r_search" />
              </template>
            </q-input>
          </template>
        </q-table>
        <q-btn color="primary" label="Asignar" class="q-mt-md" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style scoped lang="scss"></style>
