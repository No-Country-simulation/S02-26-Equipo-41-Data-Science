<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInventoryStore } from '@/stores/inventory';
import { FormBuilder, FormValidation } from '@/utils/FormBuilder';

// Componentes Base
import FormTemplate from '@/components/common/FormTemplate.vue';
import DataTable from '@/components/common/DataTable.vue';
import VariantModal from './VariantModal.vue'; // El modal de la consulta anterior

const props = defineProps({
  id: { type: String, default: null }
});

const router = useRouter();
const store = useInventoryStore();

// --- ESTADO ---
const isModalOpen = ref(false);
const editingVariant = ref(null);
const productVariants = ref([]);
const initialData = ref({ name: '', category: '', description: '', status: 'active' });

// --- DETERMINAR MODO ---
const isEdit = computed(() => !!props.id);

// --- CONFIGURACIÓN DEL FORMULARIO ---
const formConfig = computed(() => {
  return new FormBuilder()
    .setTitle(isEdit.value ? 'Editar Producto' : 'Nuevo Producto')
    .addSection('Información General', 'inventory_2')
      .addTextField('name', 'Nombre del Modelo', { validation: FormValidation.required() })
      .addSelectField('category', 'Categoría', [
        { value: 'Ropa', label: 'Ropa' },
        { value: 'Calzado', label: 'Calzado' },
        { value: 'Accesorios', label: 'Accesorios' }
      ])
    .addSection('Variantes del Producto', 'layers')
      // AQUÍ USAMOS EL CUSTOM FIELD
      .addCustomField('variants_list', {
        label: 'Gestión de SKUs y Stock'
      })  
    .addSection('Notas Adicionales', 'description')
      .addTextAreaField('notes', 'Comentarios internos')
    .build();
});

// --- CARGA DE DATOS (Solución al problema de visualización) ---
const loadProductData = () => {
  if (isEdit.value) {
    // IMPORTANTE: Convertimos props.id a Number si tus IDs en el store son numéricos
    const numericId = Number(props.id);
    const product = store.products.find(p => p.id === numericId);

    if (product) {
      // 1. Cargar info general
      initialData.value = { ...product };
      // 2. Cargar variantes vinculadas a este producto
      productVariants.value = store.variants
        .filter(v => v.productId === numericId)
        .map(v => ({ ...v })); // Clonamos para no mutar el store directamente
    } else {
      console.warn("Producto no encontrado en el store");
    }
  } else {
    // Reset para creación
    initialData.value = { name: '', category: '', description: '', status: 'active' };
    productVariants.value = [];
  }
};

onMounted(loadProductData);
// Observamos el ID por si se navega entre productos sin desmontar el componente
watch(() => props.id, loadProductData);

// --- MANEJO DE VARIANTES ---
const openAddVariant = () => {
  editingVariant.value = null;
  isModalOpen.value = true;
};

const openEditVariant = (variant) => {
  editingVariant.value = { ...variant };
  isModalOpen.value = true;
};

const handleSaveVariant = (variantData) => {
  if (editingVariant.value) {
    const index = productVariants.value.findIndex(v => v.sku === editingVariant.value.sku);
    productVariants.value[index] = variantData;
  } else {
    productVariants.value.push(variantData);
  }
};

// --- GUARDAR TODO ---
const handleSaveAll = async (formData) => {
  if (productVariants.value.length === 0) {
    alert("Agregue al menos una variante");
    return;
  }
  
  // Llamamos a la acción del store que creamos anteriormente
  await store.saveProduct(
    { ...formData, id: isEdit.value ? Number(props.id) : null },
    productVariants.value
  );
  
  router.push({ name: 'inventory-list' });
};

// Definición de columnas para el DataTable
const columns = [
  { key: 'color', label: 'Color' },
  { key: 'size', label: 'Talla' },
  { key: 'sku', label: 'SKU' },
  { key: 'price', label: 'Precio', align: 'right' },
  { key: 'stock', label: 'Stock', align: 'center' },
  { key: 'actions', label: 'Acciones', align: 'right' }
];
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 space-y-8">
    <FormTemplate 
      :config="formConfig" 
      :initial-data="initialData"
      @submit="handleSaveAll"
      @cancel="router.push({ name: 'inventory-list' })"
    >
      <template #field-variants_list="{ field }">
        <div class="mt-2 space-y-4">
          <div class="flex justify-between items-center mb-4">
            <p class="text-sm text-gray-500">{{ field.label }}</p>
            <button @click.prevent="openAddVariant" class="btn-secondary text-xs flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">add</span>
              Añadir Variante
            </button>
          </div>

          <DataTable :columns="columns" :data="productVariants">
            </DataTable>
          
          <p v-if="productVariants.length === 0" class="text-xs text-red-500 italic">
            * Se requiere al menos una variante.
          </p>
        </div>
      </template>
    </FormTemplate>

    <VariantModal 
      v-if="isModalOpen" 
      :initial-data="editingVariant"
      @close="isModalOpen = false"
      @save="handleSaveVariant"
    />
  </div>
</template>