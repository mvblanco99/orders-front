<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, QTable } from 'quasar';

import TitlesComponent from '../../../shared/components/TitlesComponent.vue';
import { useMenuItemsQuery } from '../composables/useMenuItemsQuery';
import MenuItemDialog from '../components/MenuItemDialog.vue';
import { useMenuItemMutation } from '../composables/useMenuItemsMutation';
import type { MenuItem } from '../interfaces/menuItemInterfaces';

const { menuItems, menuItemByUserQuery, columnTable, refreshQuery } = useMenuItemsQuery();
const { fillMenuItemDto, resetMenuDto, deleteMenu, updateMenu } = useMenuItemMutation();
const filter = ref<string>('');

const openMenuItemDialog = (menuItem?: MenuItem) => {
  if (menuItem?.id) fillMenuItemDto(menuItem);
  else resetMenuDto();

  Dialog.create({
    component: MenuItemDialog,
    noBackdropDismiss: true,
  });
};

const toggleMenuItem = (menu: MenuItem) => {
  if (menu.isActive) deleteMenu.mutate(menu.id);
  else
    updateMenu.mutate({
      id: menu.id,
      title: menu.title,
      order: menu.order,
      caption: undefined,
      isActive: true,
      link: undefined,
      icon: undefined,
      type: undefined,
      parentId: undefined,
    });
};
</script>

<template>
  <q-pull-to-refresh @refresh="refreshQuery">
    <q-page class="relative-position col" padding>
      <div>
        <TitlesComponent
          title="Menus"
          has-buttons
          button-label="Nuevo Menu"
          :empty="true"
          @open-dialog="openMenuItemDialog()"
        />
      </div>

      <q-table
        bordered
        row-key="id"
        :rows="menuItems"
        :columns="columnTable"
        :loading="menuItemByUserQuery.isFetching.value"
        :rows-per-page-options="[5, 10, 15, 20]"
        :pagination="{ rowsPerPage: 10 }"
        :filter="filter"
        class="q-mt-md shadow-1"
      >
        <template v-slot:top-left>
          <q-input dense debounce="400" outlined clearable v-model="filter" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="sym_r_search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-icon="prop">
          <q-td :props="prop">
            <q-icon :name="prop.row[prop.col.name]" size="20px">
              <q-tooltip>{{ prop.row[prop.col.name] || 'Sin icono' }}</q-tooltip>
            </q-icon>
          </q-td>
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
                  <q-item clickable v-close-popup @click="openMenuItemDialog(prop.row)">
                    <q-item-section style="font-size: 12px">Editar menu</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="toggleMenuItem(prop.row)"
                    ><q-item-section style="font-size: 12px">
                      {{ prop.row.isActive ? 'Inactivar' : 'Activar' }} menu
                    </q-item-section>
                  </q-item>
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
