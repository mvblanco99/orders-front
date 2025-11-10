<script lang="ts" setup>
import { onMounted } from 'vue';
import useAuth from '../composables/useAuth';
import useResetPassword from '../composables/useResetPassword';
import BoxIcon from 'src/modules/shared/components/BoxIcon.vue';
import useValidators from 'src/modules/shared/composables/useValidators';

const { requestPasswordForm, verifyEmail } = useResetPassword();

const { getLoginFormFromLocalStore } = useAuth();

const { isRequired, isEmail } = useValidators();

const onSubmit = async () => {
  await verifyEmail();
};

onMounted(() => {
  getLoginFormFromLocalStore();

  if (requestPasswordForm.value) {
    requestPasswordForm.value.email = '';
  }
});
</script>

<template>
  <div class="col flex items-center justify-center q-pt-none">
    <q-card flat class="change-password">
      <q-card-section class="flex items-center justify-center q-mb-md">
        <box-icon icon="sym_r_lock" />
      </q-card-section>
      <q-card-section class="q-mb-md q-pa-none">
        <h1 class="title text-center text-weight-medium q-mb-sm">Restablece tu contraseña</h1>
        <p class="text-center text-subtitle2 text-blue-grey-8 text-weight-light">
          Por favor, introduce tu correo electrónico donde enviaremos un código de 6 dígitos.
        </p>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit" class="column q-gutter-y-sm">
          <q-input
            v-model="requestPasswordForm.email"
            outlined
            lazy-rules
            type="email"
            label="Correo electrónico"
            :rules="[isRequired, isEmail]"
          />
          <div class="column">
            <q-btn
              label="Obtener código"
              type="submit"
              color="primary"
              class="rounded-borders"
              no-caps
              unelevated
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.change-password {
  max-width: 400px;
  width: 100%;
}
</style>
