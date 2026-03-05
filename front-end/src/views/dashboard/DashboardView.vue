<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark flex">

    <!-- Sidebar -->
    <aside
      :class="['min-h-screen bg-[#131d2e] text-white flex flex-col sticky top-0 shrink-0 z-50 transition-all duration-300', sidebarCollapsed ? 'w-20' : 'w-64']"
    >
      <div class="p-6">
        <!-- Toggle -->
        <div class="flex justify-end mb-4">
          <button
            class="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-all"
            @click="sidebarCollapsed = !sidebarCollapsed"
          >
            <span class="material-symbols-outlined">menu_open</span>
          </button>
        </div>

        <!-- Logo -->
        <div
          :class="['flex items-center gap-3 mb-10', sidebarCollapsed ? 'justify-center' : '']"
        >
          <div class="bg-primary text-white p-1.5 rounded-lg shrink-0">
            <span class="material-symbols-outlined text-2xl">database</span>
          </div>
          <div v-if="!sidebarCollapsed" class="flex flex-col">
            <h1 class="text-xl font-bold tracking-tight text-white leading-none">DATAMARK</h1>
            <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Tu negocio, bajo control</span>
          </div>
        </div>

        <!-- Nav links -->
        <nav class="space-y-2">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'flex items-center gap-3 py-3 rounded-lg font-medium transition-all',
              sidebarCollapsed ? 'justify-center px-0' : 'px-4',
              isActive(link.path)
                ? 'bg-primary text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            ]"
          >
            <span class="material-symbols-outlined shrink-0">{{ link.icon }}</span>
            <span v-if="!sidebarCollapsed">{{ link.label }}</span>
          </router-link>
        </nav>
      </div>

      <!-- Footer plan -->
      <div class="mt-auto p-6">
        <div
          v-if="!sidebarCollapsed"
          class="p-4 bg-white/5 rounded-xl border border-white/10"
        >
          <p class="text-xs font-bold text-slate-400 uppercase mb-2">Plan Actual</p>
          <p class="text-sm font-bold text-white mb-1">Premium Pro</p>
          <div class="w-full bg-white/10 rounded-full h-1.5 mb-2">
            <div class="bg-primary h-1.5 rounded-full w-3/4"></div>
          </div>
          <p class="text-[10px] text-slate-500">75% del límite de uso mensual</p>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- Top Header -->
      <header class="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest hidden lg:block">
              Panel de Control
            </span>
            <div class="flex items-center gap-4">
              <button class="p-2 text-slate-400 hover:text-primary transition-colors relative">
                <span class="material-symbols-outlined">notifications</span>
                <span class="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              <div class="h-8 w-[1px] bg-slate-200 mx-2"></div>
              <div class="flex items-center gap-3 cursor-pointer group">
                <div class="text-right hidden sm:block">
                  <p class="text-sm font-semibold text-slate-900 leading-none group-hover:text-primary transition-colors">
                    Admin Local
                  </p>
                  <p class="text-xs text-slate-500 mt-1">Sede Lima Norte</p>
                </div>
                <div class="size-10 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center shadow-sm">
                  <span class="text-primary font-bold text-sm">AL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Page title -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-slate-900">Resumen General</h2>
          <p class="text-slate-500 text-sm">Bienvenido de nuevo. Aquí tienes el estado de tu tienda hoy.</p>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <KpiCard
            label="Ventas del Día"
            value="S/ 1,250.00"
            :trend="12.5"
            trend-label="vs ayer"
          />
          <KpiCard
            label="Ventas del Mes"
            value="S/ 24,800"
            subtext="Meta mensual: 85% alcanzada"
          />
          <KpiCard
            label="Unidades (Mes)"
            value="412 units"
            subtext="Ticket promedio: S/ 60.20"
          />
          <KpiCard
            label="Stock Total"
            value="1,480 items"
            subtext="Actualizado hace 5 min"
          />
          <KpiCard
            variant="danger"
            label="Bajo Stock"
            value="12 items"
            action-label="Ver lista urgente"
            bg-icon="inventory_2"
            @action="handleLowStockAction"
          />
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          <!-- Sales Trend Chart -->
          <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-slate-900">Ventas (Últimos 7 días)</h3>
                <p class="text-sm text-slate-500">Tendencia de ingresos semanales</p>
              </div>
              <select class="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-primary focus:border-primary outline-none">
                <option>Esta semana</option>
                <option>Semana pasada</option>
              </select>
            </div>
            <div class="h-[280px] w-full flex flex-col justify-end">
              <div class="relative flex-1 flex items-end gap-2 px-2">
                <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="sales-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stop-color="#1a59d5" />
                      <stop offset="100%" stop-color="white" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,80 Q15,40 30,60 T60,20 T90,30 T100,10 L100,100 L0,100 Z"
                    fill="url(#sales-gradient)"
                    opacity="0.1"
                  />
                  <path
                    d="M0,80 Q15,40 30,60 T60,20 T90,30 T100,10"
                    fill="none"
                    stroke="#1a59d5"
                    stroke-width="3"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <div class="flex justify-between mt-4 px-2 border-t border-slate-50 pt-2">
                <span v-for="day in weekDays" :key="day" class="text-[10px] font-bold text-slate-400 uppercase">
                  {{ day }}
                </span>
              </div>
            </div>
          </div>

          <!-- Inventory Donut Chart -->
          <div class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 class="text-lg font-bold text-slate-900 mb-1">Distribución de Inventario</h3>
            <p class="text-sm text-slate-500 mb-8">Ropa vs Calzado</p>
            <div class="flex flex-col items-center">
              <div class="relative size-48">
                <svg class="size-full" viewBox="0 0 36 36">
                  <circle
                    cx="18" cy="18" r="16"
                    fill="none"
                    class="stroke-slate-100"
                    stroke-width="4"
                  />
                  <circle
                    cx="18" cy="18" r="16"
                    fill="none"
                    class="stroke-primary"
                    stroke-dasharray="70 100"
                    stroke-linecap="round"
                    stroke-width="4"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-3xl font-bold text-slate-900">70%</span>
                  <span class="text-[10px] font-bold text-slate-400 uppercase">Calzado</span>
                </div>
              </div>
              <div class="mt-8 w-full space-y-3">
                <div
                  v-for="item in inventoryDistribution"
                  :key="item.label"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <div :class="['size-3 rounded-full', item.colorClass]"></div>
                    <span class="text-sm font-medium text-slate-600">{{ item.label }}</span>
                  </div>
                  <span class="text-sm font-bold text-slate-900">{{ item.units }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stock por Categorías -->
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-900">Stock por Categorías Principales</h3>
          <button class="text-primary text-sm font-bold hover:underline">
            Ver inventario completo
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CategoryCard
            v-for="cat in categories"
            :key="cat.label"
            :label="cat.label"
            :value="cat.value"
            :icon="cat.icon"
            @click="handleCategoryClick(cat)"
          />
        </div>
      </main>

      <!-- Footer -->
      <footer class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10 border-t border-slate-200">
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
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import KpiCard from '@/components/common/KpiCard.vue'
import CategoryCard from '@/components/common/CategoryCard.vue'

const route = useRoute()
const sidebarCollapsed = ref(false)

// Sidebar navigation links
const navLinks = [
  { path: '/',           label: 'Dashboard',  icon: 'dashboard'     },
  { path: '/inventario', label: 'Inventario', icon: 'inventory_2'   },
  { path: '/ventas',     label: 'Ventas',     icon: 'receipt_long'  },
  { path: '/clientes',   label: 'Clientes',   icon: 'group'         }
]

const isActive = (path) => {
  if (path === '/' && route.path === '/') return true
  if (path !== '/' && route.path.startsWith(path)) return true
  return false
}

// Chart data
const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const inventoryDistribution = [
  { label: 'Calzado', units: '1,036 uni.', colorClass: 'bg-primary' },
  { label: 'Ropa',    units: '444 uni.',   colorClass: 'bg-slate-200' }
]

// Category cards data
const categories = [
  { label: 'Polos',          value: '240 uni.',  icon: 'checkroom'  },
  { label: 'Pantalones',     value: '185 uni.',  icon: 'straighten' },
  { label: 'Calzado Urbano', value: '320 uni.',  icon: 'steps'      },
  { label: 'Botas',          value: '95 uni.',   icon: 'hiking'     }
]

// Handlers
const handleLowStockAction = () => {
  // Navegar a vista de bajo stock o abrir modal
  console.log('Ver lista de bajo stock')
}

const handleCategoryClick = (cat) => {
  // Navegar a inventario filtrado por categoría
  console.log('Categoría seleccionada:', cat.label)
}
</script>
