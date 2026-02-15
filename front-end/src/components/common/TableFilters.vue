<template>
  <div class="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6">
    <div class="flex flex-col gap-5">
      <!-- Primera fila: Búsqueda + Filtros rápidos -->
      <div class="flex flex-col lg:flex-row gap-4 items-center">
        <!-- Barra de búsqueda -->
        <div v-if="showSearch" class="relative flex-1 w-full">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
            :placeholder="searchPlaceholder"
            type="text"
          />
        </div>

        <!-- Filtros rápidos (tabs/buttons) -->
        <div
          v-if="quickFilters && quickFilters.length > 0"
          class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-full lg:w-auto"
        >
          <button
            v-for="filter in quickFilters"
            :key="filter.value"
            @click="$emit('quick-filter', filter.value)"
            :class="[
              'px-5 py-2 rounded-md text-sm font-bold transition-all',
              activeQuickFilter === filter.value
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white'
                : 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-700'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>

        <!-- Botón de más filtros -->
        <button
          v-if="showMoreFiltersButton"
          @click="toggleAdvancedFilters"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <span class="material-symbols-outlined text-lg">filter_list</span>
          Más Filtros
        </button>
      </div>

      <!-- Segunda fila: Filtros avanzados (opcional) -->
      <div
        v-if="showAdvancedFilters && advancedFilters && advancedFilters.length > 0"
        class="pt-5 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-6"
      >
        <!-- Filtros dinámicos -->
        <div
          v-for="filter in advancedFilters"
          :key="filter.key"
          class="flex flex-col gap-1.5 min-w-[220px]"
        >
          <label class="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
            {{ filter.label }}
          </label>

          <!-- Select -->
          <select
            v-if="filter.type === 'select'"
            :value="filterValues[filter.key]"
            @change="handleFilterChange(filter.key, $event.target.value)"
            class="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm py-2 focus:ring-primary/20 focus:border-primary font-medium"
          >
            <option value="">{{ filter.placeholder || 'Todos' }}</option>
            <option
              v-for="option in filter.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- Input de texto -->
          <input
            v-else-if="filter.type === 'text'"
            :value="filterValues[filter.key]"
            @input="handleFilterChange(filter.key, $event.target.value)"
            :placeholder="filter.placeholder"
            class="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm py-2 px-3 focus:ring-primary/20 focus:border-primary font-medium"
            type="text"
          />

          <!-- Input numérico -->
          <input
            v-else-if="filter.type === 'number'"
            :value="filterValues[filter.key]"
            @input="handleFilterChange(filter.key, $event.target.value)"
            :placeholder="filter.placeholder"
            class="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm py-2 px-3 focus:ring-primary/20 focus:border-primary font-medium"
            type="number"
          />

          <!-- Date picker -->
          <input
            v-else-if="filter.type === 'date'"
            :value="filterValues[filter.key]"
            @input="handleFilterChange(filter.key, $event.target.value)"
            class="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm py-2 px-3 focus:ring-primary/20 focus:border-primary font-medium"
            type="date"
          />
        </div>

        <!-- Botón limpiar filtros -->
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="px-5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  // Búsqueda
  showSearch: {
    type: Boolean,
    default: true
  },
  searchQuery: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: 'Buscar...'
  },
  // Filtros rápidos (tabs)
  quickFilters: {
    type: Array,
    default: () => []
    // Formato: [{ label: 'Todos', value: 'all' }]
  },
  activeQuickFilter: {
    type: String,
    default: ''
  },
  // Filtros avanzados
  advancedFilters: {
    type: Array,
    default: () => []
    // Formato: [{ key: 'category', label: 'Categoría', type: 'select', options: [...] }]
  },
  filterValues: {
    type: Object,
    default: () => ({})
  },
  showMoreFiltersButton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'update:searchQuery',
  'quick-filter',
  'filter-change',
  'clear-filters'
])

const showAdvancedFilters = ref(false)

const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value
}

const handleFilterChange = (key, value) => {
  emit('filter-change', { key, value })
}

const clearFilters = () => {
  emit('clear-filters')
}
</script>