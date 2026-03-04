<template>
  <div class="min-h-screen bg-[#f6f6f8] dark:bg-[#111621] flex">

    <!-- Sidebar -->
    <aside
      :class="[
        'min-h-screen bg-[#131d2e] text-white flex flex-col sticky top-0 shrink-0 z-50 transition-all duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-64'
      ]"
    >
      <div class="p-5">
        <!-- Toggle -->
        <div class="flex justify-end mb-4">
          <button
            class="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-all"
            @click="collapsed = !collapsed"
          >
            <span class="material-symbols-outlined">{{ collapsed ? 'menu' : 'menu_open' }}</span>
          </button>
        </div>

        <!-- Logo -->
        <div :class="['flex items-center gap-3 mb-10', collapsed ? 'justify-center' : '']">
          <div class="bg-primary text-white p-1.5 rounded-lg shrink-0">
            <span class="material-symbols-outlined text-2xl">database</span>
          </div>
          <Transition name="fade">
            <div v-if="!collapsed" class="flex flex-col overflow-hidden">
              <h1 class="text-xl font-bold tracking-tight text-white leading-none">DATAMARK</h1>
              <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider whitespace-nowrap">Tu negocio, bajo control</span>
            </div>
          </Transition>
        </div>

        <!-- Nav links -->
        <nav class="space-y-1">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'flex items-center gap-3 py-3 rounded-lg font-medium transition-all',
              collapsed ? 'justify-center px-3' : 'px-4',
              isActive(link.path)
                ? 'bg-primary text-white font-semibold shadow-lg shadow-primary/20'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            ]"
            :title="collapsed ? link.label : ''"
          >
            <span class="material-symbols-outlined shrink-0">{{ link.icon }}</span>
            <Transition name="fade">
              <span v-if="!collapsed" class="whitespace-nowrap overflow-hidden">{{ link.label }}</span>
            </Transition>
          </router-link>
        </nav>
      </div>

      <!-- Footer plan -->
      <div class="mt-auto p-5">
        <Transition name="fade">
          <div v-if="!collapsed" class="p-4 bg-white/5 rounded-xl border border-white/10">
            <p class="text-xs font-bold text-slate-400 uppercase mb-2">Plan Actual</p>
            <p class="text-sm font-bold text-white mb-1">Premium Pro</p>
            <div class="w-full bg-white/10 rounded-full h-1.5 mb-2">
              <div class="bg-primary h-1.5 rounded-full w-3/4"></div>
            </div>
            <p class="text-[10px] text-slate-500">75% del límite de uso mensual</p>
          </div>
        </Transition>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- Top Header -->
      <header class="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="px-6">
          <div class="flex justify-between items-center h-16">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest hidden lg:block">
              {{ currentPageTitle }}
            </span>
            <div class="flex items-center gap-4">
              <button class="p-2 text-slate-400 hover:text-primary transition-colors relative">
                <span class="material-symbols-outlined">notifications</span>
                <span class="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              <div class="h-8 w-[1px] bg-slate-200 mx-1"></div>
              <div class="flex items-center gap-3 cursor-pointer group">
                <div class="text-right hidden sm:block">
                  <p class="text-sm font-semibold text-slate-900 leading-none group-hover:text-primary transition-colors">Admin Local</p>
                  <p class="text-xs text-slate-500 mt-1">Sede Lima Norte</p>
                </div>
                <div class="size-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-sm">
                  <span class="text-primary font-bold text-sm">AL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Routed page content -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="px-6 py-6 border-t border-slate-200 bg-white">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-xs text-slate-400 font-medium">© 2024 DATAMARK Perú. Todos los derechos reservados.</p>
          <div class="flex gap-6">
            <a class="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Soporte Técnico</a>
            <a class="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Configuración</a>
            <a class="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Cerrar Sesión</a>
          </div>
        </div>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const collapsed = ref(false)

const navLinks = [
  { path: '/dashboard',           label: 'Dashboard',  icon: 'dashboard'    },
  { path: '/dashboard/inventario',label: 'Inventario', icon: 'inventory_2'  },
  { path: '/dashboard/ventas',    label: 'Ventas',     icon: 'receipt_long' },
  { path: '/dashboard/clientes',  label: 'Clientes',   icon: 'group'        }
]

const pageTitles = {
  '/dashboard':            'Panel de Control',
  '/dashboard/inventario': 'Gestión de Inventario',
  '/dashboard/ventas':     'Gestión de Ventas',
  '/dashboard/clientes':   'Gestión de Clientes'
}

const currentPageTitle = computed(() => pageTitles[route.path] || 'Panel de Control')

const isActive = (path) => {
  if (path === '/dashboard' && route.path === '/dashboard') return true
  if (path !== '/dashboard' && route.path.startsWith(path)) return true
  return false
}
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

/* Tailwind primary color as CSS var for shadow */
.shadow-primary\/20 {
  --tw-shadow-color: rgba(26, 89, 213, 0.2);
}
</style>
