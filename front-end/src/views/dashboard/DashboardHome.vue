<template>
  <div>
    <div class="px-6 py-8 max-w-7xl mx-auto w-full">

      <!-- Page header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900">Resumen General</h2>
        <p class="text-slate-500 text-sm">Bienvenido de nuevo. Aquí tienes el estado de tu tienda hoy.</p>
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
        <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Ventas (Últimos 7 días)</h3>
              <p class="text-sm text-slate-500">Tendencia de ingresos semanales</p>
            </div>
            <select class="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5 outline-none text-slate-600">
              <option>Esta semana</option>
              <option>Semana pasada</option>
            </select>
          </div>
          <SalesLineChart :data="salesWeekData" />
          <div class="flex justify-between mt-4 px-2 border-t border-slate-50 pt-2">
            <span v-for="d in ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']" :key="d"
              class="text-[10px] font-bold text-slate-400 uppercase">{{ d }}</span>
          </div>
        </div>

        <!-- Inventory donut -->
        <div class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 mb-1">Distribución de Inventario</h3>
          <p class="text-sm text-slate-500 mb-6">Ropa vs Calzado</p>
          <div class="flex flex-col items-center">
            <DonutChart :percentage="70" label="Calzado" />
            <div class="mt-6 w-full space-y-3">
              <div v-for="item in inventoryDist" :key="item.label" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div :class="['size-3 rounded-full', item.color]"></div>
                  <span class="text-sm font-medium text-slate-600">{{ item.label }}</span>
                </div>
                <span class="text-sm font-bold text-slate-900">{{ item.units }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category cards -->
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-slate-900">Stock por Categorías Principales</h3>
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

const salesWeekData = [80, 45, 62, 30, 20, 35, 10]  // SVG path reference values

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
