<script setup lang="ts">
import { Dialog, QTable } from 'quasar';

import { useZoneQuery } from '../composables/useZonesQuery';
import type { ZoneItem } from '../interfaces/ZoneInterface';
import TitlesComponent from 'src/modules/shared/components/TitlesComponent.vue';
import ZoneDialog from '../components/ZoneDialog.vue';
import { useZoneMutation } from '../composables/useZoneMutation';

const {
  zones,
  zonesQuery,
  columnTable,
  zoneFilters,
  zonePagination,
  onRequest,
  setZonesInputSearch,
} = useZoneQuery();

const { fillZoneDto } = useZoneMutation();

const openNewZoneDialog = () => {
  Dialog.create({
    component: ZoneDialog,
  });
};

const goToZoneEdit = (zone: ZoneItem) => {
  fillZoneDto(zone);
  Dialog.create({
    component: ZoneDialog,
  });
};
</script>

<template>
  <q-pull-to-refresh @refresh="zonesQuery.refetch()">
    <q-page class="relative-position col" padding>
      <div>
        <TitlesComponent
          title="Zonas"
          has-buttons
          button-label="Agregar Zona"
          :empty="true"
          @open-dialog="openNewZoneDialog()"
        />
      </div>

      <q-table
        bordered
        row-key="id"
        :rows="zones"
        :columns="columnTable"
        :rows-per-page-options="[5, 10, 15, 20]"
        v-model:pagination="zonePagination"
        class="q-mt-md"
        @request="onRequest"
      >
        <template v-slot:top-left>
          <q-input
            dense
            debounce="600"
            outlined
            clearable
            v-model="zoneFilters.inputSearch"
            @update:model-value="(val) => setZonesInputSearch(val as string)"
            placeholder="Buscar"
          >
            <template v-slot:append>
              <q-icon name="sym_r_search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-isActive="prop">
          <q-td :props="prop">
            <q-chip
              :class="`${
                prop.row[prop.col.name] == true
                  ? 'state-active rounded-borders'
                  : 'state-desactive rounded-borders'
              } chip-dense`"
            >
              {{ prop.row[prop.col.name] == true ? 'Activo' : 'Desactivo' }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="prop">
          <q-td :props="prop" auto-width>
            <q-btn dense color="primary" icon="sym_r_More_vert" flat>
              <q-menu anchor="top middle" self="bottom right">
                <q-list>
                  <q-item clickable v-close-popup @click="goToZoneEdit(prop.row)">
                    <q-item-section style="font-size: 12px">Editar zona</q-item-section>
                  </q-item>
                  <!-- <q-item clickable v-close-popup @click="goToZoneEdit(prop.row)"
                    ><q-item-section style="font-size: 12px">
                      {{ prop.row.isActive ? 'Inactivar' : 'Activar' }} zona
                    </q-item-section>
                  </q-item> -->
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-page>
  </q-pull-to-refresh>
</template>

<style lang="scss" scoped>
.state-active {
  border: 1px solid #7cde63;
  background-color: rgba(124, 222, 99, 0.2);
  color: #6bc253;
}
.state-desactive {
  border: 1px solid #da615f;
  background-color: rgba(218, 97, 95, 0.2);
  color: #b84d4b;
}
.chip-dense {
  padding: 8px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 20px;
}
</style>
