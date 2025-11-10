<script setup lang="ts">
import Navigation from 'src/modules/start/components/NavigationComponent.vue';
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <Navigation />

    <!--
      AÑADIDO: 'class="bg-grey-1"'
      Esto le da al fondo del contenedor de la página
      el color gris claro de la maqueta.
    -->
    <q-page-container class="bg-grey-1">
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>
