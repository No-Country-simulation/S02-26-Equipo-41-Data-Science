<template>
  <div class="max-w-[1400px] mx-auto p-4">
    <!-- Header con Breadcrumbs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-2">
          Inventario de Productos
        </h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Panel de control de existencias agrupado por modelo base.
        </p>
      </div>
      <BaseButton
        variant="primary"
        icon-left="add"
        @click="handleCreate"
      >
        Agregar Producto
      </BaseButton>
    </div>

    <!-- ✅ TableFilters Component -->
    <TableFilters
      v-model:search-query="searchQuery"
      :quick-filters="quickFilters"
      :active-quick-filter="activeQuickFilter"
      :advanced-filters="advancedFilters"
      :filter-values="advancedFilterValues"
      search-placeholder="Buscar por SKU base, nombre de modelo..."
      @quick-filter="handleQuickFilter"
      @filter-change="handleAdvancedFilterChange"
      @clear-filters="handleClearFilters"
    />

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- DataTable Component -->
    <DataTable
      v-else
      :columns="tableColumns"
      :data="paginatedProducts"
      :show-pagination="true"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="filteredProducts.length"
      :items-per-page="itemsPerPage"
      empty-message="No se encontraron productos"
      @page-change="handlePageChange"
    >
      
      <!-- ✅ Slot: Image -->
      <template #cell-image="{ row }">
        <div
          v-if="row.image"
          class="size-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div
            class="w-full h-full bg-center bg-cover"
            :style="`background-image: url('${row.image}')`"
          ></div>
        </div>
        <div
          v-else
          class="size-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700"
        >
          <span class="material-symbols-outlined text-gray-400">image</span>
        </div>
      </template>

      <!-- ✅ Slot: SKU -->
      <template #cell-sku="{ row }">
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-tight">
          {{ row.sku }}
        </span>
      </template>

      <!-- ✅ Slot: Name -->
      <template #cell-name="{ row }">
        <div class="flex flex-col">
          <span class="text-sm font-bold text-gray-900 dark:text-white">{{ row.name }}</span>
          <span class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            {{ row.colorsCount }} {{ row.colorsCount === 1 ? 'color' : 'colores' }} · 
            {{ row.variantsCount }} {{ row.variantsCount === 1 ? 'variante' : 'variantes' }}
          </span>
        </div>
      </template>

      <!-- ✅ Slot: Category -->
      <template #cell-category="{ row }">
        <span
          :class="[
            'inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase',
            row.category === 'Calzado'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
          ]"
        >
          {{ row.category }}
        </span>
      </template>

      <!-- ✅ Slot: Price Range -->
      <template #cell-priceRange="{ row }">
        <span class="text-sm font-bold text-gray-900 dark:text-white">
          {{ row.priceRange }}
        </span>
      </template>

      <!-- ✅ Slot: Stock Status -->
      <template #cell-stockStatus="{ row }">
        <div class="flex flex-col gap-1">
          <!-- Badge principal -->
          <span
            :class="[
              'inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold border w-fit',
              row.stockColor === 'emerald'
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50'
                : row.stockColor === 'orange'
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200/50'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200/50'
            ]"
          >
            <span
              :class="[
                'size-2 rounded-full mr-2',
                row.stockColor === 'emerald' ? 'bg-emerald-500' : row.stockColor === 'orange' ? 'bg-orange-500' : 'bg-red-500'
              ]"
            ></span>
            {{ row.totalStock }} Unidades ({{ row.stockBadge }})
          </span>

          <!-- Alertas -->
          <span
            v-if="row.lowStockCount > 0 && row.outOfStockCount > 0"
            class="text-[10px] text-red-600 dark:text-red-400 font-semibold px-1"
          >
            {{ row.outOfStockCount }} sin stock, {{ row.lowStockCount }} stock bajo
          </span>
          <span
            v-else-if="row.outOfStockCount > 0"
            class="text-[10px] text-red-600 dark:text-red-400 font-semibold px-1"
          >
            {{ row.outOfStockCount }} {{ row.outOfStockCount === 1 ? 'variante sin stock' : 'variantes sin stock' }}
          </span>
          <span
            v-else-if="row.lowStockCount > 0"
            class="text-[10px] text-orange-600 dark:text-orange-400 font-semibold px-1"
          >
            {{ row.lowStockCount }} {{ row.lowStockCount === 1 ? 'variante con stock bajo' : 'variantes con stock bajo' }}
          </span>
        </div>
      </template>

      <!-- ✅ Slot: Actions -->
      <template #cell-actions="{ row }">
        <div class="flex items-center justify-center gap-1" @click.stop>
          <button
            @click="handleView(row)"
            class="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
            title="Ver Detalle"
          >
            <span class="material-symbols-outlined text-xl">visibility</span>
          </button>
          <button
            @click="handleEdit(row)"
            class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all"
            title="Editar Producto"
          >
            <span class="material-symbols-outlined text-xl">edit</span>
          </button>
          <button
            @click="handleDelete(row)"
            class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            title="Eliminar Producto"
          >
            <span class="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import DataTable from '@/components/common/DataTable.vue'
