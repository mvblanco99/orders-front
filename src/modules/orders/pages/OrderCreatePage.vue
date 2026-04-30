<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '../stores/useOrderStore';
import { useOrderValidation } from '../composables/useOrderValidation';
import type { CreateOrderDetailDto } from '../interfaces/order.dto';
import useDropDown from 'src/modules/shared/composables/useDropDowns';
import { useCreateOrderMutation } from '../composables/useCreateOrderMutation';

const router = useRouter();
const orderStore = useOrderStore();
const { createOrderDto, createOrderMutation } = useCreateOrderMutation();
const { zones: zoneOptions } = useDropDown('zones');
const { users: pickerOptions } = useDropDown('users');
const { validateCreateOrder, validatePart, calculateDistribution } = useOrderValidation();

const step = ref(1);
const partDialogVisible = ref(false);
const editingPartIndex = ref<number | null>(null);
const currentPart = ref<CreateOrderDetailDto>({
  partId: 0,
  quantity: 0,
  pickerId: 0,
});

// Computed
const canProceedStep1 = computed(() => {
  return (
    createOrderDto.value.orderNumber &&
    createOrderDto.value.zoneId &&
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
  if (createOrderDto.value.details.length === 0) {
    autoGenerateParts();
  }

  step.value = 2;
};

const autoGenerateParts = () => {
  const distribution = calculateDistribution(
    createOrderDto.value.totalUnits,
    createOrderDto.value.totalParts,
  );

  createOrderDto.value.details = distribution.map((quantity, index) => ({
    partId: index + 1,
    quantity,
    pickerId: 0,
  }));
};

const openPartDialog = (index?: number) => {
  if (index !== undefined && createOrderDto.value.details[index]) {
    editingPartIndex.value = index;
    const part = createOrderDto.value.details[index];
    currentPart.value = {
      partId: part.partId || 0,
      quantity: part.quantity || 0,
      pickerId: part.pickerId || 0,
    };
  } else {
    editingPartIndex.value = null;
    currentPart.value = {
      partId: createOrderDto.value.details.length + 1,
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
    createOrderDto.value.details[editingPartIndex.value] = { ...currentPart.value };
  } else {
    createOrderDto.value.details.push({ ...currentPart.value });
  }

  partDialogVisible.value = false;
};

const deletePart = (index: number) => {
  createOrderDto.value.details.splice(index, 1);
  // Renumerar partes
  createOrderDto.value.details.forEach((part, idx) => {
    part.partId = idx + 1;
  });
};

const handleSubmit = async () => {
  const validation = validateCreateOrder(createOrderDto.value);

  if (!validation.valid) {
    alert(validation.errors.join('\n'));
    return;
  }

  await createOrderMutation.mutateAsync();
};

const handleCancel = () => {
  orderStore.resetCreateOrderDto();
  void router.push({ name: 'order-list' });
};
</script>

<template>
  <q-page padding>
    <div class="row items-center q-mb-lg">
      <q-btn
        flat
        round
        dense
        icon="sym_r_arrow_back"
        color="grey-7"
        class="q-mr-md"
        @click="handleCancel"
      />
      <div>
        <h1 class="text-h4 text-weight-semi-bold q-ma-none">Crear nueva orden</h1>
        <p class="text-body2 text-grey-700 q-mt-xs q-mb-none">
          Complete los datos de la orden y sus partes
        </p>
      </div>
    </div>

    <q-stepper v-model="step" vertical color="primary" animated flat class="shadow-1">
      <!-- Step 1: Datos básicos -->
      <q-step :name="1" title="Información básica" icon="sym_r_description" :done="step > 1">
        <q-card flat bordered class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="createOrderDto.orderNumber"
                label="Número de orden *"
                outlined
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>

            <div class="col-xs-12 col-sm-6">
              <q-select
                v-model="createOrderDto.zoneId"
                label="Zona *"
                outlined
                :options="zoneOptions"
                map-options
                emit-value
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>

            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model.number="createOrderDto.totalUnits"
                label="Total de unidades *"
                outlined
                type="number"
                min="1"
                :rules="[(val) => val > 0 || 'Debe ser mayor a 0']"
              />
            </div>

            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model.number="createOrderDto.totalParts"
                label="Total de partes *"
                outlined
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
          :rows="createOrderDto.details"
          :columns="[
            { name: 'partId', label: 'Parte #', field: 'partId', align: 'center' },
            { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center' },
            { name: 'picker', label: 'Picker', field: 'pickerId', align: 'center' },
            { name: 'actions', label: 'Acciones', field: 'partId', align: 'center' },
          ]"
          row-key="partId"
          no-data-label="No hay partes agregadas. Use 'Auto-generar' o 'Agregar parte'."
          bordered
          flat
          class="shadow-1"
        >
          <template v-slot:body-cell-picker="props">
            <q-td :props="props" auto-width>
              <q-select
                v-if="createOrderDto.details[props.rowIndex]"
                v-model="createOrderDto.details[props.rowIndex]!.pickerId"
                :options="pickerOptions"
                emit-value
                map-options
                outlined
                dense
                style="width: 180px"
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
            v-model.number="currentPart.partId"
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
            :options="pickerOptions"
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
