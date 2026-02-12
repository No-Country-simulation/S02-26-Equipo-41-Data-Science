<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <div class="container-center py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="title-section">Dashboard</h1>
          <p class="subtitle-section">Bienvenido de nuevo, {{ currentUser?.name }}</p>
        </div>
        <BaseButton variant="secondary" @click="handleLogout">
          Cerrar Sesión
        </BaseButton>
      </div>

      <div class="card">
        <h2 class="text-xl font-bold mb-4">Vista en desarrollo</h2>
        <p class="text-text-secondary">
          Esta vista será implementada con el dashboard completo.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>