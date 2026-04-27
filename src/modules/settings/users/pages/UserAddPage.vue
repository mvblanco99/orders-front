<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { QForm } from 'quasar';
import useValidators from 'src/modules/shared/composables/useValidators';
import useDropDown from 'src/modules/shared/composables/useDropDowns';
import HorizontalConfigCard from '../components/HorizontalConfigCard.vue';
import useCreateUserMutation from '../composables/useCreateUserMutation';
import { useRouter } from 'vue-router';
import { UsersRoutesEnum } from '../router';

const { profiles } = useDropDown('profiles');
const router = useRouter();

const viewUserList = async () => {
  await router.push({ name: UsersRoutesEnum.USER_LIST });
};

const { isRequired, isPassword } = useValidators();
const { createUserDto, createUserMutation, resetDto } = useCreateUserMutation();

const myForm = ref<QForm>();
const isPwd = ref(true);

const onSubmit = async () => {
  if (!(await myForm.value?.validate())) return;
  await createUserMutation.mutateAsync();
};

onBeforeUnmount(() => {
  resetDto();
});
</script>

<template>
  <q-page class="relative-position col" padding>
    <div>
      <div>
        <q-btn
          class="q-mb-md"
          color="primary"
          icon="sym_r_arrow_back"
          label="Regresar"
          padding="xs"
          flat
          no-caps
          @click="viewUserList"
        />
      </div>
      <h2 class="q-my-none">Nuevo usuario</h2>
    </div>
    <p class="text-blue-grey-5">Cree un usuario nuevo para su aplicación.</p>

    <q-form ref="myForm" @submit="onSubmit">
      <div class="shadow-card rounded-borders">
        <HorizontalConfigCard flat class="q-pa-md q-mt-md">
          <template v-slot:left>
            <div class="text-h6">Datos básicos</div>
            <div class="text-weight-light text-blue-grey-5">
              Indique la información básica del usuario que desea crear.
            </div>
          </template>

          <template v-slot:right>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="text-weight-light text-blue-grey-5">Información de acceso</div>
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input
                  outlined
                  v-model="createUserDto.name"
                  label="Nombre"
                  :rules="[isRequired]"
                />
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input
                  outlined
                  v-model="createUserDto.lastName"
                  label="Apellido"
                  :rules="[isRequired]"
                />
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input
                  outlined
                  v-model="createUserDto.email"
                  label="Correo Electrónico"
                  :rules="[isRequired]"
                />
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input
                  outlined
                  v-model="createUserDto.password"
                  label="Contraseña"
                  :type="isPwd ? 'password' : 'text'"
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
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-select
                  outlined
                  v-model="createUserDto.profileId"
                  :options="profiles"
                  emit-value
                  map-options
                  label="Perfil"
                />
              </div>

              <div class="col-12 text-right">
                <q-btn unelevated color="primary" label="Guardar" type="submit" />
              </div>
            </div>
          </template>
        </HorizontalConfigCard>
      </div>
    </q-form>
  </q-page>
</template>

<style scoped></style>
