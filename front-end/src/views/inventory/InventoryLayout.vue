<template>
    <AppNavbar
      :title="'Inventario'"
      :show-back-button="false"
      :show-search="true"
      @search="(query) => console.log('Buscar:', query)"/>
    
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
</template>

<script setup>
import AppNavbar from '@/components/common/AppNavbar.vue';


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>