<script setup>
import { computed } from 'vue';
import { FormBuilder, FormValidation } from '@/utils/FormBuilder';
import FormTemplate from '@/components/common/FormTemplate.vue';

const props = defineProps({
  initialData: { type: Object, default: null }
});

const emit = defineEmits(['close', 'save']);

// Configuración del modal usando el Builder
const variantFormConfig = new FormBuilder()
  .setTitle(props.initialData ? 'Editar Variante' : 'Nueva Variante')
  .addSection('Detalles de la Variante', 'style')
    .addTextField('color', 'Color', { validation: FormValidation.required() })
    .addTextField('size', 'Talla', { validation: FormValidation.required() })
    .addTextField('sku', 'SKU Específico', { validation: FormValidation.required() })
    .addNumberField('price', 'Precio de venta', {
      prefix: '/S',
      step: 0.01
    })
    .addNumberField('stock', 'Stock Inicial', {
      step: 1
    })
  .build();

const handleSave = (formData) => {
  emit('save', formData);
  emit('close');
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">
      <div class="p-2"> <FormTemplate 
          :config="variantFormConfig"
          :initial-data="initialData || { price: 0, stock: 0 }"
          @submit="handleSave"
          @cancel="emit('close')"
        />
      </div>
    </div>
  </div>
</template>