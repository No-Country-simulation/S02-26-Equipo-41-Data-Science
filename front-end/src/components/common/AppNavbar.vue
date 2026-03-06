<template>
  <nav class="navbar-container mb-4">
    <!-- Logo y navegación principal -->
    <div class="flex items-center gap-8">
      <!-- Logo usando el componente AppLogo (igual que en login) -->
      <router-link to="/dashboard" class="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div class="flex flex-col gap-0.5">
          <!-- Componente AppLogo reutilizable -->
          <AppLogo size="md" :icon="logoIcon" />
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



    <div class="flex items-center gap-8">
      <div class="hidden lg:flex items-center gap-2 ml-6">
        <span class="text-xs font-bold text-gray-500 uppercase">Sucursal:</span>

        <select
          v-model="selectedSucursal"
          @change="changeSucursal"
          class="dark:bg-transparent border-gray-200 dark:border-gray-500 rounded-md text-sm px-3 py-1.5 font-medium"
        >
          <option
            v-for="sucursal in sucursalStore.sucursales"
            :key="sucursal.sucursalid"
            :value="sucursal.sucursalid"
            class="text-black"
          >
            {{ sucursal.nombresucursal }}
          </option>
        </select>
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
      </div>
    </div>
    
  </nav>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSucursalStore } from "@/stores/sucursal"
import AppLogo from '@/components/common/AppLogo.vue'

const props = defineProps({
  logoIcon: {
    type: String,
    default: 'analytics'
  },
  userLocation: {
    type: String,
    default: 'Lima Central'
  }
})

const sucursalStore = useSucursalStore()
const sucursales = []
const selectedSucursal = ref(null)
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

const loadSucursales = async () => {

  const { data, error } = await supabase
    .from("sucursales")
    .select("sucursalid, nombresucursal")

  if (error) {
    console.error(error)
    return
  }

  sucursalStore.setSucursales(data)

  // intentar recuperar de localStorage
  const savedSucursal = localStorage.getItem("sucursal_id")

  if (savedSucursal) {
    selectedSucursal.value = Number(savedSucursal)
  } else if (data.length > 0) {
    selectedSucursal.value = data[0].sucursalid
  }

  // actualizar store
  sucursalStore.setSucursal(selectedSucursal.value)
}

const changeSucursal = () => {
  sucursalStore.setSucursal(selectedSucursal.value)
  localStorage.setItem("sucursal_id", selectedSucursal.value)
}

onMounted(() => {
  loadSucursales()
})

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