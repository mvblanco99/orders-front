<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOrderStore } from '../stores/useOrderStore';

const orderStore = useOrderStore();
const { searchParams } = storeToRefs(orderStore);

const emit = defineEmits<{
  search: [];
  clear: [];
}>();

const handleSearch = () => {
  emit('search');
};

const handleClear = () => {
  orderStore.resetSearchParams();
  emit('clear');
};
</script>

<template>
  <q-card flat bordered class="order-filters-card">
    <q-card-section>
      <div class="text-subtitle1 text-weight-semi-bold q-mb-md">
        <q-icon name="sym_r_filter_alt" size="20px" class="q-mr-xs" />
        Filtros de búsqueda
      </div>

      <div class="row q-col-gutter-md">
        <!-- Número de orden -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-input
            v-model="searchParams.orderNumber"
            label="Número de orden"
            outlined
            dense
            clearable
            @keyup.enter="handleSearch"
          >
            <template v-slot:prepend>
              <q-icon name="sym_r_tag" />
            </template>
          </q-input>
        </div>

        <!-- Zona -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="searchParams.zoneId"
            label="Zona"
            outlined
            dense
            :options="[]"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="sym_r_location_on" />
            </template>
          </q-select>
        </div>

        <!-- Fecha inicio -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-input
            v-model="searchParams.startDate"
            label="Fecha inicio"
            outlined
            dense
            type="date"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="sym_r_calendar_today" />
            </template>
          </q-input>
        </div>

        <!-- Fecha fin -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-input
            v-model="searchParams.endDate"
            label="Fecha fin"
            outlined
            dense
            type="date"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="sym_r_calendar_today" />
            </template>
          </q-input>
        </div>

        <!-- Picker -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="searchParams.pickerId"
            label="Picker"
            outlined
            dense
            :options="[]"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="sym_r_person" />
            </template>
          </q-select>
        </div>

        <!-- Rechecker -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="searchParams.recheckerId"
            label="Rechecker"
            outlined
            dense
            :options="[]"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="sym_r_person" />
            </template>
          </q-select>
        </div>

        <!-- Packer -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="searchParams.packerId"
            label="Packer"
            outlined
            dense
            :options="[]"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="sym_r_person" />
            </template>
          </q-select>
        </div>

        <!-- Estado activo -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="searchParams.isActive"
            label="Estado"
            outlined
            dense
            :options="[
              { label: 'Activo', value: true },
              { label: 'Inactivo', value: false },
            ]"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="sym_r_toggle_on" />
            </template>
          </q-select>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="q-pa-md">
      <q-btn flat label="Limpiar" color="grey-7" icon="sym_r_refresh" @click="handleClear" />
      <q-btn unelevated label="Buscar" color="primary" icon="sym_r_search" @click="handleSearch" />
    </q-card-actions>
  </q-card>
</template>

<style scoped lang="scss">
.order-filters-card {
  border-radius: $rounded-borders;
}
</style>
