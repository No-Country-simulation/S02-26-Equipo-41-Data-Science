<template>
  <div class="max-w-6xl mx-auto px-8 pb-8">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Contenido del producto -->
    <div v-else-if="product" class="space-y-6">
      <BaseBreadcrumb :items="breadcrumbItems" />
      <!-- Header con acciones -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {{ product.name }}
          </h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
            SKU: {{ product.sku }}
          </p>
        </div>

        <div class="flex gap-3">
          <BaseButton
            variant="secondary"
            copy
            icon-left="edit"
            @click="goToEdit"
          >
            Editar
          </BaseButton>
          <BaseButton
            variant="danger"
            copy
            icon-left="delete"
            @click="handleDelete"
          >
            Eliminar
          </BaseButton>
        </div>
      </div>

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

      <!-- Grid de información -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Imagen principal -->
        <div class="lg:col-span-1">
          <div class="card p-0 overflow-hidden">
            <div class="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="material-symbols-outlined text-6xl text-gray-400">
                image
              </span>
            </div>
          </div>

          <!-- Badge de stock -->
          <div class="mt-4">
            <span
              :class="[
                'inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold w-full justify-center',
                getStockClass(product.stock)
              ]"
            >
              <span :class="['size-2 rounded-full mr-2', getStockDotClass(product.stock)]"></span>
              {{ getStockLabel(product.stock) }}
            </span>
          </div>
        </div>

        <!-- Información detallada -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Card: Información General -->
          <div class="card">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Información General
            </h3>
            
            <dl class="grid grid-cols-2 gap-4">
              <div>
                <dt class="text-xs text-gray-500 font-semibold uppercase">Categoría</dt>
                <dd class="mt-1">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black uppercase',
                      product.category === 'Calzado'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                    ]"
                  >
                    {{ product.category }}
                  </span>
                </dd>
              </div>

              <div v-if="product.brand">
                <dt class="text-xs text-gray-500 font-semibold uppercase">Marca</dt>
                <dd class="mt-1 text-gray-900 dark:text-white font-medium">
                  {{ product.brand }}
                </dd>
              </div>

              <div>
                <dt class="text-xs text-gray-500 font-semibold uppercase">Stock Actual</dt>
                <dd class="mt-1 text-2xl font-black text-gray-900 dark:text-white">
                  {{ product.stock }} unidades
                </dd>
              </div>

              <div>
                <dt class="text-xs text-gray-500 font-semibold uppercase">Valor en Stock</dt>
                <dd class="mt-1 text-2xl font-black text-primary">
                  S/. {{ (product.price * product.stock).toFixed(2) }}
                </dd>
              </div>
            </dl>

            <div v-if="product.description" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <dt class="text-xs text-gray-500 font-semibold uppercase mb-2">Descripción</dt>
              <dd class="text-gray-700 dark:text-gray-300">
                {{ product.description }}
              </dd>
            </div>
          </div>

          <!-- Card: Precios -->
          <div class="card">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Información de Precios
            </h3>
            
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <dt class="text-xs text-gray-500 font-semibold uppercase">Precio Venta</dt>
                <dd class="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                  S/. {{ product.price.toFixed(2) }}
                </dd>
              </div>

              <div v-if="product.cost" class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <dt class="text-xs text-gray-500 font-semibold uppercase">Costo</dt>
                <dd class="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                  S/. {{ product.cost.toFixed(2) }}
                </dd>
              </div>

              <div v-if="product.cost" class="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                <dt class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                  Margen
                </dt>
                <dd class="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {{ ((product.price - product.cost) / product.cost * 100).toFixed(1) }}%
                </dd>
              </div>
            </div>
          </div>

          <!-- Card: Historial (placeholder) -->
          <div class="card">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Movimientos Recientes
            </h3>
            
            <div class="text-center py-8 text-gray-500">
              <span class="material-symbols-outlined text-4xl mb-2">
                history
              </span>
              <p>No hay movimientos registrados</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="text-center py-12">
      <span class="material-symbols-outlined text-6xl text-red-500 mb-4">
        error
      </span>
      <p class="text-gray-500 text-lg">Producto no encontrado</p>
      <BaseButton
        variant="primary"
        class="mt-4"
        @click="$router.push({ name: 'inventory-list' })"
      >
        Volver al Listado
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { toast } from '@/utils/toast'
import { useInventoryStore } from '@/stores/inventory'
import { inventoryBreadcrumbs } from '@/utils/breadcrumbs'

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
const showDeleteModal = ref(false)

// Cargar producto
onMounted(async () => {
  loading.value = true
  try {
    product.value = await inventoryStore.getProductById(props.id)
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    loading.value = false
  }
})

// Handlers
const goToEdit = () => {
  router.push({ name: 'inventory-edit', params: { id: props.id } })
}

const handleDelete = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  showDeleteModal.value = false
  await inventoryStore.deleteProduct(props.id)
  router.push({ name: 'inventory-list' })
  toast.success('Producto eliminado correctamente')
}
// Helpers
const getStockClass = (stock) => {
  if (stock === 0) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  if (stock < 10) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
  return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
}

const getStockDotClass = (stock) => {
  if (stock === 0) return 'bg-red-500'
  if (stock < 10) return 'bg-orange-500'
  return 'bg-emerald-500'
}

const getStockLabel = (stock) => {
  if (stock === 0) return 'Sin Stock'
  if (stock < 10) return `Stock Bajo (${stock} unidades)`
  return `Stock OK (${stock} unidades)`
}

</script>