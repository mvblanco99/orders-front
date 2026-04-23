<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';
import { useOrders } from '../composables/useOrders';
import OrderFilters from '../components/OrderFilters.vue';
import AssignPartsDialog from '../components/AssignPartsDialog.vue';
import type { Order } from '../interfaces/order.interface';

const router = useRouter();
const $q = useQuasar();
const { orders, totalOrders, currentPage, fetchOrders, deleteOrder } = useOrders();

const loading = ref(false);
const showFilters = ref(false);

const columns: QTableColumn[] = [
  {
    name: 'orderNumber',
    label: 'Número de orden',
    field: 'orderNumber',
    align: 'left',
    sortable: true,
  },
  {
    name: 'zone',
    label: 'Zona',
    field: 'zoneId',
    align: 'center',
    sortable: true,
  },
  {
    name: 'totalUnits',
    label: 'Total unidades',
    field: 'totalUnits',
    align: 'center',
    sortable: true,
  },
  {
    name: 'totalParts',
    label: 'Total partes',
    field: 'totalParts',
    align: 'center',
    sortable: true,
  },
  {
    name: 'orderDate',
    label: 'Fecha',
    field: 'orderDate',
    align: 'center',
    sortable: true,
    format: (val: string) => new Date(val).toLocaleDateString('es-ES'),
  },
  {
    name: 'status',
    label: 'Estado',
    field: 'status',
    align: 'center',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'id',
    align: 'center',
  },
];

onMounted(async () => {
  await loadOrders();
});

const loadOrders = async () => {
  loading.value = true;
  try {
    await fetchOrders();
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  await loadOrders();
};

const handleClear = async () => {
  await loadOrders();
};

const goToCreate = () => {
  void router.push({ name: 'order-create' });
};

const goToDetail = (order: Order) => {
  void router.push({ name: 'order-detail', params: { id: order.id } });
};

const goToEdit = (order: Order) => {
  void router.push({ name: 'order-edit', params: { id: order.id } });
};

const handleAssign = (order: Order) => {
  $q.dialog({
    component: AssignPartsDialog,
    componentProps: {
      orderNumber: order.orderNumber,
    },
  }).onOk(() => {
    void loadOrders();
  });
};

const confirmDelete = (order: Order) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Está seguro de eliminar la orden ${order.orderNumber}?`,
    cancel: {
      flat: true,
      label: 'Cancelar',
      color: 'grey-7',
    },
    ok: {
      unelevated: true,
      label: 'Eliminar',
      color: 'negative',
    },
    persistent: true,
  }).onOk(() => {
    const exec = async () => {
      await deleteOrder(order.id);
      await loadOrders();
    };

    void exec();
  });
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'warning',
    processing: 'info',
    completed: 'positive',
  };
  return colors[status] || 'grey';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'En proceso',
    completed: 'Completada',
  };
  return labels[status] || status;
};
</script>

<template>
  <q-page padding>
    <div class="q-mb-lg">
      <div class="row items-center q-mb-md">
        <div>
          <h1 class="text-h4 text-weight-semi-bold q-ma-none">Órdenes</h1>
          <p class="text-body2 text-grey-700 q-mt-xs q-mb-none">Gestión de órdenes de almacén</p>
        </div>
        <q-space />
        <q-btn
          unelevated
          color="primary"
          icon="sym_r_add"
          label="Nueva orden"
          @click="goToCreate"
        />
      </div>

      <!-- Filtros -->
      <div class="q-mb-md">
        <q-btn
          flat
          dense
          :icon="showFilters ? 'sym_r_expand_less' : 'sym_r_expand_more'"
          :label="showFilters ? 'Ocultar filtros' : 'Mostrar filtros'"
          color="primary"
          @click="showFilters = !showFilters"
        />
      </div>

      <q-slide-transition>
        <div v-show="showFilters" class="q-mb-md">
          <OrderFilters @search="handleSearch" @clear="handleClear" />
        </div>
      </q-slide-transition>
    </div>

    <!-- Tabla -->
    <q-table
      :rows="orders"
      :columns="columns"
      row-key="id"
      :loading="loading"
      no-data-label="No hay órdenes registradas."
      no-results-label="No se encontraron resultados."
      bordered
      flat
      class="shadow-1"
      :pagination="{
        page: currentPage,
        rowsPerPage: 10,
        rowsNumber: totalOrders,
      }"
      @request="loadOrders"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="getStatusColor(props.row.status)"
            :label="getStatusLabel(props.row.status)"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="sym_r_visibility"
            color="primary"
            @click="goToDetail(props.row)"
          >
            <q-tooltip>Ver detalle</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="sym_r_edit"
            color="primary"
            @click="goToEdit(props.row)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="sym_r_assignment"
            color="info"
            @click="handleAssign(props.row)"
          >
            <q-tooltip>Asignar partes</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="sym_r_delete"
            color="negative"
            @click="confirmDelete(props.row)"
          >
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<style scoped lang="scss"></style>
