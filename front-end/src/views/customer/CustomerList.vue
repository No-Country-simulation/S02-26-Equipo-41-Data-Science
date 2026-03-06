<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header con Breadcrumb -->
    <div class="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <BaseBreadcrumb :items="breadcrumbItems" />
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mt-2">Clientes</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">
          Gestión de clientes del negocio
        </p>
      </div>
    </div>

    <!-- Filtros -->
    <TableFilters
      v-model:search-query="searchQuery"
      :quick-filters="quickFilters"
      :active-quick-filter="activeQuickFilter"
      :advanced-filters="advancedFilters"
      :filter-values="advancedFilterValues"
      search-placeholder="Buscar por nombre o email..."
      @quick-filter="handleQuickFilter"
      @filter-change="handleAdvancedFilterChange"
      @clear-filters="handleClearFilters"
    />

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Tabla -->
    <DataTable
      v-else
      :columns="tableColumns"
      :data="paginatedClients"
      :show-pagination="true"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="filteredClients.length"
      :items-per-page="itemsPerPage"
      empty-message="No se encontraron clientes"
      @page-change="handlePageChange"
    >
      <!-- Slot: Nombre -->
      <template #cell-name="{ row }">
        <div class="flex items-center">
          <div :class="['w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mr-3', row.avatarColor]">
            {{ row.avatar }}
          </div>
          <div>
            <div class="text-sm font-semibold text-slate-900 dark:text-white">
              {{ row.name }}
            </div>
            <div class="text-xs text-slate-500">
              {{ row.email }}
            </div>
          </div>
        </div>
      </template>

      <!-- Slot: Tipo -->
      <template #cell-type="{ row }">
        <span
          :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getClientTypeBadge(row.type)
          ]"
        >
          {{ row.type }}
        </span>
      </template>

      <!-- Slot: Edad -->
      <template #cell-age="{ row }">
        <span class="text-sm text-center block">{{ row.age }}</span>
      </template>

      <!-- Slot: Género -->
      <template #cell-gender="{ row }">
        <span class="text-sm">{{ row.gender }}</span>
      </template>

      <!-- Slot: Ubicación -->
      <template #cell-location="{ row }">
        <div class="flex items-center gap-1">
          <span class="material-symbols-outlined text-xs text-slate-400">place</span>
          <span class="text-sm">{{ row.location }}</span>
        </div>
      </template>

      <!-- Slot: Total Compras -->
      <template #cell-totalPurchases="{ row }">
        <span class="text-sm font-medium">
          S/ {{ formatCurrency(row.totalPurchases) }}
        </span>
      </template>

      <!-- Slot: Última Compra -->
      <template #cell-lastPurchase="{ row }">
        <span class="text-sm text-slate-500">
          {{ row.lastPurchaseLabel }}
        </span>
      </template>

      <!-- Slot: Acciones -->
      <template #cell-actions="{ row }">
        <div class="flex justify-center gap-2">
          <button
            @click="handleView(row)"
            class="p-1.5 text-slate-400 hover:text-primary transition-colors"
            title="Ver detalle"
          >
            <span class="material-symbols-outlined text-lg">visibility</span>
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
import { useClientsStore } from '@/stores/customers'

const router = useRouter()
const clientsStore = useClientsStore()

const { loading } = storeToRefs(clientsStore)

// ==========================================
// BREADCRUMBS
// ==========================================
const breadcrumbItems = [
  { label: 'Clientes', to: '/clientes' },
  { label: 'Listado', to: '/clientes', active: true }
]

// ==========================================
// FILTROS
// ==========================================
const searchQuery = ref('')
const activeQuickFilter = ref('all')
const advancedFilterValues = ref({
  age: '',
  gender: '',
  location: ''
})

// Filtros rápidos
const quickFilters = [
  { label: 'Todos', value: 'all' },
  { label: 'Minorista', value: 'Minorista' },
  { label: 'Mayorista', value: 'Mayorista' },
  { label: 'Premium', value: 'Premium' }
]

// Filtros avanzados
const advancedFilters = [
  {
    key: 'ageRange',
    label: 'Rango de Edad',
    type: 'select',
    placeholder: 'Cualquier Edad',
    options: [
      { label: '18-25', value: '18-25' },
      { label: '26-40', value: '26-40' },
      { label: '41+', value: '41+' }
    ]
  },
  {
    key: 'gender',
    label: 'Género',
    type: 'select',
    placeholder: 'Cualquier Género',
    options: [
      { label: 'Masculino', value: 'Masculino' },
      { label: 'Femenino', value: 'Femenino' },
      { label: 'Otro', value: 'Otro' }
    ]
  },
  {
    key: 'location',
    label: 'Ubicación',
    type: 'select',
    placeholder: 'Cualquier Ubicación',
    options: [
      { label: 'Lima', value: 'Lima' },
      { label: 'Arequipa', value: 'Arequipa' },
      { label: 'Trujillo', value: 'Trujillo' },
      { label: 'Cusco', value: 'Cusco' }
    ]
  }  
]

// ==========================================
// TABLA
// ==========================================
const tableColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'age', label: 'Edad', align: 'center' },
  { key: 'gender', label: 'Género' },
  { key: 'location', label: 'Ubicación' },
  { key: 'totalPurchases', label: 'Total Compras' },
  { key: 'lastPurchase', label: 'Última Compra' },
  { key: 'actions', label: 'Acciones', align: 'right' }
]

// ==========================================
// PAGINACIÓN
// ==========================================
const currentPage = ref(1)
const itemsPerPage = 10

const filteredClients = computed(() => {
  return clientsStore.getFilteredClients({
    search: searchQuery.value,
    quickFilter: activeQuickFilter.value,
    advanced: advancedFilterValues.value
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredClients.value.length / itemsPerPage)
})

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredClients.value.slice(start, end)
})

// ==========================================
// HANDLERS
// ==========================================
const handleView = (client) => {
  router.push({ name: 'customer-detail', params: { id: client.id } })
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
    age: '',
    gender: '',
    location: '',
    searchQuery: '',
    quickFilter: 'all'
  }
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

// ==========================================
// UTILITIES
// ==========================================
const getClientTypeBadge = (type) => {
  const badges = {
    'Mayorista': 'bg-primary/10 text-primary',
    'Minorista': 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    'Premium': 'bg-amber-100 text-amber-700'
  }
  return badges[type] || badges['Minorista']
}

const formatCurrency = (value) => {
  return value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ==========================================
// LIFECYCLE
// ==========================================
onMounted(async () => {
  if (clientsStore.clients.length === 0) {
    await clientsStore.fetchClients()
  }
})
</script>