<template>
  <div>
    <div class="px-6 py-8 max-w-7xl mx-auto w-full">

      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900">Gestión de Inventario</h2>
        <p class="text-slate-500 text-sm">Control de stock, categorías y alertas de reposición.</p>
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
        <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Movimiento de Stock</h3>
              <p class="text-sm text-slate-500">Entradas y salidas — últimas 4 semanas</p>
            </div>
            <div class="flex items-center gap-4 text-[10px] font-bold uppercase text-slate-500">
              <span class="flex items-center gap-1.5"><span class="inline-block size-2.5 rounded-sm bg-primary"></span>Entradas</span>
              <span class="flex items-center gap-1.5"><span class="inline-block size-2.5 rounded-sm bg-blue-200"></span>Salidas</span>
            </div>
          </div>

          <div class="h-[200px] flex items-end gap-3 px-2">
            <div v-for="(week, i) in stockFlow" :key="i" class="flex-1 flex gap-1 items-end">
              <!-- Entradas -->
              <div
                class="flex-1 rounded-t-md bg-primary/80 hover:bg-primary transition-colors cursor-pointer"
                :style="{ height: `${(week.in / maxStock) * 180}px` }"
                :title="`Entradas: ${week.in}`"
              ></div>
              <!-- Salidas -->
              <div
                class="flex-1 rounded-t-md bg-blue-200 hover:bg-blue-300 transition-colors cursor-pointer"
                :style="{ height: `${(week.out / maxStock) * 180}px` }"
                :title="`Salidas: ${week.out}`"
              ></div>
            </div>
          </div>
          <div class="flex justify-around mt-3 border-t border-slate-50 pt-2">
            <span v-for="(week, i) in stockFlow" :key="i" class="text-[9px] font-bold text-slate-400 uppercase">
              Sem {{ i + 1 }}
            </span>
          </div>
        </div>

        <!-- Categories donut -->
        <div class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 mb-1">Stock por Familia</h3>
          <p class="text-sm text-slate-500 mb-6">Distribución actual</p>
          <div class="flex flex-col items-center">
            <DonutChart :percentage="70" label="Calzado" />
            <div class="mt-6 w-full space-y-2.5">
              <div v-for="cat in stockByFamily" :key="cat.label" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div :class="['size-2.5 rounded-full', cat.color]"></div>
                  <span class="text-xs font-medium text-slate-600">{{ cat.label }}</span>
                </div>
                <span class="text-xs font-bold text-slate-900">{{ cat.units }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category summary cards -->
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-slate-900">Stock por Categoría</h3>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <CategoryCard v-for="cat in categories" :key="cat.label"
          :label="cat.label" :value="cat.value" :icon="cat.icon" />
      </div>

      <!-- Products table -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Listado de Productos</h3>
            <p class="text-sm text-slate-500">Stock actual por producto</p>
          </div>
          <div class="flex items-center gap-3">
            <input
              type="text"
              placeholder="Buscar producto..."
              class="text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-primary w-48"
            />
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50 text-left">
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Precio Unit.</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="p in products" :key="p.sku" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 font-semibold text-slate-800">{{ p.name }}</td>
                <td class="px-6 py-4 text-slate-600">{{ p.category }}</td>
                <td class="px-6 py-4 font-mono text-xs text-slate-400 font-bold">{{ p.sku }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span :class="['font-bold', p.stock <= 5 ? 'text-red-600' : p.stock <= 15 ? 'text-amber-600' : 'text-slate-900']">
                      {{ p.stock }}
                    </span>
                    <div class="w-16 bg-slate-100 rounded-full h-1.5">
                      <div
                        :class="['h-1.5 rounded-full', p.stock <= 5 ? 'bg-red-500' : p.stock <= 15 ? 'bg-amber-400' : 'bg-green-500']"
                        :style="{ width: `${Math.min((p.stock / 100) * 100, 100)}%` }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 font-bold text-slate-900">{{ p.price }}</td>
                <td class="px-6 py-4">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide',
                    p.stock <= 5  ? 'bg-red-100 text-red-700' :
                    p.stock <= 15 ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  ]">
                    {{ p.stock <= 5 ? 'Crítico' : p.stock <= 15 ? 'Bajo Stock' : 'Disponible' }}
                  </span>
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
import { computed } from 'vue'
import KpiCard      from '@/components/common/KpiCard.vue'
import CategoryCard from '@/components/common/CategoryCard.vue'
import DonutChart   from '@/components/common/DonutChart.vue'

const stockFlow = [
  { in: 320, out: 210 },
  { in: 280, out: 340 },
  { in: 410, out: 290 },
  { in: 360, out: 380 },
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
  { label: 'Calzado Urbano', value: '320 uni.', icon: 'steps'      },
  { label: 'Botas',          value: '95 uni.',  icon: 'hiking'     },
]

const products = [
  { name: 'Zapatilla Urbana Blanca',  category: 'Calzado Urbano', sku: 'CAL-001', stock: 82,  price: 'S/ 89.90'  },
  { name: 'Zapatilla Running Azul',   category: 'Calzado Urbano', sku: 'CAL-002', stock: 47,  price: 'S/ 129.90' },
  { name: 'Bota de Cuero Marrón',     category: 'Botas',          sku: 'BOT-001', stock: 12,  price: 'S/ 219.90' },
  { name: 'Polo Oversize Negro',      category: 'Polos',          sku: 'POL-001', stock: 95,  price: 'S/ 45.00'  },
  { name: 'Polo Básico Blanco',       category: 'Polos',          sku: 'POL-002', stock: 4,   price: 'S/ 29.90'  },
  { name: 'Pantalón Cargo Beige',     category: 'Pantalones',     sku: 'PAN-001', stock: 38,  price: 'S/ 89.90'  },
  { name: 'Pantalón Jean Slim Azul',  category: 'Pantalones',     sku: 'PAN-002', stock: 3,   price: 'S/ 79.90'  },
  { name: 'Bota Táctica Negra',       category: 'Botas',          sku: 'BOT-002', stock: 8,   price: 'S/ 189.90' },
]
</script>
