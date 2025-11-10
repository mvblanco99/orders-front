<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import useDropDown from 'src/modules/shared/composables/useDropDowns';
import { ref } from 'vue';
import { UserProfileId } from '../interfaces/userInterface';
import useValidators from 'src/modules/shared/composables/useValidators';
import useAssignedClientMutation from '../composables/useAssignedClientMutation';
import useNotify from 'src/modules/shared/composables/useNotify';
import type { ClientDto } from '../interfaces/assingClientsInterfaces';

interface Props {
  profile: number;
  clients: ClientDto[];
}

const props = defineProps<Props>();

const { collectionAnalyst } = useDropDown('collectionAnalyst');
const { teleoperator } = useDropDown('teleoperator');

const { isRequired } = useValidators();
const { errorNotify } = useNotify();
const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();

const { assignedUserMutation } = useAssignedClientMutation();

const userId = ref<number | null>();
const profiles = {
  [UserProfileId.COLLECTIONS_ANALYST]: collectionAnalyst,
  [UserProfileId.TELEOPERATOR_AGENT]: teleoperator,
};
const getUserByProfile = (profileId: keyof typeof profiles) => profiles[profileId];

const handleAssignedClient = async () => {
  if (!userId.value) return errorNotify('Debe seleccionar un usuario');

  await assignedUserMutation.mutateAsync({
    userId: userId.value,
    profileId: props.profile,
    clients: props.clients,
  });

  onDialogOK();
};
</script>

<template>
  <q-dialog ref="dialogRef" :persistent="false">
    <q-card class="q-pa-sm" style="width: 800px; max-width: 80vw">
      <q-card-section class="row items-center q-py-none q-pr-none">
        <div class="text-h5 text-weight-semi-bold">Seleccionar usuario</div>
        <q-space />
        <q-btn icon="sym_r_close" flat round dense @click="onDialogCancel" padding="md" />
      </q-card-section>

      <q-card-actions>
        <div class="col-xs-12 col-sm-6">
          <q-select
            outlined
            v-model="userId"
            :options="getUserByProfile(props.profile).value"
            emit-value
            map-options
            label="Donde Trabaja"
            :rules="[isRequired]"
          />
        </div>
        <div class="col-12 row justify-end">
          <q-btn
            @click="handleAssignedClient"
            color="primary"
            outline
            label="Asignar"
            class="rounded-borders"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style lang="scss"></style>
