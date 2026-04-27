<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { QForm } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import useValidators from 'src/modules/shared/composables/useValidators';
import useDropDown from 'src/modules/shared/composables/useDropDowns';
import HorizontalConfigCard from '../components/HorizontalConfigCard.vue';
import useDataUserQuery from '../composables/useDataUserQuery';
import useUpdateUserMutation from '../composables/useUpdateUserMutation';
import type { UpdateUserDto } from '../interfaces/CreateUserDto';
import { UsersRoutesEnum } from '../router';

const route = useRoute();
const userId = route.params.id as string;
const { userDetail } = useDataUserQuery(Number(userId));

const { profiles } = useDropDown('profiles');
const { isRequired, isPassword } = useValidators();
const { updateUserDto, updateUserMutation, resetDto } = useUpdateUserMutation();

const router = useRouter();

const viewUserList = async () => {
  await router.push({ name: UsersRoutesEnum.USER_LIST });
};

const myForm = ref<QForm>();
const isPwd = ref(true);

const onSubmit = async () => {
  if (!(await myForm.value?.validate())) return;
  const payload: UpdateUserDto = {};
  const dto = updateUserDto.value;
  const detail = userDetail.value;
  if (dto.name !== undefined && dto.name !== detail?.name) payload.name = dto.name;
  if (dto.lastName !== undefined && dto.lastName !== detail?.lastName)
    payload.lastName = dto.lastName;
  if (dto.email !== undefined && dto.email !== detail?.email) payload.email = dto.email;
  if (dto.profileId !== undefined && dto.profileId !== detail?.Profile?.id)
    payload.profileId = dto.profileId;
  if (dto.password) payload.password = dto.password;
  await updateUserMutation.mutateAsync({ id: Number(userId), payload });
};

watch(
  userDetail,
  (newVal) => {
    if (!newVal) return;
    updateUserDto.value = {
      name: newVal.name,
      lastName: newVal.lastName,
      email: newVal.email,
      profileId: newVal.Profile?.id,
    };
  },
  { deep: true, immediate: true },
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
      <h2 class="q-my-none">Editar usuario</h2>
    </div>
    <p class="text-blue-grey-5">Edite la información del usuario.</p>

    <q-form ref="myForm" @submit="onSubmit">
      <div class="shadow-card rounded-borders">
        <HorizontalConfigCard flat class="q-pa-md q-mt-md">
          <template v-slot:left>
            <div class="text-h6">Datos básicos</div>
            <div class="text-weight-light text-blue-grey-5">
              Indique la información básica del usuario que desea editar.
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
                  v-model="updateUserDto.name"
                  label="Nombre"
                  :rules="[isRequired]"
                />
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input
                  outlined
                  v-model="updateUserDto.lastName"
                  label="Apellido"
                  :rules="[isRequired]"
                />
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input
                  outlined
                  v-model="updateUserDto.email"
                  label="Correo Electrónico"
                  :rules="[isRequired]"
                />
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input
                  outlined
                  v-model="updateUserDto.password"
                  label="Contraseña (opcional)"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="updateUserDto.password ? [isPassword] : []"
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
                  v-model="updateUserDto.profileId"
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
