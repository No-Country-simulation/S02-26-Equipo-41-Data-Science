<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
  
    <router-view v-slot="{ Component, route }">
      <transition name="fade-slide" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>

    <div class="fixed top-6 right-6 z-100">
       <ThemeToggle /> 
    </div>
  </div>
</template>

<script setup>
import { useDarkMode } from '@/composables/useDarkMode';
import ThemeToggle from '@/components/common/ThemeToggle.vue';

// Inicializar el modo oscuro
useDarkMode()
</script>