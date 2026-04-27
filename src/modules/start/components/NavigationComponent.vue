<script setup lang="ts">
import { computed, ref } from 'vue';
import EssentialLink, {
  type EssentialLinkProps,
} from 'src/modules/start/components/EssentialLink.vue';
import { OrdersRoutesEnum } from 'src/modules/orders/router';
import useAuth from 'src/modules/auth/composables/useAuth';
import { ZonesRoutesEnum } from 'src/modules/settings/zones/router';
import { UsersRoutesEnum } from 'src/modules/settings/users/router';

const { user, logout } = useAuth();

const handleLogout = async () => {
  await logout();
};

const userFullName = computed(() => user.value?.user.name || 'Usuario');
const userEmail = computed(() => user.value?.user.email || '');

// MODIFICADO: Lista de enlaces del menú principal (como en la maqueta)
const menuLinks: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    icon: 'sym_r_dashboard',
    link: '/home', // Ruta interna
  },
  {
    title: 'Órdenes',
    icon: 'sym_r_inventory_2',
    link: { name: OrdersRoutesEnum.OrderList }, // Listado de órdenes (ruta nombrada)
  },
  {
    title: 'Zonas',
    icon: 'sym_r_group',
    link: { name: ZonesRoutesEnum.ZONE_LIST },
  },
  {
    title: 'Usuarios',
    icon: 'sym_r_group',
    link: { name: UsersRoutesEnum.USER_LIST },
  },
];

// MODIFICADO: Lista de enlaces de recursos (como en la maqueta)
const resourceLinks: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'sym_r_book',
    link: 'https://quasar.dev',
    external: true, // Marcado como enlace externo
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'sym_r_code',
    link: 'https://github.com/quasarframework',
    external: true, // Marcado como enlace externo
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<template>
  <!--
    MODIFICADO: Header
    - 'elevated' para la sombra (shadow-lg de la maqueta)
    - 'bg-primary' es el azul que ya usabas
    - 'text-white'
  -->
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        class="menu-btn"
        @click="toggleLeftDrawer"
      />

      <!--
        MODIFICADO: Título con el estilo de la maqueta
      -->
      <q-toolbar-title class="text-weight-semibold" style="font-size: 1.25rem">
        Sistema de pedidos
      </q-toolbar-title>

      <!--
        AÑADIDO: Icono de notificación de la maqueta
      -->
      <q-btn flat round dense icon="sym_r_notifications" class="q-mr-sm">
        <q-badge color="red" floating transparent rounded> 1 </q-badge>
      </q-btn>

      <q-btn round flat class="avatar-btn">
        <q-avatar size="40px" class="user-avatar">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <q-menu anchor="bottom right" self="top right" :offset="[0, 8]">
          <q-card class="user-menu-card shadow-1">
            <q-card-section class="text-center q-pa-lg user-card-section">
              <q-avatar size="80px" class="q-mb-sm">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
              <div class="text-subtitle1 text-weight-semi-bold q-mb-xs">
                ¡Hola, {{ userFullName }}!
              </div>
              <div class="text-body2 text-grey-600">{{ userEmail }}</div>
            </q-card-section>

            <q-separator />

            <q-list class="q-py-sm">
              <q-item clickable v-ripple class="logout-item" @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="sym_r_logout" color="negative" size="20px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-body2">Cerrar sesión</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>

  <!--
    MODIFICADO: Drawer
    - 'bordered' para una línea sutil, como en la maqueta
    - :width="260"
  -->
  <q-drawer v-model="leftDrawerOpen" show-if-above :width="260" class="drawer-custom" bordered>
    <!--
      MODIFICADO: Contenido del menú lateral para coincidir con la maqueta
    -->
    <q-list class="q-pa-md q-pt-lg">
      <q-item-label
        header
        class="text-grey-6 text-uppercase text-weight-bold"
        style="font-size: 0.75rem"
      >
        Menú Principal
      </q-item-label>
      <EssentialLink v-for="link in menuLinks" :key="link.title" v-bind="link" />

      <q-separator class="q-my-md q-mt-lg" />

      <q-item-label
        header
        class="text-grey-6 text-uppercase text-weight-bold"
        style="font-size: 0.75rem"
      >
        Recursos
      </q-item-label>
      <EssentialLink v-for="link in resourceLinks" :key="link.title" v-bind="link" />
    </q-list>
  </q-drawer>
</template>

<!--
  MODIFICADO: SCSS limpiado
  - Eliminados los estilos complejos del logo
  - Eliminados los estilos del header (ahora usamos clases de Quasar)
  - Mantenidos los estilos del menú de usuario
-->
<style lang="scss" scoped>
// Header styles
.menu-btn {
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.avatar-btn {
  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.2);
}

// User menu card
.user-menu-card {
  min-width: 280px;
  border-radius: $rounded-borders;
  border: 1px solid $grey-200;
}

.user-card-section {
  background: linear-gradient(135deg, $primary-50 0%, $primary-100 100%);
}

.logout-item {
  border-radius: 8px;
  margin: 0 8px;

  &:hover {
    background-color: $grey-50;
  }
}
</style>