import TableFilters from '@/components/common/TableFilters.vue'
import { useInventoryStore } from '@/stores/inventory'

const router = useRouter()
const inventoryStore = useInventoryStore()

const { loading } = storeToRefs(inventoryStore)

// ==========================================
// FILTROS
// ==========================================
const searchQuery = ref('')
const activeQuickFilter = ref('all')
const advancedFilterValues = ref({
  stock: '',
  priceRange: ''
})

// Filtros rápidos
const quickFilters = [
  { label: 'Todos', value: 'all' },
  { label: 'Ropa', value: 'Ropa' },
  { label: 'Calzado', value: 'Calzado' }
]

// Filtros avanzados
const advancedFilters = [
  {
    key: 'stock',
    label: 'Rango de Stock',
    type: 'select',
    placeholder: 'Todos los niveles',
    options: [
      { label: 'Sin Stock (Variantes con 0)', value: 'out' },
      { label: 'Stock Bajo (< umbral)', value: 'low' },
      { label: 'Stock OK (> umbral)', value: 'ok' }
    ]
  },
  {
    key: 'priceRange',
    label: 'Rango de Precio',
    type: 'select',
    placeholder: 'Cualquier Precio',
    options: [
      { label: 'S/ 0 - S/ 50', value: '0-50' },
      { label: 'S/ 50 - S/ 200', value: '50-200' },
      { label: 'S/ 200 - S/ 500', value: '200-500' },
      { label: 'S/ 500+', value: '500+' }
    ]
  }
]

// ==========================================
// TABLA
// ==========================================
const tableColumns = [
  { key: 'image', label: 'Miniatura' },
  { key: 'sku', label: 'SKU Base' },
  { key: 'name', label: 'Nombre del Producto' },
  { key: 'category', label: 'Categoría' },
  { key: 'priceRange', label: 'Precio Venta' },
  { key: 'stockStatus', label: 'Estado Stock' },
  { key: 'actions', label: 'Acciones', align: 'center' }
]

// ==========================================
// PAGINACIÓN
// ==========================================
const currentPage = ref(1)
const itemsPerPage = 10

// Productos filtrados
const filteredProducts = computed(() => {
  return inventoryStore.getFilteredProducts({
    search: searchQuery.value,
    quickFilter: activeQuickFilter.value,
    advanced: advancedFilterValues.value
  })
})

// Total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

// Productos paginados
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// ==========================================
// HANDLERS
// ==========================================
const handleCreate = () => {
  router.push({ name: 'inventory-create' })
}

const handleView = (row) => {
  router.push({ name: 'inventory-detail', params: { id: row.id } })
}

const handleEdit = (row) => {
  router.push({ name: 'inventory-edit', params: { id: row.id } })
}

const handleDelete = (row) => {
  // TODO: Implementar modal de confirmación
  console.log('Delete product:', row.id)
}

const handleQuickFilter = (value) => {
  activeQuickFilter.value = value
  currentPage.value = 1 // Reset página al cambiar filtro
}

const handleAdvancedFilterChange = ({ key, value }) => {
  advancedFilterValues.value[key] = value
  currentPage.value = 1 // Reset página al cambiar filtro
}

const handleClearFilters = () => {
  advancedFilterValues.value = {
    stock: '',
    priceRange: ''
  }
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

// ==========================================
// LIFECYCLE
// ==========================================
onMounted(async () => {
  if (inventoryStore.products.length === 0) {
    await inventoryStore.fetchProducts()
  }
})
</script>