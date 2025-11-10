<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { useFindUserByProfileQuery } from '../composables/useFindUserByProfileQuery';
import { type UserItem, UserProfileId } from '../interfaces/userInterface';
import { ref } from 'vue';
import useAssignedClientMutation from '../composables/useAssignedClientMutation';
import useNotify from 'src/modules/shared/composables/useNotify';

const props = defineProps<{ clientId: number; clientName: string }>();

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();
const { users, findUserByProfileIdQuery } = useFindUserByProfileQuery(
  UserProfileId.TELEOPERATOR_AGENT,
);
const { assignedUserMutation } = useAssignedClientMutation();
const { errorNotify } = useNotify();

const onSubmit = async () => {
  if (itemSelected.value.length === 0) return errorNotify('No hay un teleoperador seleccionado');

  const dto = {
    userId: itemSelected.value[0]!.ct_teleoperator!.id,
    profileId: UserProfileId.TELEOPERATOR_AGENT,
    clients: [{ clientId: props.clientId }],
  };

  await assignedUserMutation.mutateAsync(dto).then(() => {
    onDialogOK();
  });
};

const itemSelected = ref<UserItem[]>([]);
const filter = ref('');
</script>
<template>
  <q-dialog ref="dialogRef" :persistent="true">
    <q-card class="q-pa-sm" style="width: 850px; max-width: 80vw">
      <q-card-section class="row items-center q-py-none q-pr-none">
        <div class="text-h5 text-weight-semi-bold">
          Asignar teleoperador a {{ props.clientName }}
        </div>
        <q-space />
        <q-btn icon="sym_r_close" flat round dense @click="onDialogCancel" padding="md" />
      </q-card-section>

      <q-card-actions class="row justify-end">
        <q-table
          :rows="users"
          :columns="[
            {
              label: 'Email',
              name: 'email',
              required: true,
              align: 'left',
              field: 'email',
            },
            {
              label: 'Usuario',
              name: 'name',
              required: true,
              align: 'center',
              field: 'name',
            },
            {
              label: 'Tenant',
              name: 'tenant',
              required: true,
              align: 'center',
              field: (row: UserItem) => row?.tenant?.name,
            },
            {
              label: 'Tipo',
              name: 'Tipo',
              required: true,
              align: 'center',
              field: (row: UserItem) => row?.tenant?.typeTenant,
            },
          ]"
          row-key="id"
          no-data-label="No hay teleoperador seleccionado."
          no-results-label="No se encontraron resultados."
          bordered
          class="full-width q-mt-md shadow-1"
          selection="single"
          v-model:selected="itemSelected"
          :pagination="{ rowsPerPage: 5 }"
          :loading="findUserByProfileIdQuery.isLoading.value"
          :filter="filter"
        >
          <template v-slot:top-left>
            <q-input dense debounce="400" outlined clearable v-model="filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="sym_r_search" />
              </template>
            </q-input>
          </template>
        </q-table>
        <q-btn
          color="primary"
          label="Asignar"
          class="q-mt-md"
          @click="onSubmit"
          :disable="assignedUserMutation.isPending.value"
          :loading="assignedUserMutation.isPending.value"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style scoped lang="scss"></style>
