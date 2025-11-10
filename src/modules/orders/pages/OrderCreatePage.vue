<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '../stores/useOrderStore';
import { useOrders } from '../composables/useOrders';
import { useOrderValidation } from '../composables/useOrderValidation';
import type { CreateOrderPartDto } from '../interfaces/order.dto';

const router = useRouter();
const orderStore = useOrderStore();
const { createOrder } = useOrders();
const { validateCreateOrder, validatePart, calculateDistribution } = useOrderValidation();

const { createOrderDto } = storeToRefs(orderStore);
const step = ref(1);
const partDialogVisible = ref(false);
const editingPartIndex = ref<number | null>(null);
const currentPart = ref<CreateOrderPartDto>({
  partNumber: 0,
  quantity: 0,
  pickerId: 0,
});

// Computed
const canProceedStep1 = computed(() => {
  return (
    createOrderDto.value.orderNumber &&
    createOrderDto.value.zoneId > 0 &&
    createOrderDto.value.totalUnits > 0 &&
    createOrderDto.value.totalParts > 0
  );
});

const canSubmit = computed(() => {
  const validation = validateCreateOrder(createOrderDto.value);
  return validation.valid;
});

// Methods
const goToStep2 = () => {
  if (!canProceedStep1.value) return;

  // Auto-generar partes si no existen
  if (createOrderDto.value.parts.length === 0) {
    autoGenerateParts();
  }

  step.value = 2;
};

const autoGenerateParts = () => {
  const distribution = calculateDistribution(
    createOrderDto.value.totalUnits,
    createOrderDto.value.totalParts,
  );

  createOrderDto.value.parts = distribution.map((quantity, index) => ({
    partNumber: index + 1,
    quantity,
    pickerId: 0,
  }));
};

const openPartDialog = (index?: number) => {
  if (index !== undefined && createOrderDto.value.parts[index]) {
    editingPartIndex.value = index;
    const part = createOrderDto.value.parts[index];
    currentPart.value = {
      partNumber: part.partNumber || 0,
      quantity: part.quantity || 0,
      pickerId: part.pickerId || 0,
    };
  } else {
    editingPartIndex.value = null;
    currentPart.value = {
      partNumber: createOrderDto.value.parts.length + 1,
      quantity: 0,
      pickerId: 0,
    };
  }
  partDialogVisible.value = true;
};

const savePart = () => {
  const validation = validatePart(currentPart.value);
  if (!validation.valid) {
    return;
  }

  if (editingPartIndex.value !== null) {
    createOrderDto.value.parts[editingPartIndex.value] = { ...currentPart.value };
  } else {
    createOrderDto.value.parts.push({ ...currentPart.value });
  }

  partDialogVisible.value = false;
};

const deletePart = (index: number) => {
  createOrderDto.value.parts.splice(index, 1);
  // Renumerar partes
  createOrderDto.value.parts.forEach((part, idx) => {
    part.partNumber = idx + 1;
  });
};

const handleSubmit = async () => {
  const validation = validateCreateOrder(createOrderDto.value);

  if (!validation.valid) {
    alert(validation.errors.join('\n'));
    return;
  }

  try {
    await createOrder();
    router.push({ name: 'order-list' });
  } catch (error) {
    // Error handled by composable
  }
};

const handleCancel = () => {
  orderStore.resetCreateOrderDto();
  router.push({ name: 'order-list' });
};
</script>

<template>
  <q-page padding>
    <div class="q-mb-lg">
      <h1 class="text-h4 text-weight-semi-bold q-ma-none">Crear nueva orden</h1>
      <p class="text-body2 text-grey-700 q-mt-xs q-mb-none">
        Complete los datos de la orden y sus partes
      </p>
    </div>

    <q-stepper v-model="step" vertical color="primary" animated flat class="shadow-1">
      <!-- Step 1: Datos básicos -->
      <q-step :name="1" title="Información básica" icon="sym_r_description" :done="step > 1">
        <q-card flat bordered class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="createOrderDto.orderNumber"
                label="Número de orden *"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="createOrderDto.zoneId"
                label="Zona *"
                outlined
                dense
                :options="[]"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="createOrderDto.totalUnits"
                label="Total de unidades *"
                outlined
                dense
                type="number"
                min="1"
                :rules="[(val) => val > 0 || 'Debe ser mayor a 0']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="createOrderDto.totalParts"
                label="Total de partes *"
                outlined
                dense
                type="number"
                min="1"
                :rules="[(val) => val > 0 || 'Debe ser mayor a 0']"
              />
            </div>
          </div>
        </q-card>

        <q-stepper-navigation>
          <q-btn
            unelevated
            color="primary"
            label="Continuar"
            :disable="!canProceedStep1"
            @click="goToStep2"
          />
          <q-btn flat label="Cancelar" color="grey-7" class="q-ml-sm" @click="handleCancel" />
        </q-stepper-navigation>
      </q-step>

      <!-- Step 2: Partes -->
      <q-step :name="2" title="Configurar partes" icon="sym_r_inventory_2" :done="step > 2">
        <div class="q-mb-md">
          <q-btn
            unelevated
            color="primary"
            icon="sym_r_add"
            label="Agregar parte"
            size="sm"
            @click="openPartDialog()"
          />
          <q-btn
            flat
            color="primary"
            icon="sym_r_refresh"
            label="Auto-generar"
            size="sm"
            class="q-ml-sm"
            @click="autoGenerateParts"
          />
        </div>

        <q-table
          :rows="createOrderDto.parts"
          :columns="[
            { name: 'partNumber', label: 'Parte #', field: 'partNumber', align: 'center' },
            { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center' },
            { name: 'picker', label: 'Picker ID', field: 'pickerId', align: 'center' },
            { name: 'actions', label: 'Acciones', field: 'partNumber', align: 'center' },
          ]"
          row-key="partNumber"
          no-data-label="No hay partes agregadas. Use 'Auto-generar' o 'Agregar parte'."
          bordered
          flat
          class="shadow-1"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                size="sm"
                icon="sym_r_edit"
                color="primary"
                @click="openPartDialog(props.rowIndex)"
              />
              <q-btn
                flat
                dense
                round
                size="sm"
                icon="sym_r_delete"
                color="negative"
                @click="deletePart(props.rowIndex)"
              />
            </q-td>
          </template>
        </q-table>

        <q-stepper-navigation>
          <q-btn
            unelevated
            color="positive"
            label="Crear orden"
            icon="sym_r_check"
            :disable="!canSubmit"
            @click="handleSubmit"
          />
          <q-btn flat label="Atrás" color="grey-7" class="q-ml-sm" @click="step = 1" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>

    <!-- Dialog para agregar/editar parte -->
    <q-dialog v-model="partDialogVisible" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editingPartIndex !== null ? 'Editar parte' : 'Agregar parte' }}
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
