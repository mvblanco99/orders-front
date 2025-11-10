<script lang="ts" setup>
import { computed } from 'vue';
import { useAuthStore } from 'src/modules/auth/stores/useAuthStore';
// ELIMINADOS: CardInfoAmounts y TitlesComponent ya que no se usarán

const authStore = useAuthStore();
const userName = computed(() => authStore.user?.user.name || 'Usuario');
</script>

<template>
  <!--
    MODIFICADO: Padding de la página para coincidir con la maqueta
  -->
  <q-page class="q-pa-md q-pa-lg-xl">
    <!--
      MODIFICADO: Reemplazado TitlesComponent
      para usar el estilo de la maqueta directamente
    -->
    <div class="q-mb-md">
      <h1 class="text-h4 text-weight-bold text-grey-9 q-my-none">Dashboard</h1>
      <p class="text-grey-7 text-body1 q-mt-sm">Resumen de la actividad reciente</p>
    </div>

    <!--
      MODIFICADO: Saludo, con el estilo de la maqueta
    -->
    <div class="q-mb-lg bg-white q-pa-md rounded-borders shadow-1">
      <h5 class="text-weight-medium q-my-none">¡Bienvenido de nuevo, {{ userName }}! 👋</h5>
      <p class="text-grey-8">Aquí tienes un resumen de tus pedidos.</p>
    </div>

    <!--
      MODIFICADO: Tarjetas de estadísticas
      - Reemplazado CardInfoAmounts por q-card para que coincida con la maqueta
    -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Card: Pedidos Pendientes -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-2" style="border-radius: 12px">
          <q-card-section class="flex items-center q-gutter-md">
            <q-avatar
              size="xl"
              rounded
              color="yellow-1"
              text-color="yellow-8"
              icon="sym_r_pending_actions"
            />
            <div>
              <div class="text-sm text-weight-medium text-grey-6">Pedidos Pendientes</div>
              <div class="text-h4 text-weight-bold text-grey-9">12</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Card: Pedidos Completados -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-2" style="border-radius: 12px">
          <q-card-section class="flex items-center q-gutter-md">
            <q-avatar
              size="xl"
              rounded
              color="green-1"
              text-color="green-7"
              icon="sym_r_task_alt"
            />
            <div>
              <div class="text-sm text-weight-medium text-grey-6">Pedidos Completados</div>
              <div class="text-h4 text-weight-bold text-grey-9">85</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Card: Total de Ventas -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-2" style="border-radius: 12px">
          <q-card-section class="flex items-center q-gutter-md">
            <q-avatar
              size="xl"
              rounded
              color="blue-1"
              text-color="primary"
              icon="sym_r_attach_money"
            />
            <div>
              <div class="text-sm text-weight-medium text-grey-6">Total de Ventas</div>
              <div class="text-h4 text-weight-bold text-grey-9">$2,500.00</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!--
      MODIFICADO: Sección de Actividad Reciente
      - Añadido un título h2
      - Añadido shadow-1 a la tarjeta
    -->
    <div class="row q-mt-lg">
      <div class="col-12">
        <h2 class="text-h5 text-weight-semibold text-grey-8 q-mb-md">Actividad Reciente</h2>
        <q-card class="shadow-1">
          <q-card-section class="q-pt-none">
            <q-timeline color="secondary" class="q-pt-md">
              <q-timeline-entry title="Nuevo pedido" subtitle="Hace 2 minutos" icon="receipt_long">
                <div>Se ha recibido un nuevo pedido (#12345) por un total de $50.00.</div>
              </q-timeline-entry>

              <q-timeline-entry title="Pedido completado" subtitle="Hace 1 hora" icon="check">
                <div>El pedido #12344 ha sido marcado como completado.</div>
              </q-timeline-entry>

              <q-timeline-entry
                title="Nuevo cliente registrado"
                subtitle="Hace 3 horas"
                icon="person_add"
              >
                <div>Juan Pérez se ha registrado como nuevo cliente.</div>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.text-weight-medium {
  font-weight: 500;
}
</style>
