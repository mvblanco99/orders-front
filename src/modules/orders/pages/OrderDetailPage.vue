<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { QTableColumn } from 'quasar';
import { useOrderByIdQuery } from '../composables/useOrderByIdQuery';
import { OrderStatus } from '../interfaces/order.interface';

const route = useRoute();
const router = useRouter();
const orderId = Number(route.params.id);

const { orderDetail, isLoading, isFetching } = useOrderByIdQuery(orderId, true);
const loading = computed(() => isLoading.value || isFetching.value);

const goBack = () => {
  void router.push({ name: 'order-list' });
};

const goToEdit = () => {
  void router.push({ name: 'order-edit', params: { id: orderId } });
};

const statusColorMap: Record<string, string> = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.PROCESSING]: 'info',
  [OrderStatus.COMPLETED]: 'positive',
  [OrderStatus.CANCELLED]: 'negative',
};

const statusLabelMap: Record<string, string> = {
  [OrderStatus.PENDING]: 'Pendiente',
  [OrderStatus.PROCESSING]: 'En proceso',
  [OrderStatus.COMPLETED]: 'Completada',
  [OrderStatus.CANCELLED]: 'Cancelada',
};

const getStatusColor = (status: string) => statusColorMap[status] ?? 'grey';
const getStatusLabel = (status: string) => statusLabelMap[status] ?? status;

const formatUser = (user: { name: string; lastName: string } | null) =>
  user ? `${user.name} ${user.lastName}` : 'Sin asignar';

const detailColumns: QTableColumn[] = [
  { name: 'partId', label: 'Parte #', field: 'partId', align: 'center', sortable: true },
  { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center', sortable: true },
  { name: 'picker', label: 'Picker', field: 'picker', align: 'left' },
  { name: 'packer', label: 'Packer', field: 'packer', align: 'left' },
  { name: 'rechecker', label: 'Rechecker', field: 'rechecker', align: 'left' },
];

const detailRows = computed(() => {
  if (!orderDetail.value?.OrderDetails) return [];
  return orderDetail.value.OrderDetails.flatMap((detail) =>
    detail.Parts.map((part) => ({
      partId: detail.partId,
      quantity: detail.quantity,
      picker: formatUser(part.Picker),
      packer: formatUser(part.Packer),
      rechecker: formatUser(part.Rechecker),
    })),
  );
});
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
          class="q-mr-md"
          @click="goBack"
        />
        <div>
          <h1 class="text-h4 text-weight-semi-bold q-ma-none">
            Orden {{ orderDetail.orderNumber }}
          </h1>
          <p class="text-body2 text-grey-700 q-mt-xs q-mb-none">Detalle completo de la orden</p>
        </div>
        <q-space />
        <q-btn
          v-if="orderDetail.status !== OrderStatus.CANCELLED"
          unelevated
          color="primary"
          icon="sym_r_edit"
          label="Editar"
          @click="goToEdit"
        />
      </div>

      <!-- Información general -->
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
              <div class="text-body1 text-weight-medium">
                {{ orderDetail.Zone?.name ?? `Zona ${orderDetail.zoneId}` }}
              </div>
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
              <div class="text-body1 text-weight-medium">
                {{
                  orderDetail.User
                    ? `${orderDetail.User.name} ${orderDetail.User.lastName}`
                    : `ID: ${orderDetail.createdBy}`
                }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Partes de la orden -->
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6 text-weight-semi-bold q-mb-md">Partes de la orden</div>
          <q-table
            flat
            :rows="detailRows"
            :columns="detailColumns"
            row-key="partId"
            :loading="loading"
            hide-bottom
            no-data-label="Sin partes registradas"
          />
        </q-card-section>
      </q-card>
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
