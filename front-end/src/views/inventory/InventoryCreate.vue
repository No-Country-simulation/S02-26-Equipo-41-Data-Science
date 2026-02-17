<template>
  <div class="max-w-4xl mx-auto px-8 pb-8">
    <!-- Back button -->
    <router-link
      to="/inventario"
      class="flex items-center gap-1 text-primary text-sm font-semibold mb-6 hover:underline"
    >
      <span class="material-symbols-outlined text-sm">arrow_back</span>
      Volver al inventario
    </router-link>

    <!-- Form using FormTemplate -->
    <FormTemplate
      :config="formConfig"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import FormTemplate from '@/components/common/FormTemplate.vue'
import { createForm } from '@/utils/FormBuilder'
import { useInventoryStore } from '@/stores/inventory'

const router = useRouter()
const inventoryStore = useInventoryStore()

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
  .addSection('Precio de Venta', 'sell', { columns: 1, background: true })
  .addNumberField('price', 'Precio de Venta', {
    required: true,
    prefix: 'S/',
    step: 0.01,
    placeholder: '0.00'
  })

  // Sección: Ingreso Inicial de Stock
  .addSection('Ingreso Inicial de Stock', 'inventory_2', {
    columns: 2,
    description: 'Opcional. Permite registrar el primer ingreso de stock al crear el producto.'
  })
  .addToggleField('hasInitialStock', '¿Ingresar stock inicial?', {
    description: 'Activa esta opción para registrar stock al crear el producto'
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

// Handlers
const handleSubmit = async (formData) => {
  try {
    await inventoryStore.createProduct(formData)
    router.push({ name: 'inventory-list' })
  } catch (error) {
    console.error('Error creating product:', error)
    alert('Error al crear el producto')
  }
}

const handleCancel = () => {
  if (confirm('¿Descartar los cambios?')) {
    router.push({ name: 'inventory-list' })
  }
}
</script>