<template>
  <div>
    <AppNavbar
      :title="'Clientes'"
      :show-back-button="false"
      :show-search="true"
      @search="(query) => console.log('Buscar:', query)"/>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppNavbar from '@/components/common/AppNavbar.vue';
</script>