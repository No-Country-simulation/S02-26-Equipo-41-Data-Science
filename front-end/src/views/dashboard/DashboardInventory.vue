<template>
  <div>
    <div class="px-6 py-8 max-w-7xl mx-auto w-full">

      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Gestión de Inventario</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Control de stock, categorías y alertas de reposición.</p>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total en Stock"     value="1,480 items" subtext="Actualizado hace 5 min" />
        <KpiCard label="Categorías Activas" value="8"           subtext="4 con movimiento hoy" />
        <KpiCard label="Valor del Stock"    value="S/ 89,400"   :trend="5.2" trend-label="vs mes ant." />
        <KpiCard
          variant="danger" label="Bajo Stock" value="12 items"
          action-label="Ver urgentes" bg-icon="inventory_2"
        />
      </div>

      <!-- Stock flow + categories -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        <!-- Stacked bar: entradas vs salidas -->
        <div class="lg:col-span-2 bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-100 dark:border-slate-400 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Movimiento de Stock</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">Entradas y salidas — últimas 4 semanas</p>
            </div>
            <div class="flex items-center gap-4 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-1.5"><span class="inline-block size-2.5 rounded-sm bg-primary"></span>Entradas</span>
              <span class="flex items-center gap-1.5"><span class="inline-block size-2.5 rounded-sm bg-blue-200"></span>Salidas</span>
            </div>
          </div>
          <BaseStackedBarChart :labels="['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']" :datasets="datasets" height="220" />
        </div>
        <!-- Categories donut -->
        <div class="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-100 dark:border-slate-400 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Stock por Familia</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Distribución actual</p>
          <div class="flex flex-col items-center">
            <DonutChart :percentage="70" label="Calzado" />
            <div class="mt-6 w-full space-y-2.5">
              <div v-for="cat in stockByFamily" :key="cat.label" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div :class="['size-2.5 rounded-full', cat.color]"></div>
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ cat.label }}</span>
                </div>
                <span class="text-xs font-bold text-slate-900 dark:text-white">{{ cat.units }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category summary cards -->
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Stock por Categoría</h3>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <CategoryCard v-for="cat in categories" :key="cat.label"
          :label="cat.label" :value="cat.value" :icon="cat.icon" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import KpiCard      from '@/components/common/KpiCard.vue'
import CategoryCard from '@/components/common/CategoryCard.vue'
import DonutChart   from '@/components/common/DonutChart.vue'
import BaseStackedBarChart from '@/components/common/BaseStackedBarChart.vue'

const stockFlow = [
  { in: 320, out: 210 },
  { in: 280, out: 340 },
  { in: 410, out: 290 },
  { in: 360, out: 380 },
]

const datasets = [
  {
    label: "Entradas",
    backgroundColor: "#4f46e5",
    data: stockFlow.map(w => w.in)
  },
  {
    label: "Salidas",
    backgroundColor: "#bfdbfe",
    data: stockFlow.map(w => w.out)
  }
]

const maxStock = computed(() => Math.max(...stockFlow.flatMap(w => [w.in, w.out])))

const stockByFamily = [
  { label: 'Calzado', units: '1,036 uni.', color: 'bg-primary' },
  { label: 'Polos',   units: '240 uni.',   color: 'bg-blue-300' },
  { label: 'Pantalones', units: '185 uni.',color: 'bg-slate-300' },
  { label: 'Otros',   units: '19 uni.',    color: 'bg-slate-200' },
]

const categories = [
  { label: 'Polos',          value: '240 uni.', icon: 'checkroom'  },
  { label: 'Pantalones',     value: '185 uni.', icon: 'straighten' },
  { label: 'Calzado', value: '320 uni.', icon: 'steps'      },
  { label: 'Botas',          value: '95 uni.',  icon: 'hiking'     },
]

</script>
