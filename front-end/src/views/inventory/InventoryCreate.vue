<template>
  <div class="max-w-4xl mx-auto px-8 pb-8">
    <!-- Back button -->
    <BaseBreadcrumb :items="breadcrumbItems" />

    <!-- Form using FormTemplate -->
    <FormTemplate
      :config="formConfig"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FormTemplate from '@/components/common/FormTemplate.vue'
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { createForm } from '@/utils/FormBuilder'
import { useInventoryStore } from '@/stores/inventory'
import { inventoryBreadcrumbs } from '@/utils/breadcrumbs'
import { useAppToast } from '@/composables/useAppToast'


const router = useRouter()
const inventoryStore = useInventoryStore()
const breadcrumbItems = inventoryBreadcrumbs.create()
const showCancelModal = ref(false)
const toast = useAppToast()

// Configuración del formulario usando Builder
const formConfig = createForm()
  .setTitle('Agregar Nuevo Producto', 'Registra un nuevo artículo en tu catálogo de DATAMARK')
  
  // Sección: Información Básica
  .addSection('Información Básica', 'info', { columns: 2 })
  .addTextField('name', 'Nombre del Producto', {
    required: true,
    placeholder: 'Ej. Polo Oversize Algodón Pima',
    colspan: 2
  })
  .addSelectField('category', 'Categoría', [
    { value: 'polos', label: 'Polos' },
    { value: 'pantalones', label: 'Pantalones' },
    { value: 'calzado', label: 'Calzado' },
    { value: 'accesorios', label: 'Accesorios' }
  ], { required: true, placeholder: 'Seleccionar categoría' })
  .addTextField('brand', 'Marca', {
    placeholder: 'Ej. Urban Peru'
  })
  .addTextField('sku', 'SKU / Código de Barra', {
    placeholder: 'DAT-001-BL-M',
    colspan: 2
  })

  // Sección: Precio de Venta
  .addSection('Precio de Venta', 'sell', { columns: 2, background: true })
  .addNumberField('price', 'Precio de Venta', {
    required: true,
    prefix: 'S/',
    step: 0.01,
    placeholder: '0.00',
    defaultValue: ''
  })
  .addToggleField('hasInitialStock', '¿Ingresar stock inicial?', {
    description: 'Activa esta opción para registrar stock al crear el producto',
    defaultValue: false // Importante definir un valor por defecto
  })

  // Sección: Ingreso Inicial de Stock
  .addSection('Ingreso Inicial de Stock', 'inventory_2', {
    columns: 2,
    description: 'Opcional. Permite registrar el primer ingreso de stock al crear el producto.',
    condition: (data) => data.hasInitialStock === true
  })
  .addNumberField('quantity', 'Cantidad', {
    placeholder: '0'
  })
  .addNumberField('cost', 'Costo unitario', {
    required: true,
    prefix: 'S/',
    step: 0.01,
    placeholder: '0.00'
  })
  .addTextField('supplier', 'Proveedor', {
    placeholder: 'Buscar proveedor...'
  })
  .addDateField('date', 'Fecha', {
    defaultValue: new Date().toISOString().split('T')[0]
  })
  .addTextField('note', 'Nota opcional', {
    placeholder: 'Ej. Stock de apertura tienda principal',
    colspan: 2
  })

  // Sección: Detalles Adicionales
  .addSection('Detalles Adicionales', 'description', { columns: 1 })
  .addTextAreaField('description', 'Descripción', {
    placeholder: 'Características del producto...',
    rows: 3
  })
  .addFileField('image', 'Imagen del Producto', {
    accept: 'image/*',
    help: 'PNG, JPG hasta 5MB'
  })

  // Configurar botones
  .setSubmitButton('Guardar Producto', 'save')
  .setCancelButton('Cancelar')

  .build()

const handleCancel = () => {
  // Aquí podrías validar si el formulario está sucio (dirty) antes de mostrar el modal.
  // Por ahora, asumimos que siempre mostramos la advertencia.
  showCancelModal.value = true
}

// Esta función se dispara cuando el usuario confirma en el BaseModal que SÍ quiere salir
const confirmCancel = () => {
  showCancelModal.value = false
  // Regresar a la lista de inventario
  router.push('/inventario') 
}

// --- LÓGICA DE GUARDADO ---

// Esta función se dispara cuando el formulario es válido y se envía
const handleSubmit = async (formData) => {
  try {
    // 1. Llamada a tu store/API
    await inventoryStore.createProduct(formData)
    console.log('Datos a guardar:', formData)
    toast.success('Producto registrado correctamente en el inventario')
    router.push('/inventario')

  } catch (error) {
    console.error('Error al guardar:', error)
    toast.error('Ocurrió un problema al intentar guardar el producto. Inténtalo de nuevo.')
  }
}
</script>