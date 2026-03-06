<template>
  <div>
    <div class="px-6 py-8 max-w-7xl mx-auto w-full">

      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Gestión de Clientes</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Seguimiento de clientes, compras y fidelización.</p>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Clientes"      value="348"         :trend="6.4"  trend-label="vs mes ant." />
        <KpiCard label="Clientes Nuevos"     value="24"          subtext="Este mes" :trend="18.2" trend-label="vs mes ant." />
        <KpiCard label="Compra Promedio"     value="S/ 142.80"   :trend="4.1"  trend-label="vs mes ant." />
        <KpiCard label="Tasa de Retención"   value="72%"         subtext="Clientes que repiten compra" />
      </div>

      <!-- Secondary KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <KpiCard label="Cliente VIP Top"       value="Juan Pérez"      subtext="S/ 2,340 acumulado" />
        <KpiCard label="Clientes sin compra"   value="41"              variant="warning" subtext="+30 días sin actividad" bg-icon="person_off" />
        <KpiCard label="Reclamos Abiertos"     value="5"               variant="danger"  action-label="Ver reclamos" bg-icon="support_agent" />
      </div>

      <!-- Charts row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        <!-- Activity line chart -->
        <div class="lg:col-span-2 bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-100 dark:border-slate-400 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Clientes</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">Cantidad de clientes </p>
            </div>
            <select class="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5 outline-none text-slate-600 dark:text-white">
              <option>Esta semana</option>
              <option>Semana pasada</option>
            </select>
          </div>
          <BaseLineChart :labels="months" :data="[15, 12, 18, 14, 20, 16, 22, 18, 25, 20, 21, 23]" height="250" />
        </div> 
        <!-- Donut: clientes por segmento -->
        <div class="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-100 dark:border-slate-400 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Segmentación</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Tipo de cliente</p>
          <div class="flex flex-col items-center">
            <DonutChart :percentage="52" label="Frecuentes" />
            <div class="mt-6 w-full space-y-2.5">
              <div v-for="seg in segments" :key="seg.label" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div :class="['size-2.5 rounded-full', seg.color]"></div>
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ seg.label }}</span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold text-slate-900 dark:text-white">{{ seg.pct }}%</span>
                  <span class="text-[10px] text-slate-400 dark:text-slate-400 ml-1">({{ seg.count }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top customers table -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 dark:border-slate-400 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Top Clientes del Mes</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">Ordenados por monto de compra</p>
          </div>
          <button class="text-primary text-sm font-bold hover:underline">Ver todos</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-left">
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Compras</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Gastado</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Última Compra</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Segmento</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-for="(client, i) in topClients" :key="client.name" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                <td class="px-6 py-4">
                  <span :class="[
                    'inline-flex size-6 items-center justify-center rounded-full text-xs font-bold',
                    i === 0 ? 'bg-amber-100 text-amber-700' :
                    i === 1 ? 'bg-slate-200 text-slate-600' :
                    i === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-slate-100 text-slate-500'
                  ]">{{ i + 1 }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span class="text-primary font-bold text-xs">{{ client.initials }}</span>
                    </div>
                    <div>
                      <p class="font-semibold text-slate-800">{{ client.name }}</p>
                      <p class="text-[10px] text-slate-400">{{ client.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-600 font-medium">{{ client.purchases }}</td>
                <td class="px-6 py-4 font-bold text-slate-900">{{ client.total }}</td>
                <td class="px-6 py-4 text-[11px] text-slate-400 font-medium">{{ client.lastPurchase }}</td>
                <td class="px-6 py-4">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide',
                    client.segment === 'VIP'        ? 'bg-purple-100 text-purple-700' :
                    client.segment === 'Frecuente'  ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  ]">{{ client.segment }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import KpiCard    from '@/components/common/KpiCard.vue'
import DonutChart from '@/components/common/DonutChart.vue'
import BaseLineChart from '@/components/common/BaseLineChart.vue'

const months = ['Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar']

const segments = [
  { label: 'Frecuentes', pct: 52, count: 181, color: 'bg-primary'   },
  { label: 'Nuevos',     pct: 28, count: 97,  color: 'bg-blue-300'  },
  { label: 'Ocasionales',pct: 14, count: 49,  color: 'bg-slate-300' },
  { label: 'Inactivos',  pct: 6,  count: 21,  color: 'bg-slate-200' },
]

const topClients = [
  { name: 'Juan Pérez',     initials: 'JP', email: 'juan.perez@gmail.com',   purchases: 8,  total: 'S/ 2,340.00', lastPurchase: 'Hoy 11:42 a.m.',       segment: 'VIP'        },
  { name: 'María Torres',   initials: 'MT', email: 'mtor@hotmail.com',        purchases: 6,  total: 'S/ 1,890.00', lastPurchase: 'Hoy 11:15 a.m.',       segment: 'VIP'        },
  { name: 'Lucía Mamani',   initials: 'LM', email: 'luciamamani@gmail.com',   purchases: 5,  total: 'S/ 1,450.00', lastPurchase: 'Ayer 04:30 p.m.',       segment: 'Frecuente'  },
  { name: 'Diego Salcedo',  initials: 'DS', email: 'd.salcedo@outlook.com',   purchases: 4,  total: 'S/ 1,080.00', lastPurchase: 'Hoy 09:47 a.m.',       segment: 'Frecuente'  },
  { name: 'Carlos Ríos',    initials: 'CR', email: 'crios.lima@gmail.com',    purchases: 3,  total: 'S/ 760.00',   lastPurchase: 'Hoy 10:58 a.m.',       segment: 'Frecuente'  },
  { name: 'Ana Flores',     initials: 'AF', email: 'anaflores99@gmail.com',   purchases: 2,  total: 'S/ 340.00',   lastPurchase: '28 Feb 2024',           segment: 'Ocasional'  },
  { name: 'Pedro Quispe',   initials: 'PQ', email: 'pquispe@empresa.com.pe',  purchases: 1,  total: 'S/ 220.00',   lastPurchase: '25 Feb 2024',           segment: 'Ocasional'  },
]
</script>
