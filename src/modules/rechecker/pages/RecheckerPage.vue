<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { storeToRefs } from 'pinia';
import { useRecheckerOrderQuery } from '../composables/useRecheckerOrderQuery';
import { useAssignRecheckerMutation } from '../composables/useAssignRecheckerMutation';
import { useRecheckerStore } from '../stores/useRecheckerStore';
import useDropDown from 'src/modules/shared/composables/useDropDowns';
import useNotify from 'src/modules/shared/composables/useNotify';
import type { RecheckerPartRow } from '../interfaces/rechecker.interface';

const { infoNotify } = useNotify();
const recheckerStore = useRecheckerStore();
const { packerId } = storeToRefs(recheckerStore);
const { order, unassignedParts, isLoading, isFetching, isError, error, search, clear } =
  useRecheckerOrderQuery();
const { assignRecheckerMutation } = useAssignRecheckerMutation();
const { users } = useDropDown('users');

const searchOrderNumber = ref('');
const selectedParts = ref<RecheckerPartRow[]>([]);

const loading = computed(() => isLoading.value || isFetching.value);
const hasOrder = computed(() => !!order.value);
const canAssign = computed(() => packerId.value !== null && selectedParts.value.length > 0);

watch(isError, (val) => {
  if (val) {
    const msg = (error.value as Error)?.message ?? 'Error al buscar la orden';
    infoNotify(msg);
  }
});

watch(unassignedParts, (parts) => {
  if (hasOrder.value && parts.length === 0) {
    infoNotify('Esta orden no tiene partes pendientes de rechecker');
  }
});

const columns: QTableColumn[] = [
  { name: 'partId', label: 'Parte #', field: 'partId', align: 'center', sortable: true },
  { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center', sortable: true },
  { name: 'pickerName', label: 'Picker', field: 'pickerName', align: 'left', sortable: true },
  { name: 'packerName', label: 'Packer', field: 'packerName', align: 'left', sortable: true },
];

const handleSearch = () => {
  if (!searchOrderNumber.value.trim()) return;
  selectedParts.value = [];
  packerId.value = null;
  search(searchOrderNumber.value);
};

const handleClear = () => {
  searchOrderNumber.value = '';
  selectedParts.value = [];
  packerId.value = null;
  clear();
};

onUnmounted(() => {
  recheckerStore.resetOrder();
  searchOrderNumber.value = '';
  selectedParts.value = [];
});

const handleAssign = () => {
  if (!canAssign.value) return;
  assignRecheckerMutation.mutate(
    {
      packerId: packerId.value!,
      partIds: selectedParts.value.map((p) => p.partId),
    },
    {
      onSuccess: () => {
        selectedParts.value = [];
        packerId.value = null;
      },
    },
  );
};
</script>

<template>
  <q-page padding>
    <!-- Encabezado -->
    <div class="q-mb-lg">
      <div class="row items-center q-mb-md">
        <div>
          <h1 class="text-h4 text-weight-semi-bold q-ma-none">Rechequeador</h1>
          <p class="text-body2 text-grey-700 q-mt-xs q-mb-none">
            Asignación de rechequeador a partes de pedidos
          </p>
        </div>
      </div>
    </div>

    <!-- Búsqueda de pedido -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-weight-semi-bold q-mb-md">Buscar pedido</div>

        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-sm-6 col-md-4">
            <q-input
              v-model="searchOrderNumber"
              outlined
              dense
              label="Número de pedido"
              placeholder="Ej: ORD-0001"
              clearable
              :loading="loading"
              @keyup.enter="handleSearch"
              @clear="handleClear"
            >
              <template #prepend>
                <q-icon name="sym_r_search" />
              </template>
            </q-input>
          </div>

          <div class="col-auto">
            <q-btn
              unelevated
              color="primary"
              icon="sym_r_search"
              label="Buscar"
              :loading="loading"
              :disable="!searchOrderNumber.trim()"
              @click="handleSearch"
            />
          </div>

          <div v-if="hasOrder" class="col-auto">
            <q-btn flat color="grey-7" icon="sym_r_close" label="Limpiar" @click="handleClear" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Datos de la orden -->
    <template v-if="hasOrder">
      <!-- Resumen de la orden -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 text-weight-semi-bold q-mb-md">Información del pedido</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Número de pedido</div>
              <div class="text-body1 text-weight-medium">{{ order!.orderNumber }}</div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Zona</div>
              <div class="text-body1 text-weight-medium">
                {{ order!.Zone?.name ?? `Zona ${order!.zoneId}` }}
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Total de partes sin rechequear</div>
              <div class="text-body1 text-weight-medium">
                <q-badge
                  :color="unassignedParts.length > 0 ? 'warning' : 'positive'"
                  :label="unassignedParts.length"
                />
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-caption text-grey-600">Fecha del pedido</div>
              <div class="text-body1 text-weight-medium">
                {{ new Date(order!.orderDate).toLocaleDateString('es-ES') }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Asignación -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row items-center q-mb-md">
            <div class="text-h6 text-weight-semi-bold">Partes pendientes de rechequeo</div>
            <q-space />
            <div class="text-body2 text-grey-600">
              {{ selectedParts.length }} seleccionada{{ selectedParts.length !== 1 ? 's' : '' }}
            </div>
          </div>

          <!-- Select embalador -->
          <div class="row q-col-gutter-md q-mb-md items-end">
            <div class="col-12 col-sm-6 col-md-4">
              <q-select
                v-model="packerId"
                :options="users"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                outlined
                dense
                label="Embalador (Packer)"
                clearable
                :disable="unassignedParts.length === 0"
              >
                <template #prepend>
                  <q-icon name="sym_r_inventory" />
                </template>
              </q-select>
            </div>

            <div class="col-auto">
              <q-btn
                unelevated
                color="positive"
                icon="sym_r_check_circle"
                label="Asignar rechecker"
                :loading="assignRecheckerMutation.isPending.value"
                :disable="!canAssign"
                @click="handleAssign"
              />
            </div>
          </div>

          <!-- Tabla de partes -->
          <q-table
            v-model:selected="selectedParts"
            :rows="unassignedParts"
            :columns="columns"
            row-key="partRowId"
            selection="multiple"
            :no-data-label="
              unassignedParts.length === 0
                ? 'Todas las partes de este pedido ya tienen rechequador asignado.'
                : 'No hay partes sin rechequear.'
            "
            no-results-label="No se encontraron resultados."
            bordered
            flat
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-partId="props">
              <q-td :props="props">
                <q-badge color="primary" :label="`Parte ${props.row.partId}`" />
              </q-td>
            </template>

            <template #body-cell-pickerName="props">
              <q-td :props="props">
                <div class="flex items-center q-gutter-xs">
                  <q-icon name="sym_r_person" size="xs" color="grey-6" />
                  <span>{{ props.row.pickerName }}</span>
                </div>
              </q-td>
            </template>

            <template #body-cell-packerName="props">
              <q-td :props="props">
                <div class="flex items-center q-gutter-xs">
                  <q-icon name="sym_r_person" size="xs" color="grey-6" />
                  <span>{{ props.row.packerName }}</span>
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </template>

    <!-- Estado vacío inicial -->
    <template v-else>
      <div class="flex flex-center column q-mt-xl text-grey-5" style="gap: 12px">
        <q-icon name="sym_r_manage_search" size="5rem" />
        <p class="text-h6 q-mb-none">Ingresa un número de pedido para comenzar</p>
        <p class="text-body2">Se mostrarán las partes que aún no tienen rechequeador asignado</p>
      </div>
    </template>
  </q-page>
</template>
