<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePartFailuresQuery } from '../composables/usePartFailuresQuery';
import { useAddFailureMutation } from '../composables/useAddFailureMutation';
import { useDeleteFailureMutation } from '../composables/useDeleteFailureMutation';
import { useFailuresStore } from '../stores/useFailuresStore';
import useNotify from 'src/modules/shared/composables/useNotify';

const router = useRouter();
const $q = useQuasar();
const { infoNotify } = useNotify();
const { order } = storeToRefs(useFailuresStore());
const { failures, partId, isLoading, isFetching, isError, error } = usePartFailuresQuery();
const { addFailureMutation } = useAddFailureMutation();
const { deleteFailureMutation } = useDeleteFailureMutation();

const newObservation = ref('');

const loading = computed(() => isLoading.value || isFetching.value);

watch(isError, (val) => {
  if (val) {
    const msg = (error.value as Error)?.message ?? 'Error al cargar las fallas';
    infoNotify(msg);
  }
});

// Info de la parte desde el store de la orden (ya buscada en FailuresPage)
const partInfo = computed(() => {
  if (!order.value?.OrderDetails || !partId.value) return null;
  for (const detail of order.value.OrderDetails) {
    const part = detail.Parts.find((p) => p.id === partId.value);
    if (part) return { part, quantity: detail.quantity, orderNumber: order.value.orderNumber };
  }
  return null;
});

const pickerName = computed(() => {
  const p = partInfo.value?.part.Picker;
  return p ? `${p.name} ${p.lastName ?? ''}`.trim() : 'Sin asignar';
});

const packerName = computed(() => {
  const p = partInfo.value?.part.Packer;
  return p ? `${p.name} ${p.lastName ?? ''}`.trim() : 'Sin asignar';
});

const recheckerName = computed(() => {
  const p = partInfo.value?.part.Rechecker;
  return p ? `${p.name} ${p.lastName ?? ''}`.trim() : 'Sin asignar';
});

const failuresColumns: QTableColumn[] = [
  { name: 'id', label: '#', field: 'id', align: 'center', sortable: true },
  {
    name: 'observation',
    label: 'Observación',
    field: 'observation',
    align: 'left',
    sortable: false,
  },
  { name: 'creator', label: 'Registrado por', field: 'creator', align: 'left', sortable: false },
  { name: 'createdAt', label: 'Fecha', field: 'createdAt', align: 'center', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center', sortable: false },
];

const handleAddFailure = () => {
  if (!newObservation.value.trim() || !partId.value) return;
  addFailureMutation.mutate(
    { partId: partId.value, observation: newObservation.value.trim() },
    {
      onSuccess: () => {
        newObservation.value = '';
      },
    },
  );
};

const handleDeleteFailure = (failureId: number) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Está seguro de eliminar esta falla?',
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
    if (!partId.value) return;
    deleteFailureMutation.mutate({ failureId, partId: partId.value });
  });
};

const goBack = () => {
  void router.back();
};
</script>

<template>
  <q-page padding>
    <!-- Encabezado -->
    <div class="q-mb-lg">
      <div class="row items-center q-mb-md">
        <q-btn flat round icon="sym_r_arrow_back" color="grey-7" class="q-mr-sm" @click="goBack" />
        <div>
          <h1 class="text-h4 text-weight-semi-bold q-ma-none">Fallas de parte</h1>
          <p class="text-body2 text-grey-700 q-mt-xs q-mb-none">
            Parte #{{ partId }}
            <template v-if="partInfo?.orderNumber"> — {{ partInfo.orderNumber }}</template>
          </p>
        </div>
      </div>
    </div>

    <!-- Loading inicial -->
    <template v-if="loading && !failures.length">
      <div class="flex flex-center q-mt-xl">
        <q-spinner-dots color="primary" size="3rem" />
      </div>
    </template>

    <template v-else>
      <!-- Info de la parte (desde el store) -->
      <q-card v-if="partInfo" flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 text-weight-semi-bold q-mb-md">Información de la parte</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Parte</div>
              <div class="text-body1 text-weight-medium">
                <q-badge color="primary" :label="`Parte ${partId}`" />
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Cantidad</div>
              <div class="text-body1 text-weight-medium">{{ partInfo.quantity }}</div>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Picker</div>
              <div class="text-body1 text-weight-medium">{{ pickerName }}</div>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Packer</div>
              <div class="text-body1 text-weight-medium">{{ packerName }}</div>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Rechequeador</div>
              <div class="text-body1 text-weight-medium">{{ recheckerName }}</div>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Total de fallas</div>
              <div class="text-body1 text-weight-medium">
                <q-badge
                  :color="failures.length > 0 ? 'negative' : 'positive'"
                  :label="failures.length"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Panel de fallas -->
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6 text-weight-semi-bold q-mb-md">Fallas registradas</div>

          <!-- Agregar nueva falla -->
          <div class="row q-col-gutter-md items-end q-mb-md">
            <div class="col-12 col-sm-8 col-md-6">
              <q-input
                v-model="newObservation"
                outlined
                dense
                hide-bottom-space
                label="Observación *"
                placeholder="Describe la falla encontrada"
                :rules="[(v) => !!v.trim() || 'La observación es requerida']"
                lazy-rules
                @keyup.enter="handleAddFailure"
              >
                <template #prepend>
                  <q-icon name="sym_r_edit_note" />
                </template>
              </q-input>
            </div>

            <div class="col-auto">
              <q-btn
                unelevated
                color="negative"
                icon="sym_r_add"
                label="Agregar falla"
                :loading="addFailureMutation.isPending.value"
                :disable="!newObservation.trim()"
                @click="handleAddFailure"
              />
            </div>
          </div>

          <!-- Tabla de fallas -->
          <q-table
            :rows="failures"
            :columns="failuresColumns"
            row-key="id"
            :loading="loading"
            no-data-label="Esta parte no tiene fallas registradas."
            bordered
            flat
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-creator="props">
              <q-td :props="props">
                {{ props.row.Creator.name }} {{ props.row.Creator.lastName ?? '' }}
              </q-td>
            </template>

            <template #body-cell-createdAt="props">
              <q-td :props="props">
                {{ new Date(props.row.createdAt).toLocaleString('es-ES') }}
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  icon="sym_r_delete"
                  color="negative"
                  size="sm"
                  :loading="deleteFailureMutation.isPending.value"
                  @click="handleDeleteFailure(props.row.id)"
                >
                  <q-tooltip>Eliminar falla</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>
