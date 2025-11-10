<script lang="ts" setup>
import { useDialogPluginComponent, useQuasar } from 'quasar';
import type { AxiosError } from 'axios';
import useNotify from '../composables/useNotify';
import useAuthorizeAdmin from '../composables/useAuthorizeAdmin';

interface Props {
  text: string;
}

const props = defineProps<Props>();
const { state, isAuth } = useAuthorizeAdmin();
const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();
const { screen } = useQuasar();
const { errorNotify } = useNotify();

const handleAuth = async () => {
  try {
    await isAuth();
    onDialogOK(true);
  } catch (error) {
    const errorAxios = error as AxiosError;
    if (errorAxios.status === 401) {
      errorNotify('No estas autorizado');
    }
  }
};
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogCancel" persistent>
    <q-card :style="`${screen.gt.lg && 'min-width: 400px'}`">
      <q-card-section>
        <div class="col-12 row justify-between q-py-xs items-center bb_container">
          <div class="text-h6">Autorización</div>
          <q-btn
            @click="onDialogCancel"
            icon="sym_r_close"
            unelevated
            round
            dense
            color="grey-3"
            text-color="grey"
          />
        </div>
        <span style="" :class="`text-subtitle1 col-12 font_size_12 q-mt-md`">{{
          props.text ?? props.text
        }}</span>
      </q-card-section>
      <q-card-section>
        <p>Datos del supervisor</p>
        <q-form class="q-gutter-y-sm" @submit="isAuth">
          <q-input
            v-model="state.email"
            type="text"
            class="col-12"
            label="Correo Electrónico"
            outlined
            dense
          />
          <q-input
            v-model="state.password"
            class="col-12"
            type="password"
            label="Contraseña"
            outlined
            dense
          />
          <div class="col-12 row justify-end">
            <q-btn label="Autorizar" color="primary" @click="handleAuth" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<style lang="scss">
.font_size_12 {
  font-size: 12px;
}
</style>
