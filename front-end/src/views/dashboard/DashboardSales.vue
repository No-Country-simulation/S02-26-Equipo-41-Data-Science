<template>
  <div>
    <div class="px-6 py-8 max-w-7xl mx-auto w-full">

      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Gestión de Ventas</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Análisis de ventas, ingresos y rendimiento comercial.</p>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Ventas Hoy"         value="S/ 1,250.00" :trend="12.5"  trend-label="vs ayer" />
        <KpiCard label="Ventas del Mes"     value="S/ 24,800"   :trend="8.3"   trend-label="vs mes ant." />
        <KpiCard label="Ticket Promedio"    value="S/ 60.20"    :trend="3.1"   trend-label="vs mes ant." />
        <KpiCard label="Transacciones Hoy" value="21"          subtext="Meta diaria: 25 ventas" />
      </div>

      <!-- Secondary KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <KpiCard label="Mejor Día del Mes"  value="Viernes 14"  subtext="S/ 3,420 en ventas" />
        <KpiCard label="Producto Más Vendido" value="Zapatilla Urbana" subtext="87 unidades este mes" />
        <KpiCard label="Devoluciones"       value="3 items"     variant="warning" subtext="Pendientes de revisión" bg-icon="assignment_return" />
      </div>

      <!-- Charts row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        <!-- Bar chart: ventas por día de la semana -->
        <div class="lg:col-span-2 bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-100 dark:border-slate-400 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Ventas por Día</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">Ingresos diarios del mes en curso</p>
            </div>
            <select class="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5 outline-none text-slate-600 dark:text-white">
              <option>Marzo 2024</option>
              <option>Febrero 2024</option>
            </select>
          </div>

          <!-- Bar chart SVG -->
          <div class="h-[220px] flex items-end gap-2 px-2">
            <div
              v-for="(bar, i) in barData"
              :key="i"
              class="flex-1 flex flex-col items-center gap-1 group"
            >
              <span class="text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                S/{{ bar.value }}
              </span>
              <div
                class="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors cursor-pointer"
                :style="{ height: `${(bar.value / maxBarValue) * 180}px` }"
              ></div>
              <span class="text-[9px] text-slate-400 font-bold uppercase">{{ bar.label }}</span>
            </div>
          </div>
        </div>

        <!-- Donut: ventas por categoría -->
        <div class="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-100 dark:border-slate-400 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Ventas por Categoría</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Participación este mes</p>
          <div class="flex flex-col items-center">
            <DonutChart :percentage="58" label="Calzado" />
            <div class="mt-6 w-full space-y-2.5">
              <div v-for="cat in salesByCategory" :key="cat.label" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div :class="['size-2.5 rounded-full', cat.color]"></div>
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ cat.label }}</span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold text-slate-900 dark:text-white">{{ cat.pct }}%</span>
                  <span class="text-[10px] text-slate-400 dark:text-slate-400 ml-1">{{ cat.amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import KpiCard    from '@/components/common/KpiCard.vue'
import DonutChart from '@/components/common/DonutChart.vue'

const barData = [
  { label: 'L',   value: 820  },
  { label: 'M',   value: 1150 },
  { label: 'Mi',  value: 680  },
  { label: 'J',   value: 1420 },
  { label: 'V',   value: 1980 },
  { label: 'S',   value: 2340 },
  { label: 'D',   value: 950  },
  { label: 'L',   value: 1100 },
  { label: 'M',   value: 760  },
  { label: 'Mi',  value: 1380 },
  { label: 'J',   value: 1620 },
  { label: 'V',   value: 2100 },
  { label: 'S',   value: 2580 },
  { label: 'D',   value: 890  },
]
const maxBarValue = computed(() => Math.max(...barData.map(b => b.value)))

const salesByCategory = [
  { label: 'Calzado', pct: 58, amount: 'S/ 14,384', color: 'bg-primary' },
  { label: 'Polos',          pct: 22, amount: 'S/ 5,456',  color: 'bg-blue-300' },
  { label: 'Pantalones',     pct: 13, amount: 'S/ 3,224',  color: 'bg-slate-300' },
  { label: 'Botas',          pct: 7,  amount: 'S/ 1,736',  color: 'bg-slate-200' },
]

</script>
