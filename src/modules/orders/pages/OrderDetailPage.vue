<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrders } from '../composables/useOrders';
import OrderPartsTable from '../components/OrderPartsTable.vue';
import { OrderStatus } from '../interfaces/order.interface';

const route = useRoute();
const router = useRouter();
const { orderDetail, fetchOrderById } = useOrders();
const loading = ref(false);

const orderId = Number(route.params.id);

onMounted(async () => {
  loading.value = true;
  try {
    await fetchOrderById(orderId);
  } finally {
    loading.value = false;
  }
});

const goBack = () => {
  router.push({ name: 'order-list' });
};

const goToEdit = () => {
  router.push({ name: 'order-edit', params: { id: orderId } });
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    [OrderStatus.PENDING]: 'warning',
    [OrderStatus.PROCESSING]: 'info',
    [OrderStatus.COMPLETED]: 'positive',
  };
  return colors[status] || 'grey';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    [OrderStatus.PENDING]: 'Pendiente',
    [OrderStatus.PROCESSING]: 'En proceso',
    [OrderStatus.COMPLETED]: 'Completada',
  };
  return labels[status] || status;
};
</script>

<template>
  <q-page padding>
    <div v-if="loading" class="flex flex-center" style="min-height: 400px">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="orderDetail">
      <!-- Header -->
      <div class="row items-center q-mb-lg">
        <q-btn
          flat
          round
          dense
          icon="sym_r_arrow_back"
          color="grey-7"
          @click="goBack"
          class="q-mr-md"
        />
        <div>
          <h1 class="text-h4 text-weight-semi-bold q-ma-none">
            Orden {{ orderDetail.orderNumber }}
          </h1>
          <p class="text-body2 text-grey-700 q-mt-xs q-mb-none">Detalle completo de la orden</p>
        </div>
        <q-space />
        <q-btn unelevated color="primary" icon="sym_r_edit" label="Editar" @click="goToEdit" />
      </div>

      <!-- Información básica -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 text-weight-semi-bold q-mb-md">Información general</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Número de orden</div>
              <div class="text-body1 text-weight-medium">{{ orderDetail.orderNumber }}</div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Zona</div>
              <div class="text-body1 text-weight-medium">Zona ID: {{ orderDetail.zoneId }}</div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Estado</div>
              <q-badge
                :color="getStatusColor(orderDetail.status)"
                :label="getStatusLabel(orderDetail.status)"
              />
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Fecha de orden</div>
              <div class="text-body1 text-weight-medium">
                {{ new Date(orderDetail.orderDate).toLocaleDateString('es-ES') }}
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Total de unidades</div>
              <div class="text-body1 text-weight-medium">{{ orderDetail.totalUnits }}</div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Total de partes</div>
              <div class="text-body1 text-weight-medium">{{ orderDetail.totalParts }}</div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Creado por</div>
              <div class="text-body1 text-weight-medium">User ID: {{ orderDetail.createdBy }}</div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Estado</div>
              <q-chip
                :color="orderDetail.isActive ? 'positive' : 'negative'"
                text-color="white"
                size="sm"
              >
                {{ orderDetail.isActive ? 'Activa' : 'Inactiva' }}
              </q-chip>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Partes de la orden -->
      <OrderPartsTable :parts="orderDetail.OrderPart" :loading="loading" />
    </div>

    <div v-else class="flex flex-center" style="min-height: 400px">
      <div class="text-center">
        <q-icon name="sym_r_error" size="4em" color="grey-5" />
        <div class="text-h6 text-grey-7 q-mt-md">Orden no encontrada</div>
        <q-btn flat color="primary" label="Volver al listado" class="q-mt-md" @click="goBack" />
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss"></style>
