<template>
  <div class="form-template">
    <!-- Header del formulario -->
    <div v-if="config.title" class="mb-8">
      <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
        {{ config.title }}
      </h1>
      <p v-if="config.description" class="text-gray-500 dark:text-gray-400 text-sm mt-1">
        {{ config.description }}
      </p>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-200 dark:divide-gray-800">
        <div
          v-for="(section, sectionIndex) in config.sections"
          :key="sectionIndex"
          :class="[
            'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden',
            section.background ? 'bg-gray-50/50 dark:bg-gray-900/20' : ''
          ]"
        >
          <div v-if="shouldShowSection(section)" class="p-6 md:p-8">
            <!-- Título de la sección -->
            <div class="flex items-center gap-3 mb-6">
              <span class="material-symbols-outlined text-primary text-2xl">
                {{ section.icon }}
              </span>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ section.title }}
              </h2>
            </div>

            <p v-if="section.description" class="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {{ section.description }}
            </p>

            <!-- Grid de campos -->
            <div
              :class="[
                'grid gap-6',
                section.columns === 1 ? 'grid-cols-1' :
                section.columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
                section.columns === 3 ? 'grid-cols-1 md:grid-cols-3' :
                'grid-cols-1 md:grid-cols-2'
              ]"
            >
              <!-- Renderizar cada campo -->
              <template v-for="(field, fieldIndex) in section.fields" :key="fieldIndex">
                <!-- Campo de texto -->
                <div
                  v-if="field.type === 'text'"
                  :class="field.colspan > 1 ? `md:col-span-${field.colspan}` : ''"
                  class="flex flex-col gap-2"
                >
                  <label class="label-base">
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-500">*</span>
                  </label>
                  <BaseInput
                    v-model="formData[field.name]"
                    :type="field.type"
                    :placeholder="field.placeholder"
                    :icon="field.icon"
                    :disabled="field.disabled"
                    :required="field.required"
                    :error="errors[field.name]"
                  />
                  <span v-if="field.help" class="text-xs text-gray-500">
                    {{ field.help }}
                  </span>
                </div>

                <!-- Campo numérico -->
                <div
                  v-else-if="field.type === 'number'"
                  :class="field.colspan > 1 ? `md:col-span-${field.colspan}` : ''"
                  class="flex flex-col gap-2"
                >
                  <label class="label-base">
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-500">*</span>
                  </label>
                  
                  <div class="flex relative rounded-lg shadow-sm">
                    
                    <div
                      v-if="field.prefix"
                      class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 font-bold select-none"
                    >
                      {{ field.prefix }}
                    </div>

                    <input
                      v-model="formData[field.name]"
                      type="number"
                      :placeholder="field.placeholder"
                      :min="field.min"
                      :max="field.max"
                      :step="field.step"
                      :disabled="field.disabled"
                      :required="field.required"
                      :class="[
                        'block w-full min-w-0 flex-1 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-2.5 text-base focus:ring-primary focus:border-primary dark:text-white transition-all focus:z-10',
                        /* Lógica de bordes redondeados */
                        field.prefix ? 'rounded-none rounded-r-lg' : 'rounded-lg',
                        field.suffix ? 'rounded-r-none' : '',
                        /* Padding estándar */
                        'px-4'
                      ]"
                      class="border focus:ring-2"
                    />

                    <div
                      v-if="field.suffix"
                      class="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 font-bold select-none"
                    >
                      {{ field.suffix }}
                    </div>
                  </div>

                  <span v-if="field.help" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ field.help }}
                  </span>
                  <span v-if="errors[field.name]" class="text-xs text-red-500">
                    {{ errors[field.name] }}
                  </span>
                </div>

                <!-- Campo select -->
                <div
                  v-else-if="field.type === 'select'"
                  :class="field.colspan > 1 ? `md:col-span-${field.colspan}` : ''"
                  class="flex flex-col gap-2"
                >
                  <label class="label-base">
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData[field.name]"
                    :disabled="field.disabled"
                    :required="field.required"
                    class="input-base"
                  >
                    <option value="">{{ field.placeholder }}</option>
                    <option
                      v-for="option in field.options"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                  <span v-if="field.help" class="text-xs text-gray-500">
                    {{ field.help }}
                  </span>
                  <span v-if="errors[field.name]" class="text-xs text-red-500">
                    {{ errors[field.name] }}
                  </span>
                </div>

                <!-- Campo textarea -->
                <div
                  v-else-if="field.type === 'textarea'"
                  :class="field.colspan > 1 ? `md:col-span-${field.colspan}` : ''"
                  class="flex flex-col gap-2"
                >
                  <label class="label-base">
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="formData[field.name]"
                    :placeholder="field.placeholder"
                    :rows="field.rows"
                    :disabled="field.disabled"
                    :required="field.required"
                    class="input-base resize-none"
                  ></textarea>
                  <span v-if="field.help" class="text-xs text-gray-500">
                    {{ field.help }}
                  </span>
                  <span v-if="errors[field.name]" class="text-xs text-red-500">
                    {{ errors[field.name] }}
                  </span>
                </div>

                <!-- Campo date -->
                <div
                  v-else-if="field.type === 'date'"
                  :class="field.colspan > 1 ? `md:col-span-${field.colspan}` : ''"
                  class="flex flex-col gap-2"
                >
                  <label class="label-base">
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData[field.name]"
                    type="date"
                    :min="field.min"
                    :max="field.max"
                    :disabled="field.disabled"
                    :required="field.required"
                    class="input-base"
                  />
                  <span v-if="field.help" class="text-xs text-gray-500">
                    {{ field.help }}
                  </span>
                  <span v-if="errors[field.name]" class="text-xs text-red-500">
                    {{ errors[field.name] }}
                  </span>
                </div>

                <!-- Campo toggle -->
                <div
                  v-else-if="field.type === 'toggle'"
                  :class="field.colspan > 1 ? `md:col-span-${field.colspan}` : ''"
                  class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div>
                    <label class="label-base mb-0">{{ field.label }}</label>
                    <p v-if="field.description" class="text-xs text-gray-500 mt-1">
                      {{ field.description }}
                    </p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="formData[field.name]"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                <!-- Campo radio -->
                <div
                  v-else-if="field.type === 'radio'"
                  :class="field.colspan > 1 ? `md:col-span-${field.colspan}` : ''"
                  class="flex flex-col gap-2"
                >
                  <label class="label-base">
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-500">*</span>
                  </label>
                  <div :class="field.layout === 'vertical' ? 'flex flex-col gap-3' : 'flex flex-wrap gap-4'">
                    <label
                      v-for="option in field.options"
                      :key="option.value"
                      class="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        v-model="formData[field.name]"
                        type="radio"
                        :value="option.value"
                        :name="field.name"
                        :required="field.required"
                        class="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <span class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ option.label }}
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Campo checkbox -->
                <div
                  v-else-if="field.type === 'checkbox'"
                  :class="field.colspan > 1 ? `md:col-span-${field.colspan}` : ''"
                  class="flex items-start gap-3"
                >
                  <input
                    v-model="formData[field.name]"
                    type="checkbox"
                    :id="`checkbox-${fieldIndex}`"
                    class="w-4 h-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label :for="`checkbox-${fieldIndex}`" class="cursor-pointer">
                    <span class="label-base mb-0">{{ field.label }}</span>
                    <p v-if="field.description" class="text-xs text-gray-500 mt-1">
                      {{ field.description }}
                    </p>
                  </label>
                </div>

                <!-- Campo file/image -->
                <div
                  v-else-if="field.type === 'file'"
                  :class="field.colspan > 1 ? `md:col-span-${field.colspan}` : ''"
                  class="flex flex-col gap-2"
                >
                  <label class="label-base">{{ field.label }}</label>
                  <div class="flex items-center gap-6">
                    <!-- Preview -->
                    <div
                      v-if="field.preview && filePreviews[field.name]"
                      class="size-32 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700"
                    >
                      <img
                        :src="filePreviews[field.name]"
                        alt="Preview"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      v-else-if="field.preview"
                      class="size-32 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700"
                    >
                      <span class="material-symbols-outlined text-4xl text-gray-400">
                        image
                      </span>
                    </div>

                    <!-- Upload button -->
                    <div class="flex-1">
                      <input
                        :ref="`file-${field.name}`"
                        type="file"
                        :accept="field.accept"
                        :multiple="field.multiple"
                        class="hidden"
                        @change="handleFileChange(field.name, $event)"
                      />
                      <BaseButton
                        type="button"
                        variant="secondary"
                        copy
                        icon-left="upload"
                        @click="$refs[`file-${field.name}`][0].click()"
                      >
                        Subir Archivo
                      </BaseButton>
                      <p v-if="field.help" class="text-xs text-gray-500 mt-2">
                        {{ field.help }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Divider -->
                <div
                  v-else-if="field.type === 'divider'"
                  :class="`md:col-span-${section.columns}`"
                >
                  <hr class="border-gray-200 dark:border-gray-700 my-4" />
                </div>

                <!-- Campo personalizado -->
                <template v-if="field.type === 'custom'">
                  <div :class="field.columns || 'col-span-full'">
                    <slot :name="`field-${field.name}`" :field="field"></slot>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
        <!-- Botones de acción -->
        <div class="flex items-center justify-end gap-4 p-4">
          <BaseButton
            v-if="config.cancelButton.show"
            type="button"
            copy
            variant="secondary"
            @click="handleCancel"
          >
            {{ config.cancelButton.text }}
          </BaseButton>
          <BaseButton
            type="submit"
            :variant="config.submitButton.variant"
            :icon-left="config.submitButton.icon"
            :loading="isSubmitting"
            copy
          >
            {{ config.submitButton.text }}
          </BaseButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

// Estado del formulario
const formData = reactive({})
const errors = reactive({})
const filePreviews = reactive({})
const isSubmitting = ref(false)

// Inicializar datos del formulario
const initializeFormData = () => {
  props.config.sections.forEach(section => {
    section.fields.forEach(field => {
      if (field.type !== 'divider') {
        formData[field.name] = props.initialData[field.name] || field.defaultValue || ''
      }
    })
  })
}

// Inicializar al montar
initializeFormData()

// Manejar cambio de archivo
const handleFileChange = (fieldName, event) => {
  const file = event.target.files[0]
  if (file) {
    formData[fieldName] = file
    
    // Generar preview si es imagen
    const reader = new FileReader()
    reader.onload = (e) => {
      filePreviews[fieldName] = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Helper para verificar visibilidad
const shouldShowSection = (section) => {
  // Si no hay condición definida, mostrar siempre
  if (!section.condition) return true
  // Si hay condición, ejecutarla pasando el formData reactivo
  return section.condition(formData)
}

// Validar formulario
const validateForm = () => {
  let isValid = true
  Object.keys(errors).forEach(key => delete errors[key])

  props.config.sections.forEach(section => {
    if (!shouldShowSection(section)) return
    section.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} es requerido`
        isValid = false
      }
      
      // Validaciones adicionales según tipo
      if (field.validation) {
        const value = formData[field.name]
        const validation = field.validation
        
        if (validation.type === 'minLength' && value.length < validation.value) {
          errors[field.name] = validation.message
          isValid = false
        }
        // Agregar más validaciones según necesidad
      }
    })
  })

  return isValid
}

// Manejar submit
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  
  try {
    emit('submit', { ...formData })
  } finally {
    isSubmitting.value = false
  }
}

// Manejar cancelar
const handleCancel = () => {
  emit('cancel')
}

// Watch para cambios en initialData
watch(() => props.initialData, (newData) => {
  Object.assign(formData, newData)
}, { deep: true })
</script>

<style scoped>
.label-base {
  @apply text-sm font-semibold text-gray-900 dark:text-gray-200;
}

.input-base {
  @apply w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-base focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white;
}
</style>