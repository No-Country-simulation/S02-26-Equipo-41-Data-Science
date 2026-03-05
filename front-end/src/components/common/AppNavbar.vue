<template>
  <nav class="navbar-container mb-4">
    <!-- Logo y navegación principal -->
    <div class="flex items-center gap-8">
      <!-- Logo usando el componente AppLogo (igual que en login) -->
      <router-link to="/" class="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div class="flex flex-col gap-0.5">
          <!-- Componente AppLogo reutilizable -->
          <AppLogo size="sm" :icon="logoIcon" />
          <!-- Subtítulo -->
          <p class="navbar-subtitle">{{ subtitle }}</p>
        </div>
      </router-link>

      <!-- Links de navegación - Desktop -->
      <div class="hidden md:flex items-center gap-6 ml-4">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          :class="[
            'navbar-link',
            isActiveRoute(link.path) ? 'navbar-link-active' : ''
          ]"
        >
          {{ link.label }}
        </router-link>
      </div>
    </div>

    <!-- Acciones y perfil de usuario -->
    <div class="flex items-center gap-4">
      <!-- Botón de cerrar sesión -->
      <button
        @click="handleLogout"
        class="navbar-logout-btn"
        title="Cerrar sesión"
      >
        <span class="material-symbols-outlined text-lg">logout</span>
        <span class="hidden lg:inline">Cerrar Sesión</span>
      </button>

      <!-- Divisor -->
      <div class="navbar-divider"></div>

      <!-- Perfil de usuario -->
      <div class="flex items-center gap-3 pl-2">
        <div class="flex flex-col items-end">
          <span class="navbar-user-name">{{ userName }}</span>
          <span class="navbar-user-location">{{ userLocation }}</span>
        </div>
        <div class="navbar-avatar" :title="userName">
          {{ userInitials }}
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLogo from '@/components/common/AppLogo.vue'

const props = defineProps({
  subtitle: {
    type: String,
    default: 'Gestión de Inventario'
  },
  logoIcon: {
    type: String,
    default: 'analytics'
  },
  userLocation: {
    type: String,
    default: 'Lima Central'
  }
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Links de navegación
const navLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/inventario', label: 'Inventario' },
  { path: '/ventas', label: 'Ventas' },
  { path: '/clientes', label: 'Clientes' }
]

// Datos del usuario
const userName = computed(() => {
  return authStore.currentUser?.name || 'Admin Datamark'
})

const userInitials = computed(() => {
  const name = userName.value
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

// Verificar si la ruta está activa
const isActiveRoute = (path) => {
  // Coincidencia exacta para home
  if (path === '/' && route.path === '/') return true
  // Coincidencia parcial para otras rutas
  if (path !== '/' && route.path.startsWith(path)) return true
  return false
}

// Manejar logout
const handleLogout = () => {
  if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
    authStore.logout()
    router.push({ name: 'login' })
  }
}
</script>

<style scoped>
/* Contenedor principal del navbar */
.navbar-container {
  @apply h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 flex-shrink-0 z-50;
}

/* Subtítulo debajo del logo */
.navbar-subtitle {
  @apply text-text-secondary dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider pl-0.5;
}

/* Links de navegación */
.navbar-link {
  @apply text-sm font-bold text-gray-500 hover:text-primary transition-colors relative;
}

.navbar-link-active {
  @apply text-primary;
}

.navbar-link-active::after {
  content: '';
  @apply absolute bottom-[-22px] left-0 right-0 h-[3px] bg-primary rounded-full;
}

/* Botón de logout */
.navbar-logout-btn {
  @apply flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors mr-4 cursor-pointer;
}

/* Divisor */
.navbar-divider {
  @apply h-8 w-px bg-gray-200 dark:bg-gray-800;
}

/* Perfil de usuario */
.navbar-user-name {
  @apply text-sm font-bold text-gray-900 dark:text-white leading-none;
}

.navbar-user-location {
  @apply text-[10px] text-gray-500 font-medium;
}

.navbar-avatar {
  @apply size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold cursor-pointer hover:bg-primary/20 transition-colors;
}
</style>