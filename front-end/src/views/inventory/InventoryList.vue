<template>
  <div class="max-w-[1400px] mx-auto px-8 pb-8">
    <!-- Header con título y botón -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Inventario de Productos
        </h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Panel de control de existencias para calzado y ropa.
        </p>
      </div>
      <BaseButton
        variant="primary"
        icon-left="add"
        copy
        @click="goToCreate"
      >
        Agregar Producto
      </BaseButton>
    </div>

    <!-- Filtros -->
    <TableFilters
      v-model:search-query="filters.search"
      :search-placeholder="filtersConfig.search.placeholder"
      :quick-filters="filtersConfig.quickFilters"
      :active-quick-filter="filters.quickFilter"
      :advanced-filters="filtersConfig.advancedFilters"
      :filter-values="filters.advanced"
      @quick-filter="handleQuickFilter"
      @filter-change="handleFilterChange"
      @clear-filters="clearFilters"
    />

    <!-- Tabla de productos -->
    <DataTable
      :columns="tableConfig.columns"
      :data="paginatedProducts"
      :current-page="pagination.currentPage"
      :total-pages="pagination.totalPages"
      :total-items="pagination.totalItems"
      :items-per-page="pagination.itemsPerPage"
      :empty-message="tableConfig.empty.message"
      :empty-icon="tableConfig.empty.icon"
      @page-change="handlePageChange"
    >
      <!-- Miniatura -->
      <template #cell-thumbnail="{ row }">
        <div class="size-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
          <div
            v-if="row.image"
            class="w-full h-full bg-center bg-cover"
            :style="{ backgroundImage: `url(${row.image})` }"
          ></div>
          <span v-else class="material-symbols-outlined text-gray-400">image</span>
        </div>
      </template>

      <!-- SKU -->
      <template #cell-sku="{ row }">
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ row.sku }}
        </span>
      </template>

      <!-- Nombre -->
      <template #cell-name="{ row }">
        <router-link
          :to="{ name: 'inventory-detail', params: { id: row.id } }"
          class="text-sm font-bold text-gray-900 dark:text-white hover:text-primary transition-colors"
        >
          {{ row.name }}
        </router-link>
      </template>

      <!-- Categoría -->
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

      <!-- Precio -->
      <template #cell-price="{ row }">
        <span class="text-sm font-bold text-gray-900 dark:text-white">
          S/. {{ row.price.toFixed(2) }}
        </span>
      </template>

      <!-- Stock -->
      <template #cell-stock="{ row }">
        <span
          :class="[
            'inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold border',
            getStockClass(row.stock)
          ]"
        >
          <span :class="['size-2 rounded-full mr-2', getStockDotClass(row.stock)]"></span>
          {{ row.stock }} Unidades ({{ getStockLabel(row.stock) }})
        </span>
      </template>

      <!-- Acciones -->
      <template #cell-actions="{ row }">
        <div class="flex items-center justify-center gap-1">
          <button
            @click="goToDetail(row.id)"
            class="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
            title="Ver Detalle"
          >
            <span class="material-symbols-outlined text-xl">visibility</span>
          </button>
          <button
            @click="goToEdit(row.id)"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import BaseButton from '@/components/common/BaseButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import TableFilters from '@/components/common/TableFilters.vue'
import { createTable, createFilters } from '@/utils/TableBuilder'
import { useInventoryStore } from '@/stores/inventory'

const router = useRouter()
const inventoryStore = useInventoryStore()
const { products } = storeToRefs(inventoryStore)

// Configuración de tabla
const tableConfig = createTable()
  .addColumn('thumbnail', 'Miniatura')
  .addColumn('sku', 'SKU')
  .addColumn('name', 'Nombre del Producto')
  .addColumn('category', 'Categoría')
  .addColumn('price', 'Precio Venta')
  .addColumn('stock', 'Estado Stock')
  .addColumn('actions', 'Acciones', 'center')
  .setPagination(10)
  .setEmptyMessage('No hay productos registrados', 'inventory_2')
  .build()

// Configuración de filtros
const filtersConfig = createFilters()
  .setSearch('Buscar por SKU, nombre de producto...')
  .addQuickFilter('all', 'Todos')
  .addQuickFilter('clothing', 'Ropa')
  .addQuickFilter('footwear', 'Calzado')
  .addSelectFilter('stock', 'Rango de Stock', [
    { value: 'out', label: 'Sin Stock (0 unidades)' },
    { value: 'low', label: 'Stock Bajo (< 10 unidades)' },
    { value: 'ok', label: 'Stock OK (> 10 unidades)' }
  ], 'Todos los niveles')
  .addSelectFilter('priceRange', 'Rango de Precio', [
    { value: '0-50', label: 'S/ 0 - S/ 50' },
    { value: '50-200', label: 'S/ 50 - S/ 200' },
    { value: '200-500', label: 'S/ 200 - S/ 500' },
    { value: '500+', label: 'S/ 500+' }
  ], 'Cualquier Precio')
  .build()

// Estado
const filters = ref({
  search: '',
  quickFilter: 'all',
  advanced: {}
})

const pagination = ref({
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 1
})


// Productos filtrados y paginados
const paginatedProducts = computed(() => {
  const filtered = inventoryStore.getFilteredProducts(filters.value)
  
  pagination.value.totalItems = filtered.length
  pagination.value.totalPages = Math.ceil(filtered.length / pagination.value.itemsPerPage)

  const start = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage
  const end = start + pagination.value.itemsPerPage
  
  return filtered.slice(start, end)
})

// Handlers
const handleQuickFilter = (value) => {
  filters.value.quickFilter = value
  pagination.value.currentPage = 1
}

const handleFilterChange = ({ key, value }) => {
  filters.value.advanced[key] = value
  pagination.value.currentPage = 1
}

const clearFilters = () => {
  filters.value.search = ''
  filters.value.quickFilter = 'all'
  filters.value.advanced = {}
  pagination.value.currentPage = 1
}

const handlePageChange = (page) => {
  pagination.value.currentPage = page
}

const goToCreate = () => {
  router.push({ name: 'inventory-create' })
}

const goToDetail = (id) => {
  router.push({ name: 'inventory-detail', params: { id } })
}

const goToEdit = (id) => {
  router.push({ name: 'inventory-edit', params: { id } })
}

const handleDelete = async (product) => {
  if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
    await inventoryStore.deleteProduct(product.id)
  }
}

// Helpers
const getStockClass = (stock) => {
  if (stock === 0) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200/50'
  if (stock < 10) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200/50'
  return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50'
}

const getStockDotClass = (stock) => {
  if (stock === 0) return 'bg-red-500'
  if (stock < 10) return 'bg-orange-500'
  return 'bg-emerald-500'
}

const getStockLabel = (stock) => {
  if (stock === 0) return 'Sin Stock'
  if (stock < 10) return 'Stock Bajo'
  return 'Stock OK'
}

// Cargar productos al montar
onMounted(async () => {
  // Solo fetch si el array está vacío (primera carga)
  if (products.value.length === 0) {
    await inventoryStore.fetchProducts()
  }
  // Si ya hay productos, NO hacer fetch (mantener los cambios locales)
})
</script>