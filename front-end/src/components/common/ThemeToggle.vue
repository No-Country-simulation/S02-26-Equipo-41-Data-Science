<template>
  <button
    class="p-3 bg-white dark:bg-gray-800 shadow-xl rounded-full text-text-primary dark:text-white border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform duration-200"
    @click="toggleDark"
    :title="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
  >
    <span class="material-symbols-outlined block dark:hidden icon-md">
      dark_mode
    </span>
    <span class="material-symbols-outlined hidden dark:block icon-md">
      light_mode
    </span>
  </button>
</template>

<script setup>
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggleDark } = useDarkMode()
</script>