<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { computed, onMounted, watch } from 'vue';

import { useListPermission } from '../composables/useListPermission';
import { useProfile } from '../composables/useProfile';

import useValidators from 'src/modules/shared/composables/useValidators';

import { PermissionName, usePermission } from '../composables/usePermission';
import { useListOneProfile } from '../composables/useListOneProfile';
import { useProfileEvents } from '../composables/useProfileEvents';

interface props {
  id?: number;
  name?: string;
}

const props = defineProps<props>();

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const { permissionBySubject } = useListPermission();
const { profileDto, profilesPermission, profilePermissionToDel } = useProfile();
const { profileItem, idSelected } = useListOneProfile();
const { isRequired } = useValidators();
const { permissionItem, isManageAllSelected, isSelected, togglePermission } = usePermission();
const { handleSubmit, handleCancel } = useProfileEvents(onDialogOK, onDialogCancel);

const permissionsToUpdate = computed(() => {
  return permissionItem.value.map((val) => ({ id: val.id }));
});

const permissionsToDelete = computed(() => {
  return (
    profileItem.value.Permissions?.filter((oldPermissions) => {
      return !permissionItem.value.some(
        (newPermissions) => oldPermissions.id === newPermissions.id,
      );
    }).map((delItem) => ({ id: delItem.id })) || []
  );
});

watch(
  permissionItem,
  () => {
    profilesPermission.value.items = permissionsToUpdate.value;
    profilePermissionToDel.value.items = permissionsToDelete.value;

    isManageAllSelected.value = permissionItem.value.some(
      (p) => (p.name as PermissionName) === PermissionName.MANAGEALL,
    );
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  idSelected.value = props.id ?? 0;
  profileDto.value.name = props.name ?? '';
});
</script>
<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card style="width: 350px">
      <q-form @submit="handleSubmit(id)">
        <q-card-section class="row justify-between items-center">
          <span class="text-h6"> {{ !id ? 'Crear perfil ' : 'Actualizar perfil' }} </span>
          <q-btn
            icon="sym_r_close"
            unelevated
            round
            color="grey-3"
            text-color="grey"
            @click="handleCancel"
          />
        </q-card-section>
        <q-card-section class="">
          <q-input
            v-model="profileDto.name"
            type="text"
            dense
            outlined
            label="Nombre del perfil"
            :rules="[isRequired]"
          />

          <q-list bordered class="rounded-borders col-12">
            <q-expansion-item
              v-for="(item, index) in permissionBySubject"
              :key="index"
              expand-separator
              icon="sym_r_perm_identity"
              :label="`${permissionBySubject[index]?.subject?.split(/(?=[A-Z])/).join(' ')}`"
              class="col-12 text-subtitle1"
              :disable="item.subject !== 'all' && isManageAllSelected"
            >
              <q-card class="col-12">
                <q-card-section class="row">
                  <q-toggle
                    v-for="(permission, index) in item.permission"
                    :key="index"
                    :label="permission.action"
                    :model-value="isSelected(permission)"
                    @click="togglePermission(permission)"
                    class="col-12 col-sm-6 text-subtitle1"
                    :disable="item.subject !== 'all' && isManageAllSelected"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card-section>
        <q-card-section class="row justify-end">
          <q-btn
            color="primary"
            icon="sym_r_add"
            :label="!id ? 'crear' : 'actualizar'"
            type="submit"
            class="rounded-borders"
          />
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<style scoped lang="scss"></style>
