<template>
  <div class="max-w-[1280px] mx-auto p-4 lg:p-10 space-y-8">
    <!-- Header con navegación -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <BaseBreadcrumb :items="breadcrumbItems" />

      <!-- Menú de acciones -->
      <div class="flex items-center gap-3">
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
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 font-semibold"
            >
              <span class="material-symbols-outlined !text-lg text-red-500">block</span>
              Desactivar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Contenido principal -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Galería de imágenes -->
      <div class="lg:col-span-6 space-y-4">
        <!-- Imagen principal -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden aspect-square shadow-sm flex items-center justify-center relative">
          <div
            v-if="product.image"
            class="absolute inset-0 bg-center bg-no-repeat bg-cover"
            :style="`background-image: url('${product.image}')`"
          ></div>
          <div
            v-else
            class="flex items-center justify-center text-gray-300"
          >
            <span class="material-symbols-outlined text-8xl">image</span>
          </div>

          <!-- Badge de estado -->
          <div
            v-if="product.stockStatus !== 'out'"
            class="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 text-slate-800"
          >
            {{ product.stockBadge }}
          </div>
        </div>

        <!-- Miniaturas (placeholder) -->
        <div class="flex gap-3 overflow-x-auto pb-2">
          <div
            class="size-20 flex-shrink-0 rounded-lg border-2 border-primary overflow-hidden cursor-pointer"
            :style="product.image ? `background-image: url('${product.image}'); background-size: cover; background-position: center;` : ''"
          >
            <div v-if="!product.image" class="w-full h-full bg-slate-100 flex items-center justify-center">
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
              {{ product.category }} / {{ product.brand }}
            </span>
          </div>
          <h1 class="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {{ product.name }}
          </h1>
          <div class="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span>SKU: <span class="text-slate-900 dark:text-slate-300">{{ product.sku }}</span></span>
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
              Color Seleccionado: <span class="text-slate-900 dark:text-white">{{ selectedColor }}</span>
            </label>
          </div>
          <div class="flex gap-3">
            <button
              v-for="color in product.colors"
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
              {{ product.category === 'Calzado' ? 'Talle (EU)' : 'Talla' }}:
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
                S/ {{ selectedVariant.price.toFixed(2) }}
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
                  : selectedVariant.stock < selectedVariant.minStock
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-green-600 dark:text-green-400'
              ]">
                <span class="size-2 rounded-full animate-pulse" :class="[
                  selectedVariant.stock === 0
                    ? 'bg-red-500'
                    : selectedVariant.stock < selectedVariant.minStock
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                ]"></span>
                {{ selectedVariant.stock }} unidades
                {{ selectedVariant.stock === 0 ? '- Sin Stock' : selectedVariant.stock < selectedVariant.minStock ? '- Stock Bajo' : '- Stock OK' }}
              </span>
              <span class="text-slate-400">Umbral: {{ selectedVariant.minStock }} und.</span>
            </div>
            <div class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                :class="[
                  'h-full rounded-full',
                  selectedVariant.stock === 0
                    ? 'bg-red-500'
                    : selectedVariant.stock < selectedVariant.minStock
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                ]"
                :style="`width: ${Math.min((selectedVariant.stock / (selectedVariant.minStock * 2)) * 100, 100)}%`"
              ></div>
            </div>
          </div>

          <!-- Botón ajustar stock -->
          <button
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
      <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <h3 class="text-lg font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">description</span>
          Descripción del Producto
        </h3>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
          {{ product.description }}
        </p>
      </section>

      <!-- Tabla de todas las variantes -->
      <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <details class="group" open>
          <summary class="px-8 py-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary !text-2xl">list_alt</span>
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">
                Ver todas las variantes ({{ product.variantsCount }})
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
                  v-for="variant in product.variants"
                  :key="variant.id"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/30"
                >
                  <td class="px-6 py-4 text-sm font-semibold">{{ variant.color }}</td>
                  <td class="px-6 py-4 text-sm">{{ variant.size }}</td>
                  <td class="px-6 py-4 text-sm font-mono text-slate-500">{{ variant.sku }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-right">S/ {{ variant.price.toFixed(2) }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-right" :class="[
                    variant.stock === 0 ? 'text-red-600' : variant.stock < variant.minStock ? 'text-orange-600' : 'text-green-600'
                  ]">
                    {{ variant.stock }}
                  </td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'px-2 py-1 rounded text-[10px] font-bold uppercase',
                      variant.stock === 0
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : variant.stock < variant.minStock
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    ]">
                      {{ variant.stock === 0 ? 'Sin Stock' : variant.stock < variant.minStock ? 'Stock Bajo' : 'En Stock' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <button
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
import { useRoute } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'
import { inventoryBreadcrumbs } from '@/utils/breadcrumbs'
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'

const route = useRoute()
const inventoryStore = useInventoryStore()

const loading = ref(true)
const product = ref(null)
const showActions = ref(false)
const selectedColor = ref('')
const selectedSize = ref('')

const breadcrumbItems = inventoryBreadcrumbs.detail(route.params.id)
// Variante seleccionada
const selectedVariant = computed(() => {
  if (!product.value || !selectedColor.value || !selectedSize.value) return null
  
  return product.value.variants.find(v =>
    v.color === selectedColor.value && v.size === selectedSize.value
  )
})

// Tallas disponibles para el color seleccionado
const availableSizes = computed(() => {
  if (!product.value) return []
  
  if (selectedColor.value) {
    const sizes = product.value.variants
      .filter(v => v.color === selectedColor.value)
      .map(v => v.size)
    return [...new Set(sizes)]
  }
  
  return product.value.sizes
})

// Verificar si una talla está disponible
const isSizeAvailable = (size) => {
  if (!product.value || !selectedColor.value) return false
  
  const variant = product.value.variants.find(v =>
    v.color === selectedColor.value && v.size === size
  )
  
  return variant && variant.stock > 0
}

// Seleccionar talla
const selectSize = (size) => {
  if (isSizeAvailable(size)) {
    selectedSize.value = size
  }
}

// Obtener estilo de color
const getColorStyle = (color) => {
  const colorMap = {
    'Rojo': 'background-color: #dc2626',
    'Azul': 'background-color: #2563eb',
    'Negro': 'background-color: #1f2937',
    'Blanco': 'background-color: #f9fafb; border: 1px solid #e5e7eb',
    'Marrón': 'background-color: #92400e'
  }
  
  return colorMap[color] || 'background-color: #9ca3af'
}

// Cargar producto
onMounted(async () => {
  try {
    const productId = parseInt(route.params.id)
    product.value = await inventoryStore.getProductById(productId)
    
    if (product.value) {
      // Seleccionar primer color y talla por defecto
      selectedColor.value = product.value.colors[0] || ''
      selectedSize.value = availableSizes.value[0] || ''
    }
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    loading.value = false
  }
})
</script>