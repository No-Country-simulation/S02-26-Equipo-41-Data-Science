<template>
  <div class="max-w-[1400px] mx-auto p-4">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-2">
          Inventario de Productos
        </h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Listado de productos disponibles en el inventario
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

    <!-- Filtros -->
    <TableFilters
      v-model:search-query="filters.search"
      :quick-filters="quickFilters"
      :active-quick-filter="filters.quickFilter"
      :advanced-filters="advancedFilters"
      :filter-values="filters.advanced"
      search-placeholder="Buscar por nombre de producto..."
      @quick-filter="handleQuickFilter"
      @filter-change="handleAdvancedFilterChange"
      @clear-filters="handleClearFilters"
    />

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- DataTable -->
    <DataTable
      v-else
      :columns="tableColumns"
      :data="products"
      :show-pagination="true"
      :current-page="pagination.page.value"
      :total-pages="pagination.totalPages.value"
      :total-items="pagination.total.value"
      :page-size="pagination.pageSize.value"
      empty-message="No se encontraron productos"
      @page-change="handlePageChange"
    >
      <!-- Imagen -->
      <template #cell-imagen_url="{ row }">
        <div
          v-if="row.imagen_url"
          class="size-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <img
            :src="row.imagen_url"
            :alt="row.nombreproducto"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="size-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700"
        >
          <span class="material-symbols-outlined text-gray-400">image</span>
        </div>
      </template>

      <!-- Nombre -->
      <template #cell-nombreproducto="{ row }">
        <div class="flex flex-col">
          <span class="text-sm font-bold text-gray-900 dark:text-white">
            {{ row.nombreproducto }}
          </span>
          <span class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            {{ row.total_variantes }} {{ row.total_variantes === 1 ? 'variante' : 'variantes' }}
          </span>
        </div>
      </template>

      <!-- Categoría -->
      <template #cell-categoria="{ row }">
        <span
          :class="[
            'inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase',
            row.categoria === 'Calzado'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
          ]"
        >
          {{ row.categoria }}
        </span>
      </template>

      <!-- Precio -->
      <template #cell-price_range="{ row }">
        <span class="text-sm font-bold text-gray-900 dark:text-white">
          {{ formatPriceRange(row.min_price, row.max_price) }}
        </span>
      </template>

      <!-- Stock Status -->
      <template #cell-stock="{ row }">
        <div class="flex flex-col gap-1">
          <!-- Badge principal -->
          <span
            :class="[
              'inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold border w-fit',
              getStockColorClasses(row.stock_status)
            ]"
          >
            <span
              :class="[
                'size-2 rounded-full mr-2',
                getStockDotColor(row.stock_status)
              ]"
            ></span>
            {{ row.total_stock }} Unidades ({{ getStockLabel(row.stock_status) }})
          </span>

          <!-- Alertas -->
          <span
            v-if="row.low_stock_count > 0 && row.out_stock_count > 0"
            class="text-[10px] text-red-600 dark:text-red-400 font-semibold px-1"
          >
            {{ row.out_stock_count }} sin stock, {{ row.low_stock_count }} stock bajo
          </span>
          <span
            v-else-if="row.out_stock_count > 0"
            class="text-[10px] text-red-600 dark:text-red-400 font-semibold px-1"
          >
            {{ row.out_stock_count }} {{ row.out_stock_count === 1 ? 'variante sin stock' : 'variantes sin stock' }}
          </span>
          <span
            v-else-if="row.low_stock_count > 0"
            class="text-[10px] text-orange-600 dark:text-orange-400 font-semibold px-1"
          >
            {{ row.low_stock_count }} {{ row.low_stock_count === 1 ? 'variante con stock bajo' : 'variantes con stock bajo' }}
          </span>
        </div>
      </template>

      <!-- Acciones -->
      <template #cell-actions="{ row }">
        <div class="flex items-center justify-center gap-1">
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
            title="Editar"
          >
            <span class="material-symbols-outlined text-xl">edit</span>
          </button>
          <button
            @click="handleDelete(row)"
            class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            title="Eliminar"
          >
            <span class="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import BaseButton from '@/components/common/BaseButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import TableFilters from '@/components/common/TableFilters.vue'
import { useInventoryStore } from '@/stores/inventory'
import { usePagination } from '@/composables/usePagination'
import { useFilters } from '@/composables/useFilters'
import { toast } from '@/utils/toast'

