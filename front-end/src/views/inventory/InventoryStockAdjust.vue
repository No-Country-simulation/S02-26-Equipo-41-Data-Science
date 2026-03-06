<template>
  <div class="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
    <div class="flex flex-col max-w-[850px] flex-1">
      <!-- Back link -->
      <BaseBreadcrumb :items="breadcrumbItems" class="mb-4" />

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500">{{ error }}</p>
        <BaseButton @click="goBack" class="mt-4">Volver</BaseButton>
      </div>

      <!-- Contenido -->
      <template v-else-if="variant">
        <!-- Header -->
        <div class="flex flex-wrap justify-between items-end gap-3 pb-8">
          <div>
            <h1 class="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">
              Ajuste de Stock
            </h1>
            <p class="text-gray-500 dark:text-gray-400 text-base">
              Producto: 
              <span class="font-semibold text-slate-900 dark:text-white">
                {{ product?.nombreproducto || 'Cargando...' }}
              </span>
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              Variante: {{ variant.color }} / Talla {{ variant.talla }} (SKU: {{ variant.sku }})
            </p>
          </div>

          <!-- Stock resultante -->
          <div class="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-4 min-w-[200px]">
            <div class="p-2 bg-primary rounded-lg text-white">
              <span class="material-symbols-outlined">inventory_2</span>
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-wider font-bold text-primary/70">
                Stock Resultante
              </p>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-black text-primary">{{ resultingStock }}</span>
                <span class="text-xs text-primary/60 font-medium">unidades</span>
              </div>
              <p class="text-[10px] text-gray-500 mt-0.5">
                Actual: {{ variant.stock }} und.
              </p>
            </div>
          </div>
        </div>

        <!-- Form usando FormTemplate -->
        <FormTemplate
          :config="formConfig"
          :initial-data="initialFormData"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />

        <div class="mt-8 text-center pb-12">
          <p class="text-gray-500 dark:text-gray-500 text-sm">
            Los ajustes de inventario se registran en el historial de movimientos para auditoría.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FormTemplate from '@/components/common/FormTemplate.vue'
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { FormBuilder, FormValidation } from '@/utils/FormBuilder'
import { useInventoryStore } from '@/stores/inventory'
import { toast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()
const inventoryStore = useInventoryStore()

// ==========================================
// STATE
// ==========================================
const loading = ref(true)
const error = ref(null)
const variant = ref(null)
const product = ref(null)
const inventario = ref(null)
const tiposMovimiento = ref([])
const proveedores = ref([])

const showCancelModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

// Datos del formulario (para calcular stock resultante)
const formData = ref({
  tipoid: null,
  cantidad: 0,
  costoUnitario: 0,
  proveedorid: null,
  motivo: '',
  notas: '',
  fechaid: new Date().toISOString().split('T')[0]
})

const initialFormData = ref({
  tipoid: null,
  cantidad: 0,
  costoUnitario: 0,
  proveedorid: null,
  motivo: '',
  notas: '',
  fechaid: new Date().toISOString().split('T')[0]
})

// ==========================================
// COMPUTED
// ==========================================
const variantId = computed(() => {
  const id = route.params.variantId
  return id ? parseInt(id) : null
})

const productId = computed(() => {
  const id = route.params.productId
  return id ? parseInt(id) : null
})

const breadcrumbItems = computed(() => [
  { label: 'Inventario', to: '/inventario' },
  { 
    label: product.value?.nombreproducto || 'Producto', 
    to: `/inventario/${productId.value}` 
  },
  { 
    label: 'Ajustar Stock', 
    to: `/inventario/${productId.value}/variante/${variantId.value}/ajustar`,
    active: true 
  }
])

// Tipo de movimiento seleccionado
const tipoMovimientoSeleccionado = computed(() => {
  if (!formData.value.tipoid || !tiposMovimiento.value.length) return null
  return tiposMovimiento.value.find(t => t.tipoid === formData.value.tipoid)
})

// Stock resultante calculado
const resultingStock = computed(() => {
  if (!variant.value) return 0
  
  const currentStock = variant.value.stock || 0
  const cantidad = parseInt(formData.value.cantidad) || 0
  const tipoNombre = tipoMovimientoSeleccionado.value?.nombre

  if (!tipoNombre) return currentStock
  
  switch (tipoNombre.toUpperCase()) {
    case 'INGRESO':
      return currentStock + cantidad
    case 'SALIDA':
      return Math.max(0, currentStock - cantidad)
    case 'AJUSTE':
    case 'CORRECCIÓN':
      return cantidad
    default:
      return currentStock
  }
})

// Configuración del formulario
const formConfig = computed(() => {
  const tipoOptions = tiposMovimiento.value.map(t => ({
    value: t.tipoid,
    label: t.nombre
  }))

  const proveedorOptions = [
    { value: null, label: 'Sin proveedor' },
    ...proveedores.value.map(p => ({
      value: p.proveedorid,
      label: p.razonsocial
    }))
  ]

  const isIngreso = tipoMovimientoSeleccionado.value?.nombre?.toUpperCase() === 'INGRESO'

  return new FormBuilder()
    .setTitle('', '')

    // Sección: Tipo de Ajuste
    .addSection('Tipo de Ajuste', 'swap_horiz', { columns: 2 })
    .addSelectField('tipoid', 'Tipo de Movimiento', tipoOptions, {
      validation: FormValidation.required()
    })
    .addNumberField('cantidad', 'Cantidad', {
      validation: FormValidation.required(),
      placeholder: '0',
      min: 1
    })

    // Sección: Detalles de Ingreso (condicional)
    .addSection('Detalles de Ingreso', 'local_shipping', {
      columns: 2,
      background: true,
      condition: () => isIngreso
    })
    .addNumberField('costoUnitario', 'Costo Unitario', {
      validation: isIngreso ? FormValidation.required() : undefined,
      prefix: 'S/',
      step: 0.01,
      placeholder: '0.00',
      help: 'Indispensable para ingresos.'
    })
    .addSelectField('proveedorid', 'Proveedor', proveedorOptions)

    // Sección: Justificación
    .addSection('Justificación', 'assignment', { columns: 1 })
    .addDateField('fechaid', 'Fecha del Movimiento', {
      validation: FormValidation.required(),
      defaultValue: new Date().toISOString().split('T')[0]
    })
    .addSelectField('motivo', 'Motivo del Ajuste', [
      { value: 'Compra', label: 'Nueva compra / Abastecimiento' },
      { value: 'Devolución', label: 'Devolución de cliente' },
      { value: 'Daño', label: 'Producto dañado / Merma' },
      { value: 'Otro', label: 'Otro (Especificar en notas)' }
    ], { validation: FormValidation.required() })
    .addTextAreaField('notas', 'Notas Adicionales', {
      placeholder: 'Proporcione detalles adicionales sobre este movimiento...',
      rows: 3
    })

    // Botones
    .setSubmitButton('Aplicar Ajuste', 'save')
    .setCancelButton('Cancelar')

    .build()
})

// ==========================================
// METHODS
// ==========================================
async function loadData() {
  loading.value = true
  error.value = null

  try {
    // Validar que tenemos los parámetros necesarios
    if (!productId.value || !variantId.value) {
      throw new Error('Parámetros de producto o variante faltantes')
    }

    const sucursalId = 1 // TODO: Obtener del contexto

    // Cargar tipos de movimiento
    tiposMovimiento.value = await inventoryStore.getTiposMovimiento()
    
    // Cargar proveedores
    proveedores.value = await inventoryStore.getProveedores()

    // Cargar producto para obtener la variante
    const productData = await inventoryStore.getProductById(productId.value, sucursalId)
    
    if (!productData) {
      throw new Error('Producto no encontrado')
    }

    product.value = productData

    // Parsear variantes
    let variants = []
    if (productData.variantes) {
      variants = Array.isArray(productData.variantes) 
        ? productData.variantes 
        : JSON.parse(productData.variantes)
    }

    // Buscar la variante específica
    const foundVariant = variants.find(v => v.varianteid === variantId.value)
    
    if (!foundVariant) {
      throw new Error('Variante no encontrada')
    }

    variant.value = foundVariant

    // Obtener inventarioid de la variante
    inventario.value = await inventoryStore.getInventarioByVariant(variantId.value, sucursalId)

    if (!inventario.value) {
      throw new Error('Inventario no encontrado para esta variante')
    }

  } catch (err) {
    console.error('Error loading data:', err)
    error.value = err.message || 'Error al cargar los datos'
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  showCancelModal.value = true
}

const goBack = () => {
  router.push(`/inventario/${productId.value}`)
}

const handleSubmit = async (data) => {
  try {
    // Actualizar formData para el cálculo de stock resultante
    formData.value = { ...data }

    const tipoNombre = tipoMovimientoSeleccionado.value?.nombre?.toUpperCase()

    // Validaciones
    if (tipoNombre === 'SALIDA' && data.cantidad > variant.value.stock) {
      errorMessage.value = `La cantidad a restar (${data.cantidad}) no puede ser mayor al stock actual (${variant.value.stock})`
      showErrorModal.value = true
      return
    }

    if (tipoNombre === 'INGRESO' && !data.costoUnitario) {
      errorMessage.value = 'El costo unitario es obligatorio para ingresos'
      showErrorModal.value = true
      return
    }

    if (!data.motivo) {
      errorMessage.value = 'Debe seleccionar un motivo para el ajuste'
      showErrorModal.value = true
      return
    }

    // Preparar datos para el RPC
    const ajusteData = {
      p_inventarioid: inventario.value.inventarioid,
      p_cantidad: parseInt(data.cantidad),
      p_tipoid: parseInt(data.tipoid),
      p_proveedorid: data.proveedorid ? parseInt(data.proveedorid) : null,
      p_costo_unitario: data.costoUnitario ? parseFloat(data.costoUnitario) : null,
      p_motivo: data.motivo,
      p_notas: data.notas || null,
      p_fecha: data.fechaid
    }

    console.log('Datos del ajuste:', ajusteData)

    // Llamar al RPC de Supabase
    await inventoryStore.aplicarAjusteStock(ajusteData)
    toast.success('Ajuste de stock aplicado exitosamente')
    router.push({ name: 'inventory-detail', params: { id: productId.value } })

  } catch (err) {
    console.error('Error al aplicar ajuste:', err)
    errorMessage.value = err.message || 'No se pudo aplicar el ajuste de stock. Intenta nuevamente.'
    toast.error(errorMessage.value)
  }
}

// ==========================================
// WATCHERS
// ==========================================
// Watch para actualizar formData cuando cambie
watch(() => formConfig.value, () => {
  // El formulario se actualiza reactivamente
}, { deep: true })

// ==========================================
// LIFECYCLE
// ==========================================
onMounted(() => {
  loadData()
})
</script>