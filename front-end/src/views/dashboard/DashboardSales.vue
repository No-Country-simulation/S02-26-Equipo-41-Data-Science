<template>
  <DashboardLayout>
    <div class="px-6 py-8 max-w-7xl mx-auto w-full">

      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900">Gestión de Ventas</h2>
        <p class="text-slate-500 text-sm">Análisis de ventas, ingresos y rendimiento comercial.</p>
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
        <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Ventas por Día</h3>
              <p class="text-sm text-slate-500">Ingresos diarios del mes en curso</p>
            </div>
            <select class="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5 outline-none text-slate-600">
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
        <div class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 mb-1">Ventas por Categoría</h3>
          <p class="text-sm text-slate-500 mb-6">Participación este mes</p>
          <div class="flex flex-col items-center">
            <DonutChart :percentage="58" label="Calzado" />
            <div class="mt-6 w-full space-y-2.5">
              <div v-for="cat in salesByCategory" :key="cat.label" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div :class="['size-2.5 rounded-full', cat.color]"></div>
                  <span class="text-xs font-medium text-slate-600">{{ cat.label }}</span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold text-slate-900">{{ cat.pct }}%</span>
                  <span class="text-[10px] text-slate-400 ml-1">{{ cat.amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent sales table -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Últimas Ventas</h3>
            <p class="text-sm text-slate-500">Registro de transacciones recientes</p>
          </div>
          <button class="text-primary text-sm font-bold hover:underline">Ver todas</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50 text-left">
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Venta</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Cantidad</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Hora</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="sale in recentSales" :key="sale.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 font-mono text-xs text-slate-500 font-bold">{{ sale.id }}</td>
                <td class="px-6 py-4 font-semibold text-slate-800">{{ sale.product }}</td>
                <td class="px-6 py-4 text-slate-600">{{ sale.client }}</td>
                <td class="px-6 py-4 text-slate-600">{{ sale.qty }}</td>
                <td class="px-6 py-4 font-bold text-slate-900">{{ sale.total }}</td>
                <td class="px-6 py-4">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide',
                    sale.status === 'Completado' ? 'bg-green-100 text-green-700' :
                    sale.status === 'Pendiente'  ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  ]">{{ sale.status }}</span>
                </td>
                <td class="px-6 py-4 text-[11px] text-slate-400 font-medium">{{ sale.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import KpiCard    from '@/components/common/KpiCard.vue'
import DonutChart from '@/components/charts/DonutChart.vue'

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
  { label: 'Calzado Urbano', pct: 58, amount: 'S/ 14,384', color: 'bg-primary' },
  { label: 'Polos',          pct: 22, amount: 'S/ 5,456',  color: 'bg-blue-300' },
  { label: 'Pantalones',     pct: 13, amount: 'S/ 3,224',  color: 'bg-slate-300' },
  { label: 'Botas',          pct: 7,  amount: 'S/ 1,736',  color: 'bg-slate-200' },
]

const recentSales = [
  { id: '#V-0231', product: 'Zapatilla Urbana Blanca',  client: 'Juan Pérez',      qty: 2, total: 'S/ 180.00', status: 'Completado', time: '11:42 a.m.' },
  { id: '#V-0230', product: 'Polo Oversize Negro',       client: 'María Torres',    qty: 3, total: 'S/ 135.00', status: 'Completado', time: '11:15 a.m.' },
  { id: '#V-0229', product: 'Pantalón Cargo Beige',      client: 'Carlos Ríos',     qty: 1, total: 'S/ 89.90',  status: 'Pendiente',  time: '10:58 a.m.' },
  { id: '#V-0228', product: 'Bota de Cuero Marrón',      client: 'Lucía Mamani',    qty: 1, total: 'S/ 220.00', status: 'Completado', time: '10:33 a.m.' },
  { id: '#V-0227', product: 'Zapatilla Running Azul',    client: 'Diego Salcedo',   qty: 2, total: 'S/ 260.00', status: 'Completado', time: '09:47 a.m.' },
  { id: '#V-0226', product: 'Polo Básico Blanco x3',     client: 'Ana Flores',      qty: 3, total: 'S/ 99.00',  status: 'Anulado',    time: '09:12 a.m.' },
]
</script>
