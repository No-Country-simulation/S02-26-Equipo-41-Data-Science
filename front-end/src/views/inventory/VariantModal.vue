<script setup>
import { FormBuilder, FormValidation } from '@/utils/FormBuilder';
import FormTemplate from '@/components/common/FormTemplate.vue';

const props = defineProps({
  initialData: { type: Object, default: null }
});

const emit = defineEmits(['close', 'save']);

// Configuración del modal usando el Builder
const variantFormConfig = new FormBuilder()
  .addSection('Detalles de la Variante', 'style')
    .addTextField('color', 'Color', { validation: FormValidation.required() })
    .addTextField('talla', 'Talla', { validation: FormValidation.required() })
    .addTextField('sku', 'SKU', { validation: FormValidation.required() })
    .addNumberField('precio', 'Precio de Venta', {
      prefix: 'S/',
      step: 0.01,
      validation: FormValidation.required()
    })
  .build();
  
console.log('Initial Data for Variant Modal:', props.initialData);

const handleSave = (formData) => {
  emit('save', formData);
  emit('close');
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-transparent dark:bg-gray-900 rounded-2xl">
      <div class="p-2">
        <FormTemplate 
          :config="variantFormConfig"
          :initial-data="initialData || { precioventa: 0 }"
          @submit="handleSave"
          @cancel="emit('close')"
        />
      </div>
    </div>
  </div>
</template>