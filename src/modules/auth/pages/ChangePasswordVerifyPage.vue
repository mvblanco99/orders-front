<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import useAuth from '../composables/useAuth';
import useResetPassword from '../composables/useResetPassword';
import BoxIcon from 'src/modules/shared/components/BoxIcon.vue';
import InputOtp from 'src/modules/shared/components/InputOtp.vue';

const { loginForm, getLoginFormFromLocalStore } = useAuth();
const { verifyCodeForm, submitVerificationCode } = useResetPassword();
const otpLength = ref(6);

const onSubmit = async () => {
  await submitVerificationCode();
};

onMounted(() => {
  const resp = getLoginFormFromLocalStore();
  if (resp) {
    loginForm.value = resp;
  }
  verifyCodeForm.value.code = '';
});
</script>

<template>
  <div class="col flex items-center justify-center q-pt-none">
    <q-card flat class="change-password">
      <q-card-section class="flex items-center justify-center q-mb-md">
        <box-icon icon="sym_r_pin" />
      </q-card-section>
      <q-card-section class="q-mb-md q-pa-none">
        <h1 class="title text-center text-weight-medium q-mb-sm">
          Ingresa el código de confirmación
        </h1>
        <p class="text-center text-subtitle2 text-blue-grey-8 text-weight-light">
          Te hemos enviado un código de 6 dígitos a tu correo electrónico.
        </p>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="column q-gutter-y-sm">
          <input-otp
            v-model="verifyCodeForm.code"
            :length="otpLength"
            type="number"
            class="q-mb-md"
            :disable="false"
            :readonly="false"
            @complete="onSubmit"
          />
          <div class="column">
            <q-btn
              label="Continuar"
              type="submit"
              color="primary"
              class="rounded-borders"
              no-caps
              unelevated
              :disabled="verifyCodeForm.code.length !== otpLength"
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
