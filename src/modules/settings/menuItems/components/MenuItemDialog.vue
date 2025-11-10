<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';

import useValidators from 'src/modules/shared/composables/useValidators';
import { useMenuItemMutation } from '../composables/useMenuItemsMutation';
import { ItemType } from '../interfaces/menuItemInterfaces';
import useDropDown from 'src/modules/shared/composables/useDropDowns';

const { isRequired } = useValidators();
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { menuItemDto, createMenu, updateMenu } = useMenuItemMutation();
const { menuItemsDropDown } = useDropDown('menu-items-drop-down');

const onSubmit = async () => {
  if (menuItemDto.value?.id) {
    await updateMenu.mutateAsync(menuItemDto.value);
  } else {
    await createMenu.mutateAsync(menuItemDto.value);
  }
  onDialogOK();
};
</script>

<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card style="width: 350px">
      <q-form @submit="onSubmit()">
        <q-card-section class="row justify-between items-center">
          <span class="text-h6">
            {{ !menuItemDto.id ? 'Crear Menu Item' : 'Actualizar Menu Item' }}
          </span>
          <q-btn
            icon="sym_r_close"
            unelevated
            round
            color="grey-3"
            text-color="grey"
            @click="onDialogCancel"
          />
        </q-card-section>

        <q-card-section class="row q-gutter-y-md q-col-gutter-x-md justify-end">
          <q-select
            class="col-12"
            v-model="menuItemDto.type"
            :options="[
              { label: 'Desplegable', value: ItemType.dropdown },
              { label: 'Enlace', value: ItemType.link },
              { label: 'Separador', value: ItemType.separator },
            ]"
            dense
            outlined
            label="Tipo"
            :rules="[isRequired]"
            emit-value
            map-options
          />

          <q-input
            class="col-12"
            v-model="menuItemDto.title"
            type="text"
            dense
            outlined
            label="Titulo"
            :rules="[isRequired]"
          />

          <q-input
            class="col-12"
            v-model.number="menuItemDto.order"
            type="number"
            dense
            outlined
            label="Lugar"
            :rules="[isRequired]"
          />

          <q-input
            class="col-12"
            v-model="menuItemDto.caption"
            type="text"
            dense
            outlined
            label="Desc. Corta"
            :rules="[]"
          />

          <q-input
            class="col-12"
            v-model="menuItemDto.icon"
            type="text"
            dense
            outlined
            label="Icono"
            :rules="[]"
          />

          <q-input
            class="col-12"
            v-model="menuItemDto.link"
            type="text"
            dense
            outlined
            label="Enlace"
            :rules="[]"
          />

          <q-select
            class="col-12"
            v-model="menuItemDto.parentId"
            :options="menuItemsDropDown"
            dense
            outlined
            label="Menu Padre"
            :rules="[]"
            emit-value
            map-options
          />

          <q-toggle
            v-model="menuItemDto.isActive"
            :label="menuItemDto.isActive ? 'Activo' : 'Inactivo'"
          />
        </q-card-section>

        <q-card-section class="row justify-end">
          <q-btn
            color="primary"
            icon="sym_r_add"
            :label="!menuItemDto.id ? 'Crear' : 'Actualizar'"
            type="submit"
            class="rounded-borders"
            :disable="createMenu.isPending.value || updateMenu.isPending.value"
            :loading="createMenu.isPending.value || updateMenu.isPending.value"
          />
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
