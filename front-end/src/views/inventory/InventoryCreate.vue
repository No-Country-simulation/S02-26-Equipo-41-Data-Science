<template>
  <div class="max-w-4xl mx-auto px-8 pb-8">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
        Crear Nuevo Producto
      </h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Completa los datos para agregar un producto al inventario
      </p>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Card: Información Básica -->
      <div class="card">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Información Básica
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            v-model="form.name"
            label="Nombre del Producto"
            placeholder="Ej: Zapatilla Runner Air Pro"
            icon="inventory_2"
            :error="errors.name"
            required
          />

          <BaseInput
            v-model="form.sku"
            label="SKU (Código)"
            placeholder="Ej: CAL-001"
            icon="tag"
            :error="errors.sku"
            required
          />

          <div class="flex flex-col gap-2">
            <label class="label-base">Categoría</label>
            <select
              v-model="form.category"
              class="input-base"
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="Calzado">Calzado</option>
              <option value="Ropa">Ropa</option>
            </select>
            <span v-if="errors.category" class="text-red-500 text-xs">
              {{ errors.category }}
            </span>
          </div>

          <BaseInput
            v-model="form.brand"
            label="Marca"
            placeholder="Ej: Nike, Adidas"
            icon="label"
          />
        </div>

        <div class="mt-6">
          <label class="label-base">Descripción</label>
          <textarea
            v-model="form.description"
            class="input-base min-h-[100px]"
            placeholder="Describe el producto..."
          ></textarea>
        </div>
      </div>

      <!-- Card: Precio e Inventario -->
      <div class="card">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Precio e Inventario
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BaseInput
            v-model.number="form.price"
            type="number"
            step="0.01"
            label="Precio de Venta (S/)"
            placeholder="0.00"
            icon="payments"
            :error="errors.price"
            required
          />

          <BaseInput
            v-model.number="form.cost"
            type="number"
            step="0.01"
            label="Costo (S/)"
            placeholder="0.00"
            icon="receipt"
          />

          <BaseInput
            v-model.number="form.stock"
            type="number"
            label="Stock Inicial"
            placeholder="0"
            icon="warehouse"
            :error="errors.stock"
            required
          />
        </div>
      </div>

      <!-- Card: Imagen -->
      <div class="card">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Imagen del Producto
        </h3>
        
        <div class="flex items-center gap-6">
          <!-- Preview -->
          <div class="size-32 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700">
            <img
              v-if="imagePreview"
              :src="imagePreview"
              alt="Preview"
              class="w-full h-full object-cover"
            />
            <span v-else class="material-symbols-outlined text-4xl text-gray-400">
              image
            </span>
          </div>

          <!-- Upload -->
          <div class="flex-1">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageChange"
            />
            <BaseButton
              type="button"
              variant="secondary"
              icon-left="upload"
              @click="$refs.fileInput.click()"
            >
              Subir Imagen
            </BaseButton>
            <p class="text-xs text-gray-500 mt-2">
              PNG, JPG hasta 5MB
            </p>
          </div>
        </div>
      </div>

      <!-- Mensaje de error general -->
      <div
        v-if="generalError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
      >
        {{ generalError }}
      </div>

      <!-- Botones de acción -->
      <div class="flex items-center justify-end gap-4">
        <BaseButton
          type="button"
          variant="secondary"
          @click="handleCancel"
        >
          Cancelar
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          icon-left="save"
          :loading="isSubmitting"
        >
          Guardar Producto
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useInventoryStore } from '@/stores/inventory'

const router = useRouter()
const inventoryStore = useInventoryStore()

// Estado del formulario
const form = reactive({
  name: '',
  sku: '',
  category: '',
  brand: '',
  description: '',
  price: 0,
  cost: 0,
  stock: 0,
  image: null
})

const errors = reactive({
  name: '',
  sku: '',
  category: '',
  price: '',
  stock: ''
})

const imagePreview = ref(null)
const fileInput = ref(null)
const isSubmitting = ref(false)
const generalError = ref('')

// Validación
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  generalError.value = ''

  if (!form.name || form.name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres'
    isValid = false
  }

  if (!form.sku || form.sku.trim().length < 3) {
    errors.sku = 'El SKU debe tener al menos 3 caracteres'
    isValid = false
  }

  if (!form.category) {
    errors.category = 'Selecciona una categoría'
    isValid = false
  }

  if (!form.price || form.price <= 0) {
    errors.price = 'El precio debe ser mayor a 0'
    isValid = false
  }

  if (form.stock < 0) {
    errors.stock = 'El stock no puede ser negativo'
    isValid = false
  }

  return isValid
}

// Handlers
const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      generalError.value = 'La imagen no debe superar 5MB'
      return
    }

    form.image = file
    
    // Preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await inventoryStore.createProduct({
      ...form,
      image: imagePreview.value // En producción, subirías la imagen a un servidor
    })

    // Redirigir al listado
    router.push({ name: 'inventory-list' })
  } catch (error) {
    generalError.value = 'Error al crear el producto. Intenta nuevamente.'
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  if (confirm('¿Descartar los cambios?')) {
    router.push({ name: 'inventory-list' })
  }
}
</script>