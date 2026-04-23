<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '../stores/useOrderStore';
import { useOrders } from '../composables/useOrders';
import { useOrderValidation } from '../composables/useOrderValidation';
import OrderPartsTable from '../components/OrderPartsTable.vue';
import type { CreateOrderPartDto, UpdateOrderPartDto } from '../interfaces/order.dto';
import type { OrderPart } from '../interfaces/order.interface';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const { fetchOrderById, updateOrder } = useOrders();
const { validateUpdateOrder } = useOrderValidation();

const { orderDetail, updateOrderDto } = storeToRefs(orderStore);
const loading = ref(false);
const orderId = Number(route.params.id);

const partDialogVisible = ref(false);
const editingPart = ref<OrderPart | null>(null);
const currentPart = ref<Partial<CreateOrderPartDto>>({
  partNumber: 0,
  quantity: 0,
  pickerId: 0,
});

onMounted(async () => {
  loading.value = true;
  try {
    await fetchOrderById(orderId);
  } finally {
    loading.value = false;
  }
});

const canSubmit = computed(() => {
  const validation = validateUpdateOrder(updateOrderDto.value);
  return validation.valid && Object.keys(updateOrderDto.value).length > 0;
});

const openPartDialog = (part?: OrderPart) => {
  if (part) {
    editingPart.value = part;
    currentPart.value = {
      partNumber: part.partNumber,
      quantity: part.quantity,
      pickerId: part.pickerId,
    };
  } else {
    editingPart.value = null;
    const maxPartNumber = Math.max(
      ...(orderDetail.value?.OrderPart.map((p) => p.partNumber) || [0]),
    );
    currentPart.value = {
      partNumber: maxPartNumber + 1,
      quantity: 0,
      pickerId: 0,
    };
  }
  partDialogVisible.value = true;
};

const savePart = () => {
  if (editingPart.value) {
    // Actualizar parte existente
    if (!updateOrderDto.value.partsToUpdate) {
      updateOrderDto.value.partsToUpdate = [];
    }
    updateOrderDto.value.partsToUpdate.push({
      id: editingPart.value.id,
      partNumber: currentPart.value.partNumber,
      quantity: currentPart.value.quantity,
      pickerId: currentPart.value.pickerId,
    } as UpdateOrderPartDto);
  } else {
    // Crear nueva parte
    if (!updateOrderDto.value.partsToCreate) {
      updateOrderDto.value.partsToCreate = [];
    }
    updateOrderDto.value.partsToCreate.push(currentPart.value as CreateOrderPartDto);
  }

  partDialogVisible.value = false;
};

const handleDeletePart = (partId: number) => {
  if (!updateOrderDto.value.partIdsToDelete) {
    updateOrderDto.value.partIdsToDelete = [];
  }
  updateOrderDto.value.partIdsToDelete.push(partId);
};

const handleSubmit = async () => {
  const validation = validateUpdateOrder(updateOrderDto.value);

  if (!validation.valid) {
    alert(validation.errors.join('\n'));
    return;
  }

  try {
    await updateOrder(orderId);
    void router.push({ name: 'order-detail', params: { id: orderId } });
  } catch {
    // Error handled by composable
  }
};

const handleCancel = () => {
  orderStore.resetUpdateOrderDto();
  void router.push({ name: 'order-detail', params: { id: orderId } });
};
</script>

<template>
  <q-page padding>
    <div v-if="loading" class="flex flex-center" style="min-height: 400px">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="orderDetail">
      <!-- Header -->
      <div class="q-mb-lg">
        <h1 class="text-h4 text-weight-semi-bold q-ma-none">
          Editar Orden {{ orderDetail.orderNumber }}
        </h1>
        <p class="text-body2 text-grey-700 q-mt-xs q-mb-none">Modifique los datos de la orden</p>
      </div>

      <!-- Información básica -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 text-weight-semi-bold q-mb-md">Información general</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="updateOrderDto.orderNumber"
                label="Número de orden"
                outlined
                dense
                :placeholder="orderDetail.orderNumber"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="updateOrderDto.zoneId"
                label="Zona"
                outlined
                dense
                :options="[]"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                clearable
                :placeholder="`Zona actual: ${orderDetail.zoneId}`"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="updateOrderDto.totalUnits"
                label="Total de unidades"
                outlined
                dense
                type="number"
                min="1"
                :placeholder="String(orderDetail.totalUnits)"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Partes -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row items-center q-mb-md">
            <div class="text-h6 text-weight-semi-bold">Partes de la orden</div>
            <q-space />
            <q-btn
              unelevated
              color="primary"
              icon="sym_r_add"
              label="Agregar parte"
              size="sm"
              @click="openPartDialog()"
            />
          </div>

          <OrderPartsTable
            :parts="orderDetail.OrderPart"
            :loading="loading"
            editable
            @edit="openPartDialog"
            @delete="handleDeletePart"
          />
        </q-card-section>
      </q-card>

      <!-- Acciones -->
      <div class="row q-gutter-sm justify-end">
        <q-btn flat label="Cancelar" color="grey-7" @click="handleCancel" />
        <q-btn
          unelevated
          label="Guardar cambios"
          color="primary"
          icon="sym_r_save"
          :disable="!canSubmit"
          @click="handleSubmit"
        />
      </div>
    </div>

    <!-- Dialog para agregar/editar parte -->
    <q-dialog v-model="partDialogVisible" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editingPart ? 'Editar parte' : 'Agregar nueva parte' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model.number="currentPart.partNumber"
            label="Número de parte"
            outlined
            dense
            type="number"
            min="1"
            class="q-mb-md"
          />
          <q-input
            v-model.number="currentPart.quantity"
            label="Cantidad"
            outlined
            dense
            type="number"
            min="1"
            class="q-mb-md"
          />
          <q-select
            v-model="currentPart.pickerId"
            label="Picker"
            outlined
            dense
            :options="[]"
            option-value="id"
            option-label="name"
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated label="Guardar" color="primary" @click="savePart" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped lang="scss"></style>
