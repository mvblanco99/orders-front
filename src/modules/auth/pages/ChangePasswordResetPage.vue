<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import useAuth from '../composables/useAuth';
import useResetPassword from '../composables/useResetPassword';
import useValidators from '../../shared/composables/useValidators';
import BoxIcon from 'src/modules/shared/components/BoxIcon.vue';

const { getLoginFormFromLocalStore } = useAuth();
const { isRequired, isPassword } = useValidators();
const { resetPasswordForm, submitNewPassword } = useResetPassword();

const isPwd = ref(true);
const isPwdConfirm = ref(true);

const onSubmit = async () => {
  await submitNewPassword();
};

onMounted(() => {
  getLoginFormFromLocalStore();

  resetPasswordForm.value.newPassword = '';
  resetPasswordForm.value.confirmPassword = '';
});
</script>

<template>
  <div class="col flex items-center justify-center q-pt-none">
    <q-card flat class="change-password">
      <q-card-section class="flex items-center justify-center q-mb-md">
        <box-icon icon="sym_r_lock" />
      </q-card-section>
      <q-card-section class="q-mb-md q-pa-none">
        <h1 class="title text-center text-weight-medium q-mb-sm">Crea una nueva contraseña</h1>
        <p class="text-center text-subtitle2 text-blue-grey-8 text-weight-light">
          Por favor, escribe una contraseña que tenga al menos 6 caracteres
        </p>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="column q-gutter-y-sm">
          <q-input
            v-model="resetPasswordForm.newPassword"
            outlined
            lazy-rules
            :type="isPwd ? 'password' : 'text'"
            label="Nueva contraseña"
            :rules="[isRequired, isPassword]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'sym_r_visibility_off' : 'sym_r_visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input
            v-model="resetPasswordForm.confirmPassword"
            outlined
            lazy-rules
            :type="isPwdConfirm ? 'password' : 'text'"
            label="Confirmar contraseña"
            :rules="[
              isRequired,
              isPassword,
              (val) => val === resetPasswordForm.newPassword || 'Las contraseñas no coinciden',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwdConfirm ? 'sym_r_visibility_off' : 'sym_r_visibility'"
                class="cursor-pointer"
                @click="isPwdConfirm = !isPwdConfirm"
              />
            </template>
          </q-input>
          <div class="column">
            <q-btn
              label="Restablecer contraseña"
              type="submit"
              color="primary"
              class="rounded-borders"
              no-caps
              unelevated
              :disabled="
                !resetPasswordForm.newPassword ||
                !resetPasswordForm.confirmPassword ||
                resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword
              "
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
