<script setup lang="ts">
import { ref } from 'vue';
import HorizontalConfigCard from 'src/modules/settings/users/components/HorizontalConfigCard.vue';
import useValidators from 'src/modules/shared/composables/useValidators';
import ADialog from '../components/ADialog.vue';
import { Dialog } from 'quasar';

interface Order {
  orderNumber: string;
  totalUnits: number;
  totalParts: number;
  zoneId: number;
}

const form = ref<Order>({
  orderNumber: '',
  totalParts: 0,
  totalUnits: 0,
  zoneId: 0,
});

const openSelectPickersDialog = () => {
  Dialog.create({ component: ADialog });
};

const { isRequired, isNumber } = useValidators();
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
        />
      </div>
      <h2 class="q-my-none">Crear pedido</h2>
    </div>
    <p class="text-blue-grey-5">Cree un nuevo pedido.</p>

    <div class="shadow-card rounded-borders">
      <HorizontalConfigCard flat class="q-pa-md q-mt-md">
        <template v-slot:left>
          <div class="text-h6">Datos básicos</div>
          <div class="text-weight-light text-blue-grey-5">
            Indique la información básica del pedido que desea crear.
          </div>
        </template>

        <template v-slot:right>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-weight-light text-blue-grey-5">Tipo</div>
            </div>

            <div class="col-xs-12 col-sm-12">
              <q-input
                outlined
                v-model="form.orderNumber"
                label="Numero de pedido"
                :rules="[isRequired]"
              />
            </div>

            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="form.totalUnits"
                label="Unidades"
                :rules="[isRequired, isNumber]"
              />
            </div>

            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="form.totalParts"
                label="partes"
                :rules="[isRequired, isNumber]"
              />
            </div>

            <div class="col-12">
              <div class="text-weight-light text-blue-grey-5">Información de acceso</div>
            </div>

            <div class="col-xs-12 col-sm-6">
              <q-select
                outlined
                v-model="form.zoneId"
                :options="[
                  {
                    label: 'Maturin',
                    value: 1,
                  },
                  {
                    label: 'Caripe',
                    value: 2,
                  },
                ]"
              ></q-select>
            </div>

            <div class="col-xs-12 col-sm-6"></div>

            <div class="col-xs-12 col-sm-6"></div>

            <div class="col-xs-12 col-sm-6"></div>

            <div class="col-12 text-right">
              <q-btn
                unelevated
                color="primary"
                label="Continuar"
                @click="openSelectPickersDialog"
              />
            </div>
          </div>
        </template>
      </HorizontalConfigCard>

      <q-btn unelevated color="primary" label="Continuar" @click="openSelectPickersDialog" />
    </div>
  </q-page>
</template>

<style scoped></style>
