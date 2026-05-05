<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { useFailuresOrderQuery } from '../composables/useFailuresOrderQuery';
import { useFailuresStore } from '../stores/useFailuresStore';
import useNotify from 'src/modules/shared/composables/useNotify';
import type { FailuresPartRow } from '../interfaces/failures.interface';
import { FailuresRoutesEnum } from '../router';

const router = useRouter();
const route = useRoute();
const { infoNotify } = useNotify();
const failuresStore = useFailuresStore();
const { order, myParts, isLoading, isFetching, isError, error, search, clear } =
  useFailuresOrderQuery();

const searchOrderNumber = ref('');

const loading = computed(() => isLoading.value || isFetching.value);
const hasOrder = computed(() => !!order.value);

watch(isError, (val) => {
  if (val) {
    const msg = (error.value as Error)?.message ?? 'Error al buscar la orden';
    infoNotify(msg);
  }
});

watch(myParts, (parts) => {
  if (hasOrder.value && parts.length === 0) {
    infoNotify('No tienes partes asignadas en este pedido');
  }
});

const partsColumns: QTableColumn[] = [
  { name: 'partId', label: 'Parte #', field: 'partId', align: 'center', sortable: true },
  { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center', sortable: true },
  { name: 'pickerName', label: 'Picker', field: 'pickerName', align: 'left', sortable: true },
  { name: 'packerName', label: 'Packer', field: 'packerName', align: 'left', sortable: true },
  {
    name: 'failuresCount',
    label: 'Fallas',
    field: 'failuresCount',
    align: 'center',
    sortable: true,
  },
];

watch(order, (val) => {
  if (val) {
    void router.replace({ query: { order: val.orderNumber } });
  }
});

onMounted(() => {
  const orderParam = route.query.order;
  if (orderParam && typeof orderParam === 'string') {
    searchOrderNumber.value = orderParam;
    search(orderParam);
  }
});

const handleSearch = () => {
  if (!searchOrderNumber.value.trim()) return;
  search(searchOrderNumber.value);
};

const handleClear = () => {
  searchOrderNumber.value = '';
  clear();
  void router.replace({ query: {} });
};

const handleSelectPart = (part: FailuresPartRow) => {
  void router.push({
    name: FailuresRoutesEnum.FailuresPartDetail,
    params: { partId: part.partId },
  });
};

onUnmounted(() => {
  failuresStore.resetOrder();
});
</script>

<template>
  <q-page padding>
    <!-- Encabezado -->
    <div class="q-mb-lg">
      <div class="row items-center q-mb-md">
        <div>
          <h1 class="text-h4 text-weight-semi-bold q-ma-none">Fallas de pedidos</h1>
          <p class="text-body2 text-grey-700 q-mt-xs q-mb-none">
            Registro de fallas por parte de pedidos rechequeados
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
              <div class="text-caption text-grey-600">Mis partes asignadas</div>
              <div class="text-body1 text-weight-medium">
                <q-badge :color="myParts.length > 0 ? 'primary' : 'grey'" :label="myParts.length" />
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

      <!-- Tabla de partes -->
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6 text-weight-semi-bold q-mb-md">Mis partes</div>

          <q-table
            :rows="myParts"
            :columns="partsColumns"
            row-key="partRowId"
            no-data-label="No tienes partes asignadas en este pedido."
            no-results-label="No se encontraron resultados."
            bordered
            flat
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body="props">
              <q-tr :props="props" class="cursor-pointer" @click="handleSelectPart(props.row)">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <template v-if="col.name === 'partId'">
                    <q-badge color="primary" :label="`Parte ${props.row.partId}`" />
                  </template>

                  <template v-else-if="col.name === 'pickerName'">
                    <div class="flex items-center q-gutter-xs">
                      <q-icon name="sym_r_person" size="xs" color="grey-6" />
                      <span>{{ props.row.pickerName }}</span>
                    </div>
                  </template>

                  <template v-else-if="col.name === 'packerName'">
                    <div class="flex items-center q-gutter-xs">
                      <q-icon name="sym_r_person" size="xs" color="grey-6" />
                      <span>{{ props.row.packerName }}</span>
                    </div>
                  </template>

                  <template v-else-if="col.name === 'failuresCount'">
                    <q-badge
                      :color="props.row.failuresCount > 0 ? 'negative' : 'positive'"
                      :label="props.row.failuresCount"
                    />
                  </template>

                  <template v-else>
                    {{ col.value }}
                  </template>
                </q-td>
                <q-td auto-width>
                  <q-icon name="sym_r_chevron_right" color="grey-5" />
                </q-td>
              </q-tr>
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
        <p class="text-body2">Se mostrarán las partes que tienes asignadas como rechequeador</p>
      </div>
    </template>
  </q-page>
</template>
