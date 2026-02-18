<template>
    <div class="max-w-4xl mx-auto px-8 pb-8">
        <!-- Breadcrumbs -->
        <nav class="flex flex-wrap gap-2 mb-6 text-sm">
        <router-link to="/inventario" class="text-gray-500 hover:underline">Inventario</router-link>
        <span class="text-gray-500">/</span>
        <router-link :to="`/inventario/${productId}`" class="text-gray-500 hover:underline">Detalle</router-link>
        <span class="text-gray-500">/</span>
        <span class="text-primary font-bold">Editar</span>
        </nav>

        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>

        <!-- Form -->
        <FormTemplate
        v-else-if="product"
        :config="formConfig"
        :initial-data="product"
        @submit="handleSubmit"
        @cancel="handleCancel"
        />

        <!-- Error state -->
        <div v-else class="card text-center py-12">
        <span class="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
        <p class="text-gray-500">Producto no encontrado</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FormTemplate from '@/components/common/FormTemplate.vue'
import { createForm } from '@/utils/FormBuilder'
import { useInventoryStore } from '@/stores/inventory'

const router = useRouter()
const route = useRoute()
const inventoryStore = useInventoryStore()

const productId = route.params.id
const product = ref(null)
const loading = ref(true)

// Configuración del formulario de edición
const formConfig = createForm()
  .setTitle('Editar Producto', 'Actualiza la información detallada de tu producto en el inventario.')

  // Información General
  .addSection('Información General', 'inventory_2', { columns: 2 })
  .addTextField('name', 'Nombre del Producto', {
    required: true,
    colspan: 2
  })
  .addSelectField('category', 'Categoría', [
    { value: 'Calzado', label: 'Calzado' },
    { value: 'Ropa', label: 'Ropa' },
    { value: 'Accesorios', label: 'Accesorios' }
  ])
  .addTextField('brand', 'Marca')
  .addTextField('sku', 'SKU')

  // Precios
  .addSection('Precios', 'payments', { columns: 2, background: true })
  .addNumberField('price', 'Precio de Venta', {
    prefix: '/S',
    step: 0.01,
    help: 'Este es el precio final para el cliente.'
  })
  .addNumberField('cost', 'Precio de Costo', {
    prefix: '/S',
    step: 0.01
  })

  // Control de Inventario
  .addSection('Control de Inventario', 'warehouse', { columns: 2 })
  .addNumberField('minStock', 'Stock Mínimo (Alerta)', {
    help: 'Recibirás una notificación cuando el stock llegue a este nivel.',
    defaultValue: 10
  })
  .addNumberField('stock', 'Stock Actual', {
    disabled: true,
    help: 'Para modificar el stock actual, utiliza la opción Ajustar Stock.'
  })

  // Estado y Descripción
  .addSection('Estado y Descripción', 'description', { columns: 1 })
  .addRadioField('status', 'Estado del Producto', [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' }
  ], { defaultValue: 'active', layout: 'horizontal' })
  .addTextAreaField('description', 'Descripción', {
    placeholder: 'Añade una descripción detallada del producto...',
    rows: 4
  })

  .setSubmitButton('Guardar Cambios', 'save')
  .setCancelButton('Cancelar')

  .build()

// Cargar producto
onMounted(async () => {
  loading.value = true
  try {
    product.value = await inventoryStore.getProductById(productId)
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    loading.value = false
  }
})

// Handlers
const handleSubmit = async (formData) => {
  try {
    await inventoryStore.updateProduct(productId, formData)
    router.push({ name: 'inventory-detail', params: { id: productId } })
  } catch (error) {
    console.error('Error updating product:', error)
    alert('Error al actualizar el producto')
  }
}

const handleCancel = () => {
  router.push({ name: 'inventory-detail', params: { id: productId } })
}
</script>