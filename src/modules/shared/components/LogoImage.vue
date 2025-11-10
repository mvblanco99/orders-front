<script setup lang="ts">
import useUi from '../../start/composables/useUi';
const { isDarkMode } = useUi();
</script>

<template>
  <q-img
    :src="`/images/logos/logo_vital_clinic_${isDarkMode ? 'dark' : 'light'}.png`"
    style="max-width: 180px"
    no-spinner
    fetchpriority="high"
  />
</template>
