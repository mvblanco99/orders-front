<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';

import useValidators from 'src/modules/shared/composables/useValidators';
import { useMenuAssociatedQuery } from '../composables/useMenuAssociatedQuery';
import { useMenuAssociatedMutation } from '../composables/useMenuAssociatedMutation';
import useDropDown from 'src/modules/shared/composables/useDropDowns';

interface Props {
  profileId: number;
}

const props = defineProps<Props>();

const { menuItemByUserQuery } = useMenuAssociatedQuery(props.profileId);
const { isRequired } = useValidators();
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { updateAssociated } = useMenuAssociatedMutation();
const { menuItems } = useDropDown('menu-items');
const ids = ref<number[]>([]);

const onSubmit = async () => {
  const body = {
    profileId: props.profileId,
    menuIds: ids.value,
  };

  await updateAssociated.mutateAsync(body);

  onDialogOK();
};

onMounted(async () => {
  await menuItemByUserQuery.refetch();
  if (menuItemByUserQuery.data?.value?.length)
    ids.value = menuItemByUserQuery.data.value.map((item) => item.id) || [];
});
</script>

<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card style="width: 350px">
      <q-form @submit="onSubmit()">
        <q-card-section class="row justify-between items-center">
          <span class="text-h6"> Menu Asociados al Perfil </span>
          <q-btn
            icon="sym_r_close"
            unelevated
            round
            color="grey-3"
            text-color="grey"
            @click="onDialogCancel"
          />
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="ids"
            :options="menuItems"
            outlined
            label="Menus disponibles"
            multiple
            :rules="[isRequired]"
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-section class="row justify-end">
          <q-btn
            color="primary"
            icon="sym_r_add"
            label="Actualizar"
            type="submit"
            class="rounded-borders"
            :disable="updateAssociated.isPending.value"
            :loading="updateAssociated.isPending.value"
          />
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
