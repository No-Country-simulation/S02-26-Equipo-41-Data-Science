<template>
  <div class="max-w-[1280px] mx-auto w-full p-4 lg:p-10 space-y-6">
    <!-- Breadcrumb -->
    <BaseBreadcrumb :items="breadcrumbItems" />

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Content -->
    <div v-else-if="product" class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div class="space-y-2">
          <!-- Badges -->
          <div class="flex flex-wrap items-center gap-3">
            <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              {{ product.category }}
            </span>
            <span 
              :class="[
                'px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1',
                getStockBadgeClass(product.stock)
              ]"
            >
              <span :class="['size-1.5 rounded-full', getStockDotClass(product.stock)]"></span>
              {{ getStockLabel(product.stock) }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ product.name }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 font-medium">
            Visualizando información técnica y niveles de existencia
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap items-center gap-3">
          <BaseButton
            variant="primary"
            icon-left="inventory_2"
            copy
            class="flex-1 md:flex-none shadow-lg shadow-primary/20"
            @click="goToAdjustStock"
          >
            Ajustar Stock
          </BaseButton>
          <BaseButton
            variant="secondary"
            icon-left="edit"
            copy
            class="flex-1 md:flex-none"
            @click="goToEdit"
          >
            Editar
          </BaseButton>
          
          <!-- Dropdown menu -->
          <div class="relative" ref="dropdownRef">
            <button
              @click="showDropdown = !showDropdown"
              class="flex items-center justify-center gap-2 px-4 h-12 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span class="material-symbols-outlined !text-2xl">more_vert</span>
            </button>

            <!-- Dropdown content -->
            <Transition name="dropdown">
              <div
                v-if="showDropdown"
                class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl z-20"
              >
                <div class="p-2 space-y-1">
                  <button
                    class="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span class="material-symbols-outlined text-gray-500 !text-xl">print</span>
                    Imprimir Etiqueta
                  </button>
                  <div class="h-px bg-gray-200 dark:bg-slate-800 my-1"></div>
                  <button
                    @click="handleDeactivate"
                    class="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <span class="material-symbols-outlined !text-xl">block</span>
                    Desactivar Producto
                  </button>
                  <button
                    @click="handleDelete"
                    class="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <span class="material-symbols-outlined !text-xl">delete</span>
                    Eliminar Permanentemente
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Grid de contenido -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Sidebar izquierdo -->
        <div class="lg:col-span-4 space-y-6">
          <!-- Imagen del producto -->
          <div class="card p-4">
            <div class="w-full aspect-square bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-slate-800 relative">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div v-else class="flex flex-col items-center gap-2 opacity-10">
                <span class="material-symbols-outlined !text-6xl text-gray-500">image</span>
              </div>
            </div>
          </div>

          <!-- Estado de inventario -->
          <StatsCard 
            title="Estado de Inventario"
            badge-icon="analytics"
          >
            <div class="space-y-6">
              <!-- Stock actual y mínimo -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-bold text-gray-500 uppercase mb-1">Stock Actual</p>
                  <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-black text-primary">{{ product.stock }}</span>
                    <span class="text-sm font-bold text-gray-500">und.</span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs font-bold text-gray-500 uppercase mb-1">Mínimo</p>
                  <div class="flex items-baseline justify-end gap-1">
                    <span class="text-2xl font-bold text-slate-900 dark:text-white">
                      {{ product.minStock || 15 }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Barra de progreso -->
              <div class="space-y-2">
                <div class="flex justify-between text-xs font-bold">
                  <span class="text-gray-500">Capacidad Objetivo: 100</span>
                  <span class="text-primary">{{ stockPercentage }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div 
                    class="bg-primary h-full rounded-full transition-all duration-500"
                    :style="{ width: `${stockPercentage}%` }"
                  ></div>
                </div>
                <!-- Umbral indicator -->
                <div class="relative w-full h-1">
                  <div 
                    class="absolute h-2 w-0.5 bg-red-500 -top-1.5" 
                    :style="{ left: '15%' }"
                    title="Punto de reorden"
                  ></div>
                  <span 
                    class="absolute text-[10px] font-bold text-red-500 mt-2"
                    :style="{ left: '15%' }"
                  >
                    Umbral
                  </span>
                </div>
              </div>

              <!-- Alert box -->
              <div 
                :class="[
                  'flex items-start gap-3 p-3 rounded-lg border',
                  stockAlertClass
                ]"
              >
                <span class="material-symbols-outlined !text-xl mt-0.5">
                  {{ stockAlertIcon }}
                </span>
                <div>
                  <p class="text-xs font-bold">{{ stockAlertTitle }}</p>
                  <p class="text-[10px] leading-tight mt-0.5 opacity-80">
                    {{ stockAlertMessage }}
                  </p>
                </div>
              </div>
            </div>
          </StatsCard>
        </div>

        <!-- Contenido principal -->
        <div class="lg:col-span-8 space-y-6">
          <!-- Información General -->
          <StatsCard 
            title="Información General"
            icon="article"
            header-background
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <!-- SKU -->
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  SKU del Producto
                </label>
                <p class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {{ product.sku }}
                  <button 
                    @click="copySKU"
                    class="text-gray-500 hover:text-primary"
                  >
                    <span class="material-symbols-outlined !text-sm">content_copy</span>
                  </button>
                </p>
              </div>

              <!-- Categoría -->
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Categoría
                </label>
                <p class="text-lg font-bold text-slate-900 dark:text-white">
                  {{ product.category }}
                </p>
              </div>

              <!-- Precio de Venta -->
              <div class="space-y-1 pt-4 border-t border-gray-200 dark:border-slate-800">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Precio de Venta
                </label>
                <p class="text-3xl font-black text-green-600 dark:text-green-400">
                  S/ {{ product.price.toFixed(2) }}
                </p>
              </div>

              <!-- Precio de Costo -->
              <div 
                v-if="product.cost"
                class="space-y-1 pt-4 border-t border-gray-200 dark:border-slate-800"
              >
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Precio de Costo
                </label>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">
                  S/ {{ product.cost.toFixed(2) }}
                </p>
                <p class="text-[10px] text-green-600 font-bold uppercase tracking-tight">
                  Margen: {{ marginPercentage }}%
                </p>
              </div>

              <!-- Estado -->
              <div class="space-y-1 pt-4 border-t border-gray-200 dark:border-slate-800">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Estado de Visibilidad
                </label>
                <div class="flex items-center gap-2 mt-1">
                  <span class="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                  <span class="text-sm font-semibold text-slate-900 dark:text-white">
                    Activo en Catálogo
                  </span>
                </div>
              </div>

              <!-- Fecha de creación -->
              <div class="space-y-1 pt-4 border-t border-gray-200 dark:border-slate-800">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Fecha de Creación
                </label>
                <p class="text-sm font-medium text-slate-900 dark:text-white mt-1">
                  {{ formatDate(product.createdAt) }}
                </p>
              </div>

              <!-- Descripción -->
              <div 
                v-if="product.description"
                class="space-y-1 md:col-span-2 pt-4 border-t border-gray-200 dark:border-slate-800"
              >
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Descripción del Producto
                </label>
                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-2 max-w-2xl">
                  {{ product.description }}
                </p>
              </div>
            </div>
          </StatsCard>

          <!-- Atributos y Variantes -->
          <StatsCard 
            title="Atributos y Variantes"
            header-background
          >
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <!-- Marca -->
              <div 
                v-if="product.brand"
                class="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
              >
                <p class="text-[10px] font-bold text-gray-500 uppercase">Marca</p>
                <p class="text-sm font-bold text-slate-900 dark:text-white">
                  {{ product.brand }}
                </p>
              </div>

              <!-- Stock -->
              <div class="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                <p class="text-[10px] font-bold text-gray-500 uppercase">Stock</p>
                <p class="text-sm font-bold text-slate-900 dark:text-white">
                  {{ product.stock }} unidades
                </p>
              </div>

              <!-- Valor en inventario -->
              <div class="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                <p class="text-[10px] font-bold text-gray-500 uppercase">Valor Total</p>
                <p class="text-sm font-bold text-slate-900 dark:text-white">
                  S/ {{ (product.price * product.stock).toFixed(2) }}
                </p>
              </div>

              <!-- Estado -->
              <div class="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                <p class="text-[10px] font-bold text-gray-500 uppercase">Estado</p>
                <p class="text-sm font-bold text-slate-900 dark:text-white">
                  {{ product.status === 'active' ? 'Activo' : 'Inactivo' }}
                </p>
              </div>
            </div>
          </StatsCard>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="text-center py-12">
      <span class="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
      <p class="text-gray-500 text-lg">Producto no encontrado</p>
      <BaseButton
        variant="primary"
        copy
        class="mt-4"
        @click="$router.push({ name: 'inventory-list' })"
      >
        Volver al Listado
      </BaseButton>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <BaseModal
        :show="showDeleteModal"
        type="warning"
        title="¿Seguro quiere borrar este producto?"
        description="Esta acción no se puede deshacer. El producto será eliminado"
        button1Title="Cancelar"
        button2Title="Eliminar"
        @action1="showDeleteModal = false" 
        @action2="confirmDelete"
      />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import { useInventoryStore } from '@/stores/inventory'
import { inventoryBreadcrumbs } from '@/utils/breadcrumbs'
import { toast } from '@/utils/toast'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const router = useRouter()
const route = useRoute()
const inventoryStore = useInventoryStore()
const breadcrumbItems = inventoryBreadcrumbs.detail(props.id)

const product = ref(null)
const loading = ref(true)
const showDropdown = ref(false)
const dropdownRef = ref(null)

// Modales
const showDeleteModal = ref(false)
const errorMessage = ref('')

// Computed
const stockPercentage = computed(() => {
  if (!product.value) return 0
  return Math.min(Math.round((product.value.stock / 100) * 100), 100)
})

const marginPercentage = computed(() => {
  if (!product.value?.cost || !product.value?.price) return 0
  return Math.round(((product.value.price - product.value.cost) / product.value.cost) * 100)
})

const stockAlertClass = computed(() => {
  if (!product.value) return ''
  const stock = product.value.stock
  const minStock = product.value.minStock || 15
  
  if (stock === 0) {
    return 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/20'
  } else if (stock < minStock) {
    return 'bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900/20'
  }
  return 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/20'
})

const stockAlertIcon = computed(() => {
  if (!product.value) return 'info'
  const stock = product.value.stock
  const minStock = product.value.minStock || 15
  
  if (stock === 0) return 'error'
  if (stock < minStock) return 'warning'
  return 'check_circle'
})

const stockAlertTitle = computed(() => {
  if (!product.value) return ''
  const stock = product.value.stock
  const minStock = product.value.minStock || 15
  
  if (stock === 0) return 'Sin Stock'
  if (stock < minStock) return 'Stock Bajo'
  return 'Nivel Saludable'
})

const stockAlertMessage = computed(() => {
  if (!product.value) return ''
  const stock = product.value.stock
  const minStock = product.value.minStock || 15
  
  if (stock === 0) {
    return 'El producto no tiene unidades disponibles. Realiza un ingreso de stock.'
  } else if (stock < minStock) {
    const diff = minStock - stock
    return `El stock está ${diff} ${diff === 1 ? 'unidad' : 'unidades'} por debajo del mínimo configurado.`
  }
  const diff = stock - minStock
  return `El stock está ${diff} ${diff === 1 ? 'unidad' : 'unidades'} por encima del mínimo configurado.`
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'No disponible'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
}

const copySKU = async () => {
  if (product.value?.sku) {
    try {
      await navigator.clipboard.writeText(product.value.sku)
      // Aquí podrías mostrar un toast notification
      console.log('SKU copiado al portapapeles')
    } catch (err) {
      console.error('Error al copiar SKU:', err)
    }
  }
}

const getStockBadgeClass = (stock) => {
  if (stock === 0) {
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  } else if (stock < 10) {
    return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
  }
  return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
}

const getStockDotClass = (stock) => {
  if (stock === 0) return 'bg-red-500'
  if (stock < 10) return 'bg-orange-500'
  return 'bg-green-500'
}

const getStockLabel = (stock) => {
  if (stock === 0) return 'Sin Stock'
  if (stock < 10) return 'Stock Bajo'
  return 'Stock OK'
}

const goToEdit = () => {
  router.push({ name: 'inventory-edit', params: { id: props.id } })
}

const goToAdjustStock = () => {
  router.push({ name: 'inventory-adjust-stock', params: { id: props.id } })
}

const handleDeactivate = () => {
  showDropdown.value = false
  // TODO: Implementar lógica de desactivación
  console.log('Desactivar producto')
}

const handleDelete = () => {
  showDropdown.value = false
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await inventoryStore.deleteProduct(props.id)
    showDeleteModal.value = false
    toast.success('Producto eliminado correctamente')
    router.push({ name: 'inventory-list' })
  } catch (error) {
    console.error('Error deleting product:', error)
    showDeleteModal.value = false
    errorMessage.value = error.message || 'No se pudo eliminar el producto.'
    toast.error(errorMessage.value)
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    product.value = await inventoryStore.getProductById(props.id)
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    loading.value = false
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>