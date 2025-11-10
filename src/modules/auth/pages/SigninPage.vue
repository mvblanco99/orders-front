<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { version } from '../../../../package.json';
import useValidators from '../../shared/composables/useValidators';
import useAuth from '../composables/useAuth';
import useUi from 'src/modules/start/composables/useUi';
import { AuthRoutes } from '../interfaces/auth-routes';

const isPwd = ref(true);

const { loginForm, login, getLoginFormFromLocalStore } = useAuth();
const { isRequired, isPassword, isEmail } = useValidators();

const onSubmit = () => login();
const { screen } = useQuasar();
const { isDarkMode } = useUi();
const showLogin = ref(!screen.xs);

onMounted(() => {
  const resp = getLoginFormFromLocalStore();
  if (resp) loginForm.value = { ...resp, appVersion: version };
});

watch(
  () => screen.xs,
  (newValue) => {
    if (!newValue) showLogin.value = true;
    if (newValue) showLogin.value = false;
  },
);
</script>

<template>
  <q-page-container :class="isDarkMode ? 'bg-dark' : 'bg-white'">
    <q-page
      :class="
        'row items-center justify-center window-height page__container' +
        (screen.gt.xs ? ' q-pa-md' : '')
      "
    >
      <div
        v-if="screen.xs && !showLogin"
        class="col flex items-end q-pa-md q-mb-lg button_container"
      >
        <div v-if="!showLogin" class="q-mb-lg">
          <p class="text-h2 text-weight-bold text-primary">¡Bienvenido!</p>
          <p class="text-body1 text-secondary">
            Estamos felices de verte de nuevo ¿Listo para continuar?
          </p>
        </div>
        <q-btn
          label="Comenzar"
          color="primary"
          icon-right="sym_r_chevron_right"
          class="full-width"
          no-caps
          padding="md"
          v-if="!showLogin"
          @click="showLogin = true"
        />
      </div>
      <div
        v-if="!screen.xs || showLogin"
        :class="
          'col-xs-12 col-sm-6 col-md-5 col-lg-shrink flex items-center justify-center q-pt-none' +
          (screen.xs
            ? 'items-start q-px-md'
            : screen.sm
              ? ' q-px-lg'
              : screen.gt.md
                ? ' q-px-xl'
                : '')
        "
      >
        <div
          v-if="showLogin && screen.xs"
          class="col-12 flex justify-start items-start full-width q-py-md"
        >
          <q-btn
            flat
            icon-right="sym_r_arrow_back"
            padding="xs"
            no-caps
            @click="showLogin = false"
          />
        </div>
        <q-card flat class="login">
          <q-card-section class="text-center q-mb-md">
            <q-img
              src="images/logos/logo_vital_clinic_light.png"
              height="80px"
              fit="contain"
              no-spinner
            />
          </q-card-section>
          <q-card-section class="q-mb-md q-pa-none">
            <h1 class="title text-center text-weight-medium q-mb-sm">Iniciar sesión</h1>
            <p class="text-center text-subtitle2 text-blue-grey-8 text-weight-light">
              Ingresa los datos para acceder a tu cuenta
            </p>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="column q-gutter-y-sm">
              <q-input
                v-model="loginForm.email"
                outlined
                lazy-rules
                type="email"
                label="Correo electrónico"
                :rules="[isRequired, isEmail]"
              />
              <q-input
                v-model="loginForm.password"
                outlined
                label="Contraseña"
                :type="isPwd ? 'password' : 'text'"
                :rules="[isRequired, isPassword]"
                hide-bottom-space
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'sym_r_visibility_off' : 'sym_r_visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="q-mt-md q-mb-md">
                <q-checkbox
                  v-model="loginForm.remember"
                  color="primary"
                  label="Recordar mis datos"
                />
              </div>
              <label class="column">
                <q-btn
                  label="Ingresar"
                  type="submit"
                  color="primary"
                  class="rounded-borders"
                  no-caps
                  unelevated
                />
              </label>
              <div class="flex justify-center">
                <q-btn
                  class="q-mt-sm"
                  flat
                  label="¿Olvidaste tu contraseña?"
                  color="primary"
                  no-caps
                  @click="$router.push({ name: AuthRoutes.CHANGE_PASSWORD_REQUEST })"
                />
              </div>
            </q-form>
          </q-card-section>
          <q-card-section class="flex justify-center items-center q-gutter-sm">
            <q-btn
              flat
              round
              color="primary"
              icon="img:images/social/instagram.svg"
              padding="sm"
              aria-label="instagram"
              href="https://www.instagram.com/drogueriavitalclinic/"
              target="_blank"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="absolute-bottom-right q-pr-md q-pb-sm">
        <span class="text-subtitle2 text-weight-light opacity"> v{{ version }} </span>
      </div>
    </q-page>
  </q-page-container>
</template>

<style scoped>
.login {
  max-width: 400px;
  width: 100%;
}

.button_container {
  width: 95%;
}

@media (max-width: 760px) {
  .banner__container {
    display: none;
  }
}

@media (max-width: 599px) {
  .page__container {
    height: calc(100vh - 45px) !important;
    justify-content: flex-start;
    align-items: stretch;
  }
  .banner__container {
    display: block;
  }
  .q-carousel {
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
  }
}

.banner__container {
  max-width: 1000px;
}

.opacity {
  opacity: 0.5;
}
</style>
