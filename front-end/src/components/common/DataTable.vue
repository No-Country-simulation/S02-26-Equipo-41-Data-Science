<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <!-- Header -->
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest',
                column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''
              ]"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
          <tr
            v-for="(row, index) in data"
            :key="getRowKey(row, index)"
            class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-4',
                column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''
              ]"
            >
              <!-- Slot personalizado por columna -->
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :index="index"
              >
                <!-- Renderizado por defecto -->
                {{ getCellValue(row, column.key) }}
              </slot>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="!data || data.length === 0">
            <td :colspan="columns.length" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center gap-2">
                <span class="material-symbols-outlined text-4xl text-gray-300">
                  {{ emptyIcon }}
                </span>
                <p class="text-gray-500 font-medium">{{ emptyMessage }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div
      v-if="showPagination && data && data.length > 0"
      class="px-6 py-5 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between border-t border-gray-200 dark:border-gray-800"
    >
      <!-- Info de paginación -->
      <span class="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight">
        {{ paginationText }}
      </span>

      <!-- Controles de paginación -->
      <div class="flex gap-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="size-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all shadow-sm"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>

        <!-- Páginas -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'size-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm',
            page === currentPage
              ? 'border border-primary bg-primary text-white'
              : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="size-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all shadow-sm"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Columnas de la tabla
  columns: {
    type: Array,
    required: true
    // Formato: [{ key: 'name', label: 'Nombre', align: 'left' }]
  },
  // Datos a mostrar
  data: {
    type: Array,
    required: true
  },
  // Key única para cada fila
  rowKey: {
    type: String,
    default: 'id'
  },
  // Paginación
  showPagination: {
    type: Boolean,
    default: true
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  totalItems: {
    type: Number,
    default: 0
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  // Empty state
  emptyMessage: {
    type: String,
    default: 'No hay datos para mostrar'
  },
  emptyIcon: {
    type: String,
    default: 'inbox'
  }
})

const emit = defineEmits(['page-change'])

// Obtener valor de una celda usando notación de punto
const getCellValue = (row, key) => {
  return key.split('.').reduce((obj, k) => obj?.[k], row)
}

// Obtener key única de la fila
const getRowKey = (row, index) => {
  return row[props.rowKey] || index
}

// Texto de paginación
const paginationText = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage + 1
  const end = Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
  return `Mostrando ${start}-${end} de ${props.totalItems} ${props.totalItems === 1 ? 'item' : 'items'}`
})

// Páginas visibles en la paginación
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  
  if (props.totalPages <= maxVisible) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Lógica para mostrar páginas cercanas a la actual
    let start = Math.max(1, props.currentPage - 2)
    let end = Math.min(props.totalPages, props.currentPage + 2)
    
    if (props.currentPage <= 3) {
      end = maxVisible
    }
    if (props.currentPage >= props.totalPages - 2) {
      start = props.totalPages - maxVisible + 1
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

// Cambiar de página
const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>