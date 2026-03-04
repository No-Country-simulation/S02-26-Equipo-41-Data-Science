<template>
  <DashboardLayout>
    <div class="px-6 py-8 max-w-7xl mx-auto w-full">

      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900">Gestión de Clientes</h2>
        <p class="text-slate-500 text-sm">Seguimiento de clientes, compras y fidelización.</p>
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
        <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Nuevos Clientes</h3>
              <p class="text-sm text-slate-500">Captación mensual — último año</p>
            </div>
          </div>

          <!-- Area chart -->
          <div class="h-[200px] relative">
            <svg class="w-full h-full" viewBox="0 0 700 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="client-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stop-color="#1a59d5" stop-opacity="0.15"/>
                  <stop offset="100%" stop-color="#1a59d5" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <!-- Area fill -->
              <path
                d="M0,140 C58,120 116,90 175,100 C233,110 291,70 350,60 C408,50 466,80 525,50 C583,20 641,30 700,10 L700,180 L0,180 Z"
                fill="url(#client-gradient)"
              />
              <!-- Line -->
              <path
                d="M0,140 C58,120 116,90 175,100 C233,110 291,70 350,60 C408,50 466,80 525,50 C583,20 641,30 700,10"
                fill="none" stroke="#1a59d5" stroke-width="2.5" stroke-linecap="round"
              />
              <!-- Data points -->
              <circle v-for="(pt, i) in chartPoints" :key="i"
                :cx="pt.x" :cy="pt.y" r="4"
                fill="white" stroke="#1a59d5" stroke-width="2"
              />
            </svg>
          </div>
          <div class="flex justify-between mt-2 px-1 border-t border-slate-50 pt-2">
            <span v-for="m in months" :key="m" class="text-[9px] font-bold text-slate-400 uppercase">{{ m }}</span>
          </div>
        </div>

        <!-- Donut: clientes por segmento -->
        <div class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 mb-1">Segmentación</h3>
          <p class="text-sm text-slate-500 mb-6">Tipo de cliente</p>
          <div class="flex flex-col items-center">
            <DonutChart :percentage="52" label="Frecuentes" />
            <div class="mt-6 w-full space-y-2.5">
              <div v-for="seg in segments" :key="seg.label" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div :class="['size-2.5 rounded-full', seg.color]"></div>
                  <span class="text-xs font-medium text-slate-600">{{ seg.label }}</span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold text-slate-900">{{ seg.pct }}%</span>
                  <span class="text-[10px] text-slate-400 ml-1">({{ seg.count }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top customers table -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Top Clientes del Mes</h3>
            <p class="text-sm text-slate-500">Ordenados por monto de compra</p>
          </div>
          <button class="text-primary text-sm font-bold hover:underline">Ver todos</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50 text-left">
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Compras</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Gastado</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Última Compra</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Segmento</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="(client, i) in topClients" :key="client.name" class="hover:bg-slate-50 transition-colors">
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
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import KpiCard    from '@/components/common/KpiCard.vue'
import DonutChart from '@/components/charts/DonutChart.vue'

const months = ['Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar']

// Approximate SVG points matching the path curves
const chartPoints = [
  { x: 0,   y: 140 }, { x: 175, y: 100 }, { x: 350, y: 60  },
  { x: 525, y: 50  }, { x: 700, y: 10  }
]

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
