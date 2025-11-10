<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { Dialog, QForm } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import useValidators from 'src/modules/shared/composables/useValidators';
import useDropDownByType from 'src/modules/shared/composables/useDropDownsByType';
import useDropDown from 'src/modules/shared/composables/useDropDowns';
import useDataUserQuery from '../composables/useDataUserQuery';
import DefineCustomersDialog from '../components/DefineCustomersDialog.vue';
import { TypeTenantEnum, UserProfileId } from '../interfaces/userInterface';
import HorizontalConfigCard from '../components/HorizontalConfigCard.vue';
import useUpdateUserMutation from '../composables/useUpdateUserMutation';
import { UsersRoutesEnum } from '../router';

const route = useRoute();
const userId = route.params.id as string;
const { userDetail } = useDataUserQuery(Number(userId));

const { manufacturers } = useDropDown('manufacturers');
const { erpClients } = useDropDown('erp_clients');
const { erpSalespeople } = useDropDown('erp_salespeople');
const { profilesByTenant, type } = useDropDownByType('profiles-by-tenant');

const { isRequired, isPassword } = useValidators();
const { userDto, updateUserMutation, resetDto } = useUpdateUserMutation();

const router = useRouter();

const viewUserList = async () => {
  await router.push({ name: UsersRoutesEnum.USER_LIST });
};

const myForm = ref<QForm>();
const isPwd = ref(true);

const onSubmit = async () => {
  if (!(await myForm.value?.validate())) return;
  await updateUserMutation.mutateAsync({
    id: Number(userId),
    payload: {
      firstName: userDto.value.firstName,
      lastName: userDto.value.lastName,
      email: userDto.value.email,
      password: userDto.value.password ? userDto.value.password : undefined,
      profileId:
        userDto.value.profileId !== userDetail.value?.profileId
          ? userDto.value.profileId
          : undefined,
      userErpCode: userDto.value.userErpCode,
    },
  });
};

const openDefineCustomersDialog = () => {
  Dialog.create({
    component: DefineCustomersDialog,
    componentProps: {
      userId:
        userDetail.value?.tenantType === 'CLIENT'
          ? userDetail.value.id
          : userDetail.value?.relationId,
      name: `${userDetail.value?.firstName} ${userDetail.value?.lastName}`,
      profile: userDetail.value?.profileId,
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

watch(
  userDetail,
  (newVal) => {
    if (!newVal) return;

    userDto.value.typeTenant = newVal.tenantType as TypeTenantEnum;
    userDto.value.resourceId = newVal.tenantResourceId;
    userDto.value.profileId = newVal.profileId;
    userDto.value.email = newVal.email;
    userDto.value.firstName = newVal.firstName;
    userDto.value.lastName = newVal.lastName;
    userDto.value.userErpCode = newVal.erp_salespeopleId as string;
  },
  {
    deep: true,
    immediate: true,
  },
);

const passwordRule = (val: string) => {
  if (!val || val.length === 0) return false; // Allow empty password (not required on edit)
  return true;
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
      <h2 class="q-my-none">Editar usuario</h2>
    </div>
    <p class="text-blue-grey-5">Edite un usuario nuevo para su aplicación.</p>

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
                  :disable="true"
                />
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-select
                  outlined
                  v-model="userDto.resourceId"
                  :options="
                    userDto.typeTenant === TypeTenantEnum.SUPPLIER || type === TypeTenantEnum.VITAL
                      ? manufacturers
                      : erpClients
                  "
                  emit-value
                  map-options
                  label="Donde Trabaja"
                  :rules="[isRequired]"
                  :disable="true"
                />
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
                  :rules="passwordRule(userDto.password!) ? [isPassword] : []"
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
                <q-select
                  outlined
                  v-model="userDto.userErpCode"
                  :options="erpSalespeople"
                  emit-value
                  map-options
                  label="Usuario de ERP"
                  :rules="[isRequired]"
                />
              </div>

              <div
                class="col-xs-12 row"
                v-if="
                  userDetail &&
                  (userDetail.profileId === UserProfileId.COLLECTIONS_ANALYST ||
                    userDetail.profileId === UserProfileId.COLLECTIONS_MANAGER ||
                    userDetail.profileId === UserProfileId.CUSTOMER ||
                    userDetail.profileId === UserProfileId.TELEOPERATOR_AGENT ||
                    userDetail.profileId === UserProfileId.TEST_CUSTOMER)
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
