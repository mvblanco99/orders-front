<script setup lang="ts">
import { computed } from 'vue';
import type { QTableColumn } from 'quasar';
import type { OrderPart } from '../interfaces/order.interface';

interface Props {
  parts: OrderPart[];
  loading?: boolean;
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  editable: false,
});

const emit = defineEmits<{
  edit: [part: OrderPart];
  delete: [partId: number];
}>();

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
  {
    name: 'rechecker',
    label: 'Rechecker',
    field: 'recheckerId',
    align: 'left',
    sortable: true,
    format: (val: number | null) => (val ? `ID: ${val}` : 'Sin asignar'),
  },
  {
    name: 'packer',
    label: 'Packer',
    field: 'packerId',
    align: 'left',
    sortable: true,
    format: (val: number | null) => (val ? `ID: ${val}` : 'Sin asignar'),
  },
];

if (props.editable) {
  columns.push({
    name: 'actions',
    label: 'Acciones',
    field: 'id',
    align: 'center',
  });
}

const totalQuantity = computed(() => {
  return props.parts.reduce((sum, part) => sum + part.quantity, 0);
});

const handleEdit = (part: OrderPart) => {
  emit('edit', part);
};

const handleDelete = (partId: number) => {
  emit('delete', partId);
};
</script>

<template>
  <div class="order-parts-table">
    <q-table
      :rows="parts"
      :columns="columns"
      row-key="id"
      :loading="loading"
      no-data-label="No hay partes agregadas."
      bordered
      flat
      class="shadow-1"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:top>
        <div class="row items-center full-width">
          <div class="text-h6 text-weight-semi-bold">Partes de la orden</div>
          <q-space />
          <div class="text-body2 text-grey-700">
            <span class="text-weight-semi-bold">Total de unidades:</span>
            {{ totalQuantity }}
          </div>
        </div>
      </template>

      <template v-slot:body-cell-picker="slotProps">
        <q-td :props="slotProps">
          <q-chip size="sm" color="primary" text-color="white" dense>
            Picker ID: {{ slotProps.row.pickerId }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-rechecker="slotProps">
        <q-td :props="slotProps">
          <q-chip
            v-if="slotProps.row.recheckerId"
            size="sm"
            color="positive"
            text-color="white"
            dense
          >
            Rechecker ID: {{ slotProps.row.recheckerId }}
          </q-chip>
          <q-badge v-else color="grey-5" text-color="grey-8" label="Sin asignar" />
        </q-td>
      </template>

      <template v-slot:body-cell-packer="slotProps">
        <q-td :props="slotProps">
          <q-chip
            v-if="slotProps.row.packerId"
            size="sm"
            color="secondary"
            text-color="white"
            dense
          >
            Packer ID: {{ slotProps.row.packerId }}
          </q-chip>
          <q-badge v-else color="grey-5" text-color="grey-8" label="Sin asignar" />
        </q-td>
      </template>

      <template v-if="editable" v-slot:body-cell-actions="slotProps">
        <q-td :props="slotProps">
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="sym_r_edit"
            color="primary"
            @click="handleEdit(slotProps.row)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="sym_r_delete"
            color="negative"
            @click="handleDelete(slotProps.row.id)"
            :disable="!!slotProps.row.recheckerId"
          >
            <q-tooltip>{{
              slotProps.row.recheckerId ? 'No se puede eliminar (ya asignada)' : 'Eliminar'
            }}</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<style scoped lang="scss">
.order-parts-table {
  width: 100%;
}
</style>
