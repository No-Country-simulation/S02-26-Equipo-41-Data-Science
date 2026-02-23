<template>
  <div class="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
    <div class="flex flex-col max-w-[850px] flex-1">
      <!-- Back link -->
      <BaseBreadcrumb :items="breadcrumbItems" class="mb-4" />

      <!-- Header -->
      <div class="flex flex-wrap justify-between items-end gap-3 pb-8">
        <div>
          <h1 class="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">
            Ajuste de Stock
          </h1>
          <p class="text-gray-500 dark:text-gray-400 text-base">
            Producto: 
            <span class="font-semibold text-slate-900 dark:text-white">
              {{ product?.name || 'Cargando...' }} (SKU: {{ product?.sku || '...' }})
            </span>
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
          </div>
        </div>
      </div>

      <!-- Form usando FormTemplate -->
      <FormTemplate
        :config="formConfig"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />

      <div class="mt-8 text-center pb-12">
        <p class="text-gray-500 dark:text-gray-500 text-sm">
          Los ajustes de inventario se registran en el historial de movimientos para auditoría.
        </p>
      </div>
    </div>

    <!-- Modal de confirmación al cancelar -->
    <BaseModal
      :show="showCancelModal"
      type="warning"
      title="¿Descartar cambios?"
      description="Los datos ingresados no se guardarán. ¿Estás seguro de que deseas salir?"
      button1Title="Continuar editando"
      button2Title="Sí, descartar"
      @action1="showCancelModal = false"
      @action2="confirmCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FormTemplate from '@/components/common/FormTemplate.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import { createForm } from '@/utils/FormBuilder'
import { useInventoryStore } from '@/stores/inventory'
import { inventoryBreadcrumbs } from '@/utils/breadcrumbs'
import { toast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()
const inventoryStore = useInventoryStore()
const productId = route.params.id
const breadcrumbItems = inventoryBreadcrumbs.adjustStock(productId)
const product = ref(null)
const showCancelModal = ref(false)
const errorMessage = ref('')

// Datos del formulario (para calcular stock resultante)
const formData = ref({
  tipoMovimiento: 'ingreso',
  cantidad: 0
})

// Stock resultante calculado
const resultingStock = computed(() => {
  if (!product.value) return 0
  
  const currentStock = product.value.stock || 0
  const cantidad = parseInt(formData.value.cantidad) || 0
  
  switch (formData.value.tipoMovimiento) {
    case 'ingreso':
      return currentStock + cantidad
    case 'salida':
      return Math.max(0, currentStock - cantidad)
    case 'correccion':
      return cantidad
    default:
      return currentStock
  }
})

// Configuración del formulario
const formConfig = createForm()
  .setTitle('', '') // Sin título porque ya lo tenemos arriba

  // Sección: Tipo de Ajuste
  .addSection('Tipo de Ajuste', 'swap_horiz', { columns: 2 })
  .addSelectField('tipoMovimiento', 'Tipo de Movimiento', [
    { value: 'ingreso', label: 'Ingreso (+)' },
    { value: 'salida', label: 'Salida (-)' },
    { value: 'correccion', label: 'Corrección (=)' }
  ], { 
    required: true,
    defaultValue: 'ingreso'
  })
  .addNumberField('cantidad', 'Cantidad', {
    required: true,
    placeholder: '0',
    min: 0
  })

  // Sección: Detalles de Ingreso (condicional)
  .addSection('Detalles de Ingreso', 'local_shipping', {
    columns: 2,
    background: true,
    condition: (data) => data.tipoMovimiento === 'ingreso'
  })
  .addNumberField('costoUnitario', 'Costo Unitario', {
    required: true,
    prefix: 'S/',
    step: 0.01,
    placeholder: '0.00',
    help: 'Indispensable para recalcular costo promedio.'
  })
  .addSelectField('proveedor', 'Proveedor (Opcional)', [
    { value: '', label: 'Seleccionar proveedor' },
    { value: '1', label: 'Textiles del Sur S.A.C.' },
    { value: '2', label: 'Distribuidora Central' },
    { value: '3', label: 'Importaciones Gamarra' }
  ])
  .addDateField('fechaIngreso', 'Fecha de Ingreso (Opcional)', {
    defaultValue: new Date().toISOString().split('T')[0]
  })
  .addTextField('referencia', 'Referencia / N° Factura (Opcional)', {
    placeholder: 'Ej. FAC-001-2345'
  })

  // Sección: Justificación
  .addSection('Justificación', 'assignment', { columns: 1 })
  .addSelectField('motivo', 'Motivo del Ajuste', [
    { value: '', label: 'Seleccionar motivo' },
    { value: 'compra', label: 'Nueva compra / Abastecimiento' },
    { value: 'devolucion', label: 'Devolución de cliente' },
    { value: 'dano', label: 'Producto dañado / Merma' },
    { value: 'error', label: 'Error en conteo previo' },
    { value: 'otro', label: 'Otro (Especificar en notas)' }
  ], { required: true })
  .addTextAreaField('notas', 'Notas Adicionales', {
    placeholder: 'Proporcione detalles adicionales sobre este movimiento...',
    rows: 3
  })

  // Botones
  .setSubmitButton('Aplicar Ajuste', 'save')
  .setCancelButton('Cancelar')

  .build()

// Watch para actualizar formData cuando cambie
watch(
  () => formConfig.sections.flatMap(s => s.fields),
  () => {
    // Aquí podrías actualizar formData si necesitas tracking en tiempo real
  },
  { deep: true }
)

// Lifecycle
onMounted(async () => {
  try {
    product.value = await inventoryStore.getProductById(productId)
  } catch (error) {
    console.error('Error loading product:', error)
    toast.error('No se pudo cargar el producto')
    router.push('/inventario')
  }
})

// Handlers
const handleCancel = () => {
  showCancelModal.value = true
}

const confirmCancel = () => {
  showCancelModal.value = false
  router.push(`/inventario/${productId}`)
}

const handleSubmit = async (data) => {
  try {
    // Guardar en formData para calcular stock resultante
    formData.value = data

    // Validaciones
    if (data.tipoMovimiento === 'salida' && data.cantidad > product.value.stock) {
      toast.error('La cantidad a restar no puede ser mayor al stock actual')
      return
    }

    if (data.tipoMovimiento === 'ingreso' && !data.costoUnitario) {
      toast.error('El costo unitario es obligatorio para ingresos')
      return
    }

    // Preparar datos del ajuste
    const adjustmentData = {
      productId: productId,
      type: data.tipoMovimiento,
      quantity: parseInt(data.cantidad),
      cost: data.costoUnitario ? parseFloat(data.costoUnitario) : null,
      supplier: data.proveedor || null,
      date: data.fechaIngreso || new Date().toISOString().split('T')[0],
      reference: data.referencia || null,
      reason: data.motivo,
      notes: data.notas || null,
      previousStock: product.value.stock,
      newStock: resultingStock.value
    }

    // Simular llamada al API/Store
    console.log('Datos del ajuste:', adjustmentData)
    
    // Actualizar stock del producto
    await inventoryStore.updateProduct(productId, {
      stock: resultingStock.value,
      ...(data.costoUnitario && { cost: parseFloat(data.costoUnitario) })
    })

    // Mostrar toast de éxito
    toast.success('Ajuste de stock aplicado correctamente')    

  } catch (error) {
    console.error('Error al aplicar ajuste:', error)
    errorMessage.value = error.message || 'No se pudo aplicar el ajuste de stock. Intenta nuevamente.'
    toast.error(errorMessage.value)
  }
}

</script>