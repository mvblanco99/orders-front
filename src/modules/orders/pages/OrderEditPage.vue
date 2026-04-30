<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useOrderByIdQuery } from '../composables/useOrderByIdQuery';
import { useUpdateOrderHeaderMutation } from '../composables/useUpdateOrderHeaderMutation';
import { useUpdateOrderDetailMutation } from '../composables/useUpdateOrderDetailMutation';
import { useRemoveOrderDetailMutation } from '../composables/useRemoveOrderDetailMutation';
import { useAddOrderDetailMutation } from '../composables/useAddOrderDetailMutation';
import OrderPartsTable from '../components/OrderPartsTable.vue';
import DebounceConfirmDialog from 'src/modules/shared/components/DebounceConfirmDialog.vue';
import type { OrderDetail } from '../interfaces/order.interface';
import useDropDown from 'src/modules/shared/composables/useDropDowns';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const { zones } = useDropDown('zones');
const { users } = useDropDown('users');
const orderId = Number(route.params.id);

const { isLoading, isFetching, orderDetail } = useOrderByIdQuery(orderId);

const {
  headerDto,
  canSubmit: canSubmitHeader,
  updateHeaderMutation,
  resetUpdateOrderDto,
} = useUpdateOrderHeaderMutation(orderId);

const {
  detailDto,
  canSubmit: canSubmitDetail,
  updateDetailMutation,
} = useUpdateOrderDetailMutation(orderId);

const { removeDetailMutation } = useRemoveOrderDetailMutation(orderId);

const loading = computed(() => isLoading.value || isFetching.value);
const orderNumber = computed(() => orderDetail.value?.orderNumber ?? '');

const {
  addDetailDto,
  canSubmit: canSubmitAdd,
  addDetailMutation,
  resetAddDetailDto,
} = useAddOrderDetailMutation(orderId, orderNumber);

// Inicializar headerDto cuando llegan los datos por primera vez
watch(
  orderDetail,
  (order) => {
    if (order && !headerDto.value.orderNumber) {
      headerDto.value = {
        orderNumber: order.orderNumber,
        zoneId: order.zoneId,
        totalUnits: order.totalUnits,
      };
    }
  },
  { immediate: true },
);

const partDialogVisible = ref(false);
const editingPart = ref<OrderDetail | null>(null);

const maxQuantityForCurrentPart = computed(() => {
  if (!orderDetail.value) return 0;
  const otherPartsTotal = (orderDetail.value.OrderDetails ?? [])
    .filter((d) => d.id !== editingPart.value?.id)
    .reduce((sum, d) => sum + d.quantity, 0);
  return orderDetail.value.totalUnits - otherPartsTotal;
});

onMounted(() => {
  // La carga inicial la gestiona useOrderByIdQuery
});

const handleSubmitHeader = () => {
  updateHeaderMutation.mutate();
};

const openPartDialog = (part?: OrderDetail) => {
  if (part) {
    editingPart.value = part;
    detailDto.value = {
      quantity: part.quantity,
      pickerId: part.Parts[0]?.pickerId ?? 0,
      recheckerId: part.Parts[0]?.recheckerId ?? null,
      packerId: part.Parts[0]?.packerId ?? null,
    };
  } else {
    editingPart.value = null;
    resetAddDetailDto();
  }
  partDialogVisible.value = true;
};

const savePart = () => {
  if (editingPart.value) {
    updateDetailMutation.mutate(editingPart.value.id, {
      onSuccess: () => {
        partDialogVisible.value = false;
        editingPart.value = null;
      },
    });
  } else {
    addDetailMutation.mutate(undefined, {
      onSuccess: () => {
        partDialogVisible.value = false;
      },
    });
  }
};

const handleDeletePart = (partId: number) => {
  $q.dialog({
    component: DebounceConfirmDialog,
    componentProps: {
      title: 'Eliminar parte',
      message: '¿Estás seguro de que deseas eliminar esta parte? Esta acción no se puede deshacer.',
      labelOk: 'Eliminar',
      labelCancel: 'Cancelar',
      iconOk: 'sym_r_delete',
      debounce: 3,
    },
  }).onOk(() => {
    removeDetailMutation.mutate(partId);
  });
};

const handleCancel = () => {
  resetUpdateOrderDto();
  void router.push({ name: 'order-list', params: { id: orderId } });
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
          class="q-mr-md"
          @click="handleCancel"
        />
        <div>
          <h1 class="text-h4 text-weight-semi-bold q-ma-none">
            Editar Orden {{ orderDetail.orderNumber }}
          </h1>
          <p class="text-body2 text-grey-700 q-mt-xs q-mb-none">Modifique los datos de la orden</p>
        </div>
      </div>

      <!-- Información básica -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 text-weight-semi-bold q-mb-md">Información general</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="headerDto.orderNumber" label="Número de orden" outlined dense />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="headerDto.zoneId"
                label="Zona"
                outlined
                dense
                :options="zones"
                emit-value
                map-options
                clearable
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="headerDto.totalUnits"
                label="Total de unidades"
                outlined
                dense
                type="number"
                min="1"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md q-pt-none">
          <q-btn
            flat
            dense
            size="sm"
            label="Guardar cabecera"
            color="primary"
            icon="sym_r_save"
            :disable="!canSubmitHeader"
            :loading="updateHeaderMutation.isPending.value"
            @click="handleSubmitHeader"
          />
        </q-card-actions>
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
            :parts="orderDetail.OrderDetails || []"
            :loading="loading"
            editable
            @edit="openPartDialog"
            @delete="handleDeletePart"
          />
        </q-card-section>
      </q-card>
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
          <!-- Número de parte: solo visible en modo edición (generado por el backend al crear) -->
          <q-input
            v-if="editingPart"
            :model-value="editingPart.partId"
            label="Número de parte"
            outlined
            dense
            readonly
            class="q-mb-md"
          >
            <template v-slot:append>
              <q-icon name="sym_r_lock" color="grey-5" size="xs" />
            </template>
          </q-input>

          <q-input
            v-if="!editingPart"
            v-model.number="addDetailDto.quantity"
            label="Cantidad"
            outlined
            dense
            type="number"
            min="1"
            class="q-mb-md"
          />
          <q-input
            v-else
            v-model.number="detailDto.quantity"
            label="Cantidad"
            outlined
            dense
            type="number"
            min="1"
            :max="maxQuantityForCurrentPart"
            :hint="`Máximo disponible: ${maxQuantityForCurrentPart}`"
            class="q-mb-md"
          />

          <q-select
            v-if="!editingPart"
            v-model="addDetailDto.pickerId"
            label="Picker"
            outlined
            dense
            :options="users"
            emit-value
            map-options
            class="q-mb-md"
          />
          <template v-else>
            <q-select
              v-model="detailDto.pickerId"
              label="Picker"
              outlined
              dense
              :options="users"
              emit-value
              map-options
              class="q-mb-md"
            />
            <q-select
              v-model="detailDto.recheckerId"
              label="Rechecker"
              outlined
              dense
              :options="users"
              emit-value
              map-options
              clearable
              class="q-mb-md"
            />
            <q-select
              v-model="detailDto.packerId"
              label="Packer"
              outlined
              dense
              :options="users"
              emit-value
              map-options
              clearable
            />
          </template>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            label="Guardar"
            color="primary"
            :disable="editingPart ? !canSubmitDetail : !canSubmitAdd"
            :loading="
              editingPart ? updateDetailMutation.isPending.value : addDetailMutation.isPending.value
            "
            @click="savePart"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped lang="scss"></style>