const router = useRouter()
const inventoryStore = useInventoryStore()
const { loading } = storeToRefs(inventoryStore)

const pagination = usePagination(10) // 10 items por página
const products = ref([])

// ==========================================
// FILTROS
// ==========================================
const { filters, setFilter, clear } = useFilters({
  search: '',
  quickFilter: 'all',
  advanced: {
    stock: '',
    priceRange: ''
  }
})

const quickFilters = [
  { label: 'Todos', value: 'all' },
  { label: 'Zapatillas', value: 'Zapatillas' },
  { label: 'Polos', value: 'Polos' }, 
]

const advancedFilters = [
  {
    key: 'stock',
    label: 'Rango de Stock',
    type: 'select',
    placeholder: 'Todos los niveles',
    options: [
      { label: 'Sin Stock', value: 'out' },
      { label: 'Stock Bajo', value: 'low' },
      { label: 'Stock OK', value: 'ok' }
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

const tableColumns = [
  { key: 'imagen_url', label: 'Miniatura' },
  { key: 'nombreproducto', label: 'Nombre del Producto' },
  { key: 'categoria', label: 'Categoría' },
  { key: 'price_range', label: 'Precio' },
  { key: 'stock', label: 'Stock' },
  { key: 'actions', label: 'Acciones', align: 'center' }
]

// ==========================================
// FETCH DATA (SERVER-SIDE)
// ==========================================
async function fetchData() {
  try {
    const { data, count, error } = await inventoryStore.fetchProducts({
      sucursalId: 1,
      from: pagination.from.value,
      to: pagination.to.value,
      filters: filters.value
    })

    if (error) throw error

    products.value = data || []
    pagination.setTotal(count || 0)

    console.log('Productos obtenidos:', products.value)
  } catch (err) {
    console.error('Error fetching products:', err)
  }
}

// ==========================================
// HANDLERS
// ==========================================
const handlePageChange = (page) => {
  pagination.page = page
  fetchData()
}

const handleQuickFilter = (value) => {
  setFilter('quickFilter', value)
  pagination.reset()
  fetchData()
}

const handleAdvancedFilterChange = ({ key, value }) => {
  // Actualizar filtro anidado en advanced
  const currentAdvanced = { ...filters.value.advanced }
  currentAdvanced[key] = value
  setFilter('advanced', currentAdvanced)
  
  pagination.reset()
  fetchData()
}

const handleClearFilters = () => {
  clear()
  pagination.reset()
  fetchData()
}

const handleCreate = () => {
  router.push({ name: 'inventory-create' })
}

const handleView = (row) => {
  router.push({ name: 'inventory-detail', params: { id: row.productoid } })
}

const handleEdit = (row) => {
  router.push({ name: 'inventory-edit', params: { id: row.productoid } })
}

const handleDelete = async (row) => {
  try {
    await inventoryStore.deleteProduct(row.productoid)
    fetchData()
    toast.success('Producto eliminado exitosamente')
  } catch (err) {
    console.error('Error deleting product:', err)
    toast.error('Error al eliminar el producto')
  }
}

// ==========================================
// UTILITIES (Mantener estilos originales)
// ==========================================
const formatPriceRange = (min, max) => {
  if (!min || !max) return 'N/A'
  if (min === max) {
    return `S/ ${min.toFixed(2)}`
  }
  return `S/ ${min.toFixed(2)} – S/ ${max.toFixed(2)}`
}

const getStockColorClasses = (status) => {
  const classes = {
    'ok': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50',
    'low': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200/50',
    'out': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200/50'
  }
  return classes[status] || classes['ok']
}

const getStockDotColor = (status) => {
  const colors = {
    'ok': 'bg-emerald-500',
    'low': 'bg-orange-500',
    'out': 'bg-red-500'
  }
  return colors[status] || colors['ok']
}

const getStockLabel = (status) => {
  const labels = {
    'ok': 'En Stock',
    'low': 'Stock Bajo',
    'out': 'Sin Stock'
  }
  return labels[status] || 'En Stock'
}

// ==========================================
// WATCHERS
// ==========================================
// Debounce para búsqueda
let searchTimeout
watch(() => filters.value.search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.reset()
    fetchData()
  }, 300)
})

// ==========================================
// LIFECYCLE
// ==========================================
fetchData()
</script>