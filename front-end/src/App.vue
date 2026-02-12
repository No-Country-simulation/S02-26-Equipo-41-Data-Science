<template>
  <router-view />
</template>

<script setup>
import { useDarkMode } from '@/composables/useDarkMode'

// Inicializar el modo oscuro
useDarkMode()
</script>