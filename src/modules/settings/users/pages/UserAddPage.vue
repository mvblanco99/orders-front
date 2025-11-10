<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { Dialog, QForm } from 'quasar';
import useValidators from 'src/modules/shared/composables/useValidators';
import useDropDownByType from 'src/modules/shared/composables/useDropDownsByType';
import useDropDown from 'src/modules/shared/composables/useDropDowns';
import HorizontalConfigCard from '../components/HorizontalConfigCard.vue';
import { TypeTenantEnum, UserProfileId } from '../interfaces/userInterface';
import DefineCustomersDialog from '../components/DefineCustomersDialog.vue';
import useAddUserMutation from '../composables/useAddUserMutation';
import SelectAutoComplete from '../components/SelectAutoComplete.vue';
import { useRouter } from 'vue-router';
import { UsersRoutesEnum } from '../router';

const { manufacturers } = useDropDown('manufacturers');
const { erpClients } = useDropDown('erp_clients');
const { erpSalespeople } = useDropDown('erp_salespeople');
const { profilesByTenant, type } = useDropDownByType('profiles-by-tenant');
const router = useRouter();

const viewUserList = async () => {
  await router.push({ name: UsersRoutesEnum.USER_LIST });
};

const { isRequired, isPassword } = useValidators();
const { userDto, createUserMutation, userCreatedResponse, resetDto } = useAddUserMutation();

const myForm = ref<QForm>();
const isPwd = ref(true);

const onSubmit = async () => {
  if (!(await myForm.value?.validate())) return;
  await createUserMutation.mutateAsync(userDto.value);
};

const openDefineCustomersDialog = () => {
  Dialog.create({
    component: DefineCustomersDialog,
    componentProps: {
      userId: userCreatedResponse.value?.id,
      name: userCreatedResponse.value?.user.name,
      profile: userCreatedResponse.value?.user.profileId,
    },
  });
};

watch(
  userDto,
  (newVal) => {
    if (!newVal) return;
    type.value = userDto.value.typeTenant;
  },
  {
    deep: true,
  },
);

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
                <div class="text-weight-light text-blue-grey-5">Tipo</div>
              </div>

              <div class="col-xs-12 col-sm-12">
                <q-select
                  outlined
                  v-model="userDto.typeTenant"
                  :options="[
                    {
                      label: 'Cliente',
                      value: TypeTenantEnum.CLIENT,
                    },
                    {
                      label: 'Vital',
                      value: TypeTenantEnum.VITAL,
                    },
                    {
                      label: 'Proveedor',
                      value: TypeTenantEnum.SUPPLIER,
                    },
                  ]"
                  emit-value
                  map-options
                  label="Tipo de Usuario"
                  :rules="[isRequired]"
                />
              </div>

              <div class="col-xs-12 col-sm-6">
                <SelectAutoComplete
                  outlined
                  clearable
                  :model-value="userDto.resourceId"
                  :label="'Donde Trabaja'"
                  :options="
                    userDto.typeTenant === TypeTenantEnum.SUPPLIER || type === TypeTenantEnum.VITAL
                      ? manufacturers
                      : erpClients
                  "
                  @selection="
                    userDto.resourceId =
                      typeof $event.value === 'number'
                        ? $event.value
                        : isNaN(Number($event.value))
                          ? undefined
                          : Number($event.value)
                  "
                  :rules="[isRequired]"
                >
                </SelectAutoComplete>
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-select
                  outlined
                  v-model="userDto.profileId"
                  :options="profilesByTenant"
                  emit-value
                  map-options
                  label="Perfil"
                  :rules="[isRequired]"
                />
              </div>

              <div class="col-12">
                <div class="text-weight-light text-blue-grey-5">Información de acceso</div>
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input
                  outlined
                  v-model="userDto.firstName"
                  label="Nombre"
                  :rules="[isRequired]"
                />
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input
                  outlined
                  v-model="userDto.lastName"
                  label="Apellido"
                  :rules="[isRequired]"
                />
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input
                  outlined
                  v-model="userDto.email"
                  label="Correo Electrónico"
                  :rules="[isRequired]"
                />
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input
                  outlined
                  v-model="userDto.password"
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

              <div
                class="col-12"
                v-if="[TypeTenantEnum.SUPPLIER].includes(userDto.typeTenant as TypeTenantEnum)"
              >
                <div class="text-weight-light text-blue-grey-5">Conexión con ERP</div>
              </div>

              <div class="col-xs-12" v-if="userDto.typeTenant === TypeTenantEnum.SUPPLIER">
                <SelectAutoComplete
                  outlined
                  clearable
                  :model-value="userDto.userErpCode"
                  :label="'Usuario de ERP'"
                  :options="erpSalespeople"
                  @selection="userDto.userErpCode = $event.value.toString()"
                  :rules="[isRequired]"
                >
                </SelectAutoComplete>
              </div>

              <div
                class="col-xs-12 row"
                v-if="
                  userCreatedResponse &&
                  (userCreatedResponse.user.profileId === UserProfileId.COLLECTIONS_ANALYST ||
                    userCreatedResponse.user.profileId === UserProfileId.COLLECTIONS_MANAGER ||
                    userCreatedResponse.user.profileId === UserProfileId.CUSTOMER ||
                    userCreatedResponse.user.profileId === UserProfileId.TELEOPERATOR_AGENT ||
                    userCreatedResponse.user.profileId === UserProfileId.TEST_CUSTOMER)
                "
              >
                <q-btn
                  class="col-12"
                  unelevated
                  color="primary"
                  outline
                  label="Definir Farmacias"
                  @click="openDefineCustomersDialog"
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
