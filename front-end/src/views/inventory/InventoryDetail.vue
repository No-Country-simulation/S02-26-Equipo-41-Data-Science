<template>
  <div class="max-w-[1280px] mx-auto p-4 lg:p-10 space-y-8">
    <!-- Header con navegación -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <BaseBreadcrumb :items="breadcrumbItems" />

      <!-- Menú de acciones -->
      <div class="flex items-center gap-3">
        <BaseButton
          variant="primary"
          icon-left="edit"
          @click="handleEdit"
        >
          Editar Producto
        </BaseButton>

        <div class="relative" @mouseleave="showActions = false">
          <button
            @mouseenter="showActions = true"
            class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span class="material-symbols-outlined !text-xl">settings</span>
            Más acciones
            <span class="material-symbols-outlined !text-sm">expand_more</span>
          </button>

          <!-- Dropdown -->
          <div
            v-if="showActions"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 py-2"
          >
            <button
              class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
            >
              <span class="material-symbols-outlined !text-lg">print</span>
              Imprimir Etiqueta
            </button>
            <button
              @click="handleDelete"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 font-semibold"
            >
              <span class="material-symbols-outlined !text-lg text-red-500">delete</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
      <BaseButton @click="goBack" class="mt-4">Volver al inventario</BaseButton>
    </div>

    <!-- Contenido principal -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Galería de imágenes -->
      <div class="lg:col-span-6 space-y-4">
        <!-- Imagen principal -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden aspect-square shadow-sm flex items-center justify-center relative">
          <div
            v-if="product.imagen_url"
            class="absolute inset-0 bg-center bg-no-repeat bg-cover"
            :style="`background-image: url('${product.imagen_url}')`"
          ></div>
          <div
            v-else
            class="flex items-center justify-center text-gray-300"
          >
            <span class="material-symbols-outlined text-8xl">image</span>
          </div>

          <!-- Badge de estado -->
          <div
            v-if="product.stock_status !== 'out'"
            class="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 text-slate-800"
          >
            {{ getStockLabel(product.stock_status) }}
          </div>
        </div>

        <!-- Miniaturas (placeholder) -->
        <div class="flex gap-3 overflow-x-auto pb-2">
          <div
            class="size-20 flex-shrink-0 rounded-lg border-2 border-primary overflow-hidden cursor-pointer"
            :style="product.imagen_url ? `background-image: url('${product.imagen_url}'); background-size: cover; background-position: center;` : ''"
          >
            <div v-if="!product.imagen_url" class="w-full h-full bg-slate-100 flex items-center justify-center">
              <span class="material-symbols-outlined text-slate-400">image</span>
            </div>
          </div>
          <div
            v-for="i in 3"
            :key="i"
            class="size-20 flex-shrink-0 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer hover:border-primary transition-colors bg-slate-100 flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-slate-400">image</span>
          </div>
        </div>
      </div>

      <!-- Información del producto -->
      <div class="lg:col-span-6 flex flex-col gap-6">
        <!-- Título y SKU -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded uppercase tracking-wider">
              {{ product.categoria }} / {{ product.marca }}
            </span>
          </div>
          <h1 class="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {{ product.nombreproducto }}
          </h1>
          <div class="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span>SKU Base: <span class="text-slate-900 dark:text-slate-300">{{ product.sku_base }}</span></span>
            <span class="size-1 rounded-full bg-slate-300"></span>
            <span class="flex items-center gap-1 text-green-600">
              <span class="material-symbols-outlined !text-lg">verified</span>
              En Catálogo
            </span>
          </div>
        </div>

        <hr class="border-slate-200 dark:border-slate-800" />

        <!-- Selector de Color -->
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-500">
              Color Seleccionado: <span class="text-slate-900 dark:text-white">{{ selectedColor || 'Ninguno' }}</span>
            </label>
          </div>
          <div class="flex gap-3 flex-wrap">
            <button
              v-for="color in availableColors"
              :key="color"
              @click="selectedColor = color"
              :class="[
                'size-10 rounded-full p-0.5 transition-all',
                selectedColor === color
                  ? 'border-2 border-primary'
                  : 'border border-slate-200 dark:border-slate-700 hover:border-slate-400'
              ]"
            >
              <div
                class="w-full h-full rounded-full shadow-inner"
                :style="getColorStyle(color)"
              ></div>
            </button>
          </div>
        </div>

        <!-- Selector de Talla -->
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-500">
              {{ product.categoria === 'Calzado' ? 'Talle (EU)' : 'Talla' }}:
            </label>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="size in availableSizes"
              :key="size"
              @click="selectSize(size)"
              :disabled="!isSizeAvailable(size)"
              :class="[
                'px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
                selectedSize === size
                  ? 'border-2 border-primary bg-primary/5 text-primary'
                  : isSizeAvailable(size)
                    ? 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary'
                    : 'border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed opacity-50'
              ]"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Info de variante seleccionada -->
        <div
          v-if="selectedVariant"
          class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4"
        >
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <p class="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Variante Seleccionada
              </p>
              <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                SKU: {{ selectedVariant.sku }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-black text-slate-900 dark:text-white">
                S/ {{ parseFloat(selectedVariant.precio).toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- Stock de variante -->
          <div class="space-y-2">
            <div class="flex justify-between items-center text-xs font-bold">
              <span :class="[
                'flex items-center gap-1.5',
                selectedVariant.stock === 0
                  ? 'text-red-600 dark:text-red-400'
                  : selectedVariant.stock < selectedVariant.stockminimo
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-green-600 dark:text-green-400'
              ]">
                <span class="size-2 rounded-full animate-pulse" :class="[
                  selectedVariant.stock === 0
                    ? 'bg-red-500'
                    : selectedVariant.stock < selectedVariant.stockminimo
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                ]"></span>
                {{ selectedVariant.stock }} unidades
                {{ selectedVariant.stock === 0 ? '- Sin Stock' : selectedVariant.stock < selectedVariant.stockminimo ? '- Stock Bajo' : '- Stock OK' }}
              </span>
              <span class="text-slate-400">Umbral: {{ selectedVariant.stockminimo }} und.</span>
            </div>
            <div class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                :class="[
                  'h-full rounded-full',
                  selectedVariant.stock === 0
                    ? 'bg-red-500'
                    : selectedVariant.stock < selectedVariant.stockminimo
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                ]"
                :style="`width: ${Math.min((selectedVariant.stock / (selectedVariant.stockminimo * 2)) * 100, 100)}%`"
              ></div>
            </div>
          </div>

          <!-- Botón ajustar stock -->
          <button
            @click="handleAdjustStock"
            class="w-full h-14 bg-primary text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-3"
          >
            <span class="material-symbols-outlined !text-2xl">inventory_2</span>
            AJUSTAR STOCK
          </button>
        </div>
      </div>
    </div>

    <!-- Secciones adicionales -->
    <div v-if="product" class="grid grid-cols-1 gap-8 mt-6">
      <!-- Descripción -->
      <section 
        v-if="product.descripcion"
        class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm"
      >
        <h3 class="text-lg font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">description</span>
          Descripción del Producto
        </h3>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
          {{ product.descripcion }}
        </p>
      </section>

      <!-- Tabla de todas las variantes -->
      <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <details class="group" open>
          <summary class="px-8 py-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary !text-2xl">list_alt</span>
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">
                Ver todas las variantes ({{ variants.length }})
              </h3>
            </div>
            <span class="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">
              expand_more
            </span>
          </summary>

          <div class="border-t border-slate-200 dark:border-slate-800 overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead class="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">Color</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">Talla</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">SKU</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider text-right">Precio</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider text-right">Stock</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">Estado</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider text-center">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr
                  v-for="variant in variants"
                  :key="variant.varianteid"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/30"
                >
                  <td class="px-6 py-4 text-sm font-semibold">{{ variant.color }}</td>
                  <td class="px-6 py-4 text-sm">{{ variant.talla }}</td>
                  <td class="px-6 py-4 text-sm font-mono text-slate-500">{{ variant.sku }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-right">S/ {{ parseFloat(variant.precio).toFixed(2) }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-right" :class="[
                    variant.stock === 0 ? 'text-red-600' : variant.stock < variant.stockminimo ? 'text-orange-600' : 'text-green-600'
                  ]">
                    {{ variant.stock }}
                  </td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'px-2 py-1 rounded text-[10px] font-bold uppercase',
                      variant.stock === 0
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : variant.stock < variant.stockminimo
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    ]">
                      {{ variant.stock === 0 ? 'Sin Stock' : variant.stock < variant.stockminimo ? 'Stock Bajo' : 'En Stock' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <button
                      @click="handleAdjustStockVariant(variant)"
                      class="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
                      title="Ajuste rápido"
                    >
                      <span class="material-symbols-outlined !text-xl">edit_square</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const inventoryStore = useInventoryStore()

const loading = ref(true)
const error = ref(null)
const product = ref(null)
const showActions = ref(false)
const selectedColor = ref('')
const selectedSize = ref('')

// ==========================================
// COMPUTED
// ==========================================
const breadcrumbItems = computed(() => [
  { label: 'Inventario', to: '/inventario' },
  { 
    label: product.value?.nombreproducto || 'Detalle', 
    to: `/inventario/${route.params.id}`,
    active: true 
  }
])

// Parsear variantes desde el JSON string
const variants = computed(() => {
  if (!product.value?.variantes) return []
  
  try {
    // Si ya es un array, devolverlo directamente
    if (Array.isArray(product.value.variantes)) {
      return product.value.variantes
    }
    // Si es string JSON, parsearlo
    return JSON.parse(product.value.variantes)
  } catch (e) {
    console.error('Error parsing variants:', e)
    return []
  }
})

// Colores disponibles
const availableColors = computed(() => {
  const colors = variants.value.map(v => v.color)
  return [...new Set(colors)]
})

// Tallas disponibles para el color seleccionado
const availableSizes = computed(() => {
  if (!selectedColor.value) {
    const sizes = variants.value.map(v => v.talla)
    return [...new Set(sizes)]
  }
  
  const sizes = variants.value
    .filter(v => v.color === selectedColor.value)
    .map(v => v.talla)
  return [...new Set(sizes)]
})

// Variante seleccionada
const selectedVariant = computed(() => {
  if (!selectedColor.value || !selectedSize.value) return null
  
  return variants.value.find(v =>
    v.color === selectedColor.value && v.talla === selectedSize.value
  )
})

// ==========================================
// METHODS
// ==========================================
const isSizeAvailable = (size) => {
  if (!selectedColor.value) return false
  
  const variant = variants.value.find(v =>
    v.color === selectedColor.value && v.talla === size
  )
  
  return variant && variant.stock > 0
}

const selectSize = (size) => {
  if (isSizeAvailable(size)) {
    selectedSize.value = size
  }
}

const getColorStyle = (color) => {
  const colorMap = {
    'Rojo': 'background-color: #dc2626',
    'Azul': 'background-color: #2563eb',
    'Azul Eléctrico': 'background-color: #0ea5e9',
    'Negro': 'background-color: #1f2937',
    'Negro/Gris': 'background: linear-gradient(135deg, #1f2937 50%, #6b7280 50%)',
    'Blanco': 'background-color: #f9fafb; border: 1px solid #e5e7eb',
    'Gris': 'background-color: #6b7280',
    'Marrón': 'background-color: #92400e',
    'Verde': 'background-color: #16a34a',
    'Amarillo': 'background-color: #eab308'
  }
  
  return colorMap[color] || 'background-color: #9ca3af'
}

const getStockLabel = (status) => {
  const labels = {
    'ok': 'En Stock',
    'low': 'Stock Bajo',
    'out': 'Sin Stock'
  }
  return labels[status] || 'En Stock'
}

const handleEdit = () => {
  router.push({ name: 'inventory-edit', params: { id: route.params.id } })
}

const handleDelete = () => {
  // TODO: Implementar modal de confirmación
  console.log('Delete product:', route.params.id)
}

const handleAdjustStock = () => {
  if (!selectedVariant.value) {
    console.error('No hay variante seleccionada')
    return
  }
  
  router.push({ 
    name: 'inventory-adjust-stock', 
    params: { 
      productId: route.params.id,
      variantId: selectedVariant.value.varianteid 
    } 
  })
}

const handleAdjustStockVariant = (variant) => {
  router.push({ 
    name: 'inventory-adjust-stock', 
    params: { 
      productId: route.params.id,
      variantId: variant.varianteid 
    } 
  })
}

const goBack = () => {
  router.push({ name: 'inventory-list' })
}

// ==========================================
// LIFECYCLE
// ==========================================
onMounted(async () => {
  loading.value = true
  error.value = null
  
  try {
    const productId = parseInt(route.params.id)
    const sucursalId = 1 // TODO: Obtener del contexto/store de usuario
    
    const fetchedProduct = await inventoryStore.getProductById(productId, sucursalId)
    
    if (fetchedProduct) {
      product.value = fetchedProduct
      
      // Seleccionar primer color y talla por defecto si hay variantes
      if (availableColors.value.length > 0) {
        selectedColor.value = availableColors.value[0]
      }
      if (availableSizes.value.length > 0) {
        selectedSize.value = availableSizes.value[0]
      }
    } else {
      error.value = 'Producto no encontrado'
    }
  } catch (err) {
    console.error('Error loading product:', err)
    error.value = 'Error al cargar el producto'
  } finally {
    loading.value = false
  }
})
</script>