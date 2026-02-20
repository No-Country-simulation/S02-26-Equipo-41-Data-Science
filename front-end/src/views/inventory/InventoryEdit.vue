<template>
    <div class="max-w-4xl mx-auto px-8 pb-8">
        <!-- Breadcrumb -->
        <BaseBreadcrumb :items="breadcrumbItems" />

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

        <BaseModal
          :show="showCancelModal"
          type="warning"
          title="¿Descartar cambios?"
          description="Los datos ingresados no se guardarán. ¿Estás seguro de que deseas salir?"
          button1Title="Cancelar"
          button2Title="Sí, descartar"
          @action1="showCancelModal = false" 
          @action2="confirmCancel"
        />

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FormTemplate from '@/components/common/FormTemplate.vue'
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { createForm } from '@/utils/FormBuilder'
import { useInventoryStore } from '@/stores/inventory'
import { inventoryBreadcrumbs } from '@/utils/breadcrumbs'
const router = useRouter()
const route = useRoute()
const inventoryStore = useInventoryStore()

const productId = route.params.id
const product = ref(null)
const loading = ref(true)
const showCancelModal = ref(false)
const breadcrumbItems = inventoryBreadcrumbs.edit(productId)

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

const handleCancel = () => {
  // Aquí podrías validar si el formulario está sucio (dirty) antes de mostrar el modal.
  // Por ahora, asumimos que siempre mostramos la advertencia.
  showCancelModal.value = true
}

// Esta función se dispara cuando el usuario confirma en el BaseModal que SÍ quiere salir
const confirmCancel = () => {
  showCancelModal.value = false
  // Regresar a la lista de inventario
  router.push({ name: 'inventory-detail', params: { id: productId } }) 
}

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
</script>