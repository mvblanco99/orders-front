<template>
  <!--
    MODIFICADO:
    - Añadido 'exact-active-class' para el estilo activo.
    - Usamos 'to' para rutas internas (como '/home') y 'href' para externas.
    - Añadida clase 'nav-link-item' para el hover.
  -->
  <q-item
    clickable
    tag="a"
    :to="!external ? link : undefined"
    :href="external && typeof link === 'string' ? link : undefined"
    :target="external ? '_blank' : undefined"
    exact-active-class="active-link"
    class="nav-link-item"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  // `link` puede ser una string (path) o un objeto de ruta nombrada (RouteLocationRaw)
  link?: string | RouteLocationRaw;
  icon?: string;
  external?: boolean; // Añadido para diferenciar enlaces internos/externos
}

withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
  external: false, // Valor por defecto
});
</script>

<!--
  AÑADIDO: Estilos para el enlace activo y hover, como en la maqueta.
-->
<style lang="scss" scoped>
.nav-link-item {
  border-radius: 8px;
  font-weight: 500;
  color: $grey-8;
  margin-bottom: 4px; // Añade un poco de espacio

  &:hover {
    background-color: $grey-2;
    color: $grey-10;
  }
}

.active-link {
  background-color: $blue-1;
  color: $primary;
  font-weight: 600;

  .q-icon {
    color: $primary;
  }
}
</style>
