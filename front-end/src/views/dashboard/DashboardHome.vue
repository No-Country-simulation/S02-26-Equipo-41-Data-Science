<template>
  <div>
    <div class="px-6 py-8 max-w-7xl mx-auto w-full">

      <!-- Page header -->
      <div class="mb-8">
        <h1 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Resumen General</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Bienvenido de nuevo. Aquí tienes el estado de tu tienda hoy.</p>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KpiCard label="Ventas del Día"  value="S/ 1,250.00" :trend="12.5"  trend-label="vs ayer" />
        <KpiCard label="Ventas del Mes" value="S/ 24,800"   subtext="Meta mensual: 85% alcanzada" />
        <KpiCard label="Unidades (Mes)" value="412 uni."    subtext="Ticket promedio: S/ 60.20" />
        <KpiCard label="Stock Total"    value="1,480 items" subtext="Actualizado hace 5 min" />
        <KpiCard
          variant="danger" label="Bajo Stock" value="12 items"
          action-label="Ver lista urgente" bg-icon="inventory_2"
          @action="() => $router.push('/dashboard/inventario')"
        />
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        <!-- Sales trend -->
        <div class="lg:col-span-2 bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-100 dark:border-slate-400 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Ventas (Últimos 7 días)</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">Tendencia de ingresos semanales</p>
            </div>
            <select class="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5 outline-none text-slate-600">
              <option>Esta semana</option>
              <option>Semana pasada</option>
            </select>
          </div>
          <BaseLineChart :labels="sales.map(v => v.fecha)" :data="sales.map(v => v.monto)" title="Ventas" height="250" />
        </div>

        <!-- Inventory donut -->
        <div class="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-100 dark:border-slate-400 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Distribución de Inventario</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Ropa vs Calzado</p>
          <div class="flex flex-col items-center">
            <DonutChart :percentage="70" label="Calzado" />
            <div class="mt-6 w-full space-y-3">
              <div v-for="item in inventoryDist" :key="item.label" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div :class="['size-3 rounded-full', item.color]"></div>
                  <span class="text-sm font-medium text-slate-600 dark:text-slate-300">{{ item.label }}</span>
                </div>
                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ item.units }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category cards -->
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Stock por Categorías Principales</h3>
        <button class="text-primary text-sm font-bold hover:underline" @click="$router.push('/dashboard/inventario')">
          Ver inventario completo
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CategoryCard v-for="cat in categories" :key="cat.label"
          :label="cat.label" :value="cat.value" :icon="cat.icon" />
      </div>

    </div>
  </div>
</template>

<script setup>
import KpiCard       from '@/components/common/KpiCard.vue'
import CategoryCard  from '@/components/common/CategoryCard.vue'
import DonutChart    from '@/components/common/DonutChart.vue'
import BaseLineChart from '@/components/common/BaseLineChart.vue'

const sales = [
  { fecha: "2026-03-01", monto: 120000 },
  { fecha: "2026-03-02", monto: 95000 },
  { fecha: "2026-03-03", monto: 132000 },
  { fecha: "2026-03-04", monto: 110000 },
  { fecha: "2026-03-05", monto: 145000 }
]

console.log("Sales data:", sales.map(v => v.monto))

const inventoryDist = [
  { label: 'Calzado', units: '1,036 uni.', color: 'bg-primary' },
  { label: 'Ropa',    units: '444 uni.',   color: 'bg-slate-200' }
]

const categories = [
  { label: 'Polos',          value: '240 uni.', icon: 'checkroom'  },
  { label: 'Pantalones',     value: '185 uni.', icon: 'straighten' },
  { label: 'Calzado Urbano', value: '320 uni.', icon: 'steps'      },
  { label: 'Botas',          value: '95 uni.',  icon: 'hiking'     }
]
</script>
