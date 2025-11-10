<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useUi from 'src/modules/start/composables/useUi';
import { AuthRoutes } from '../interfaces/auth-routes';

const { isDarkMode } = useUi();

const route = useRoute();
const router = useRouter();
const step = ref(1);

const goToBack = () => {
  router.go(-1);
};

onMounted(() => {
  if (route.name === AuthRoutes.CHANGE_PASSWORD_VERIFY) {
    step.value = 2;
  } else if (route.name === AuthRoutes.CHANGE_PASSWORD_RESET) {
    step.value = 3;
  } else {
    step.value = 1;
  }
});

watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName === AuthRoutes.CHANGE_PASSWORD_VERIFY) {
      step.value = 2;
    } else if (newRouteName === AuthRoutes.CHANGE_PASSWORD_RESET) {
      step.value = 3;
    } else {
      step.value = 1;
    }
  },
);
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container :class="isDarkMode ? 'bg-dark' : 'bg-white'">
      <q-page
        class="q-pa-md row items-center justify-center window-height q-col-gutter-lg page__container"
      >
        <div class="col-auto rounded-borders full-height q-pt-none banner__container">
          <q-img
            :src="`https://i.ibb.co/kYJw24W/Ad-2.png`"
            width="500px"
            no-spinner
            fetchpriority="high"
            class="rounded-borders full-height"
          >
            <div class="absolute-full transparent flex column justify-between">
              <div class="flex">
                <q-btn
                  flat
                  icon="sym_r_arrow_back"
                  color="white"
                  label="Regresar"
                  no-caps
                  @click="goToBack"
                />
              </div>
              <q-stepper
                v-model="step"
                vertical
                animated
                class="transparent shadow-0 stepper__password"
                active-color="white"
                inactive-color="indigo-3"
                done-icon="sym_r_check"
                done-color="white"
                dark
              >
                <q-step
                  :name="1"
                  title="Restablece tu contraseña "
                  caption="Introduce tu correo electrónico"
                  icon="sym_r_alternate_email"
                  :done="step > 1"
                />

                <q-step
                  :name="2"
                  title="Código de confirmación"
                  caption="Enviamos un código a tu correo"
                  icon="sym_r_pin"
                  :done="step > 2"
                />

                <q-step
                  :name="3"
                  title="Nueva contraseña"
                  caption="La contraseña debe tener al menos 6 caracteres"
                  icon="sym_r_password"
                />
              </q-stepper>
              <div class="flex items-center justify-start q-pa-md">
                <q-img
                  src="images/logos/logo_vital_clinic_dark.png"
                  height="80px"
                  fit="contain"
                  no-spinner
                  position="0 0"
                />
              </div>
            </div>
          </q-img>
        </div>
        <div class="lt-md flex items-start justify-start full-width q-pt-none">
          <q-btn
            flat
            icon="sym_r_arrow_back"
            color="primary"
            label="Regresar"
            @click="goToBack"
            padding="8px 0"
            :ripple="false"
            no-caps
          />
        </div>
        <div class="col flex items-center justify-center q-pt-none">
          <router-view></router-view>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.change-password {
  max-width: 400px;
  width: 100%;
}
.step__number {
  width: 48px;
  height: 48px;
  border-radius: 100%;
  border: 1px solid #ffffff;
}

.q-item.q-router-link--active,
.q-item--active {
  color: var(--q-white);
}

.q-item--active .step__number {
  background-color: rgb(255 255 255 / 16%);
}

.return__button {
  display: none;
}

@media (max-width: 1024px) {
  .page__container {
    flex-direction: column;
  }
  .banner__container {
    display: none;
  }
  .return__button {
    display: block;
  }
}
</style>
