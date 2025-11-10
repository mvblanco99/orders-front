<script setup lang="ts">
import { Dialog } from 'quasar';

import TitlesComponent from 'src/modules/shared/components/TitlesComponent.vue';
import MenusAssociatedDialog from 'src/modules/settings/menuItems/components/MenusAssociatedDialog.vue';
import { useListProfile } from '../composables/useListProfile';
import { useProfile } from '../composables/useProfile';
import useDates from 'src/modules/shared/composables/useDates';

import ProfileDialog from '../component/ProfileDialog.vue';
import { useProfileEvents } from '../composables/useProfileEvents';
import { useManageStore } from '../composables/useManageStore';
import type { Pagination } from 'src/modules/shared/interface/Pagination';

const { profiles, queryProfile, dataFilter } = useListProfile();
const { columnTable } = useProfile();
const { formatDateVzla } = useDates();
const { profilePagination, setProfilePagination } = useManageStore();
const { handleDelete } = useProfileEvents();

const openProfileDialog = (id?: number, name?: string) => {
  Dialog.create({
    component: ProfileDialog,
    noBackdropDismiss: true,
    componentProps: {
      id: id,
      name: name,
    },
  }).onOk(() => queryProfile.refetch);
};

const goToMenusAssociated = (profileId: number) => {
  Dialog.create({
    component: MenusAssociatedDialog,
    noBackdropDismiss: true,
    componentProps: {
      profileId,
    },
  });
};

const onRequest = <T extends { pagination: Pagination }>(props: T) => {
  setProfilePagination(props.pagination);
};
</script>
<template>
  <q-page class="relative-position col" padding>
    <div>
      <TitlesComponent
        title="Perfiles"
        has-buttons
        button-label="Nuevo perfil"
        :empty="true"
        @open-dialog="openProfileDialog"
      />
    </div>
    <q-table
      bordered
      :rows="profiles"
      :columns="columnTable"
      :filter="dataFilter.inputSearch"
      class="q-mt-md shadow-1"
      v-model:pagination="profilePagination"
      @request="onRequest"
    >
      <template v-slot:top-left>
        <q-input
          dense
          debounce="400"
          outlined
          clearable
          v-model="dataFilter.inputSearch"
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

      <template v-slot:body-cell-createdAt="prop">
        <q-td :props="prop">
          {{ formatDateVzla(prop.row.createdAt, 'll') }}
        </q-td>
      </template>
      <template v-slot:body-cell-updatedAt="prop">
        <q-td :props="prop">
          {{ formatDateVzla(prop.row.updatedAt, 'll') }}
        </q-td>
      </template>
      <template v-slot:body-cell-actions="prop">
        <q-td :props="prop" auto-width>
          <q-btn dense color="primary" icon="sym_r_More_vert" flat>
            <q-menu anchor="top middle" self="bottom right">
              <q-list>
                <q-item clickable v-close-popup @click="goToMenusAssociated(prop.row.id)">
                  <q-item-section style="font-size: 12px">Menus Asociados</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="openProfileDialog(prop.row.id, prop.row.name)"
                  ><q-item-section style="font-size: 12px">Editar</q-item-section></q-item
                >
                <q-item clickable v-close-popup @click="handleDelete(prop.row.id)"
                  ><q-item-section style="font-size: 12px"> Eliminar </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
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
