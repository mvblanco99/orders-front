<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDialogPluginComponent, QTableColumn } from 'quasar';
import { useOrderAssignment } from '../composables/useOrderAssignment';
import type { OrderPart } from '../interfaces/order.interface';

interface Props {
  orderNumber: string;
}

const props = defineProps<Props>();
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const { fetchOrderForAssign, assignParts, orderForAssign } = useOrderAssignment();

const filter = ref('');
const recheckerId = ref<number | null>(null);
const packerId = ref<number | null>(null);
const selectedParts = ref<OrderPart[]>([]);
const loading = ref(false);

// Cargar orden al montar el componente
const loadOrder = async () => {
  loading.value = true;
  try {
    await fetchOrderForAssign(props.orderNumber);
  } finally {
    loading.value = false;
  }
};

loadOrder();

const columns: QTableColumn[] = [
  {
    name: 'partNumber',
    label: 'Parte #',
    field: 'partNumber',
    align: 'center',
    sortable: true,
  },
  {
    name: 'quantity',
    label: 'Cantidad',
    field: 'quantity',
    align: 'center',
    sortable: true,
  },
  {
    name: 'picker',
    label: 'Picker',
    field: 'pickerId',
    align: 'left',
    sortable: true,
  },
];

const unassignedParts = computed(() => orderForAssign.value?.unassignedParts || []);

const canAssign = computed(() => {
  return recheckerId.value && packerId.value && selectedParts.value.length > 0;
});

const handleAssign = async () => {
  if (!canAssign.value) return;

  try {
    loading.value = true;
    const partIds = selectedParts.value.map((p) => p.id);
    await assignParts({
      recheckerId: recheckerId.value!,
      packerId: packerId.value!,
      partIds,
    });
    onDialogOK();
  } catch (error) {
    // Error handled by composable
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-pa-sm" style="width: 900px; max-width: 90vw">
      <q-card-section class="row items-center q-py-md q-pr-none">
        <div>
          <div class="text-h5 text-weight-semi-bold">Asignar rechecker y packer</div>
          <div class="text-body2 text-grey-600 q-mt-xs">
            Orden: <span class="text-weight-semi-bold">{{ orderNumber }}</span> - Partes sin
            asignar:
            <span class="text-weight-semi-bold">{{
              orderForAssign?.unassignedPartsCount || 0
            }}</span>
          </div>
        </div>
        <q-space />
        <q-btn icon="sym_r_close" flat round dense @click="onDialogCancel" padding="md" />
      </q-card-section>

      <q-separator />

      <!-- Selección de usuarios -->
      <q-card-section class="q-pt-md">
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-select
              v-model="recheckerId"
              label="Rechecker"
              outlined
              dense
              :options="[]"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              clearable
              :rules="[(val) => !!val || 'Rechecker requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="sym_r_person" />
              </template>
            </q-select>
          </div>
          <div class="col-6">
            <q-select
              v-model="packerId"
              label="Packer"
              outlined
              dense
              :options="[]"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              clearable
              :rules="[(val) => !!val || 'Packer requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="sym_r_person" />
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>

      <!-- Tabla de partes -->
      <q-card-section>
        <q-table
          v-model:selected="selectedParts"
          :rows="unassignedParts"
          :columns="columns"
          row-key="id"
          selection="multiple"
          :loading="loading"
          no-data-label="No hay partes pendientes de asignar."
          no-results-label="No se encontraron resultados."
          bordered
          class="shadow-1"
          :pagination="{ rowsPerPage: 10 }"
          :filter="filter"
        >
          <template v-slot:top-left>
            <q-input dense debounce="400" outlined clearable v-model="filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="sym_r_search" />
              </template>
            </q-input>
          </template>

          <template v-slot:top-right>
            <div class="text-body2 text-grey-700">
              <q-icon name="sym_r_info" size="18px" class="q-mr-xs" />
              Seleccione las partes a asignar
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" color="grey-7" @click="onDialogCancel" />
        <q-btn
          unelevated
          label="Asignar"
          color="primary"
          :disable="!canAssign"
          :loading="loading"
          @click="handleAssign"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss"></style>
