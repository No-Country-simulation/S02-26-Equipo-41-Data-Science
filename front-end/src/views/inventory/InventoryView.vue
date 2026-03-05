<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInventoryStore } from '@/stores/inventory';
import { FormBuilder, FormValidation } from '@/utils/FormBuilder';

// Componentes
import FormTemplate from '@/components/common/FormTemplate.vue';
import DataTable from '@/components/common/DataTable.vue';
import VariantModal from '@/views/inventory/VariantModal.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { toast } from '@/utils/toast';

const route = useRoute();
const router = useRouter();
const store = useInventoryStore();

// ==========================================
// STATE
// ==========================================
const isModalOpen = ref(false);
const editingVariant = ref(null);
const editingVariantIndex = ref(null);
const productVariants = ref([]);
const initialData = ref({ 
  nombreproducto: '', 
  categoriaid: null, 
  marcaid: null 
});

// Catálogos
const categorias = ref([]);
const marcas = ref([]);

// Modales de confirmación
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// ==========================================
// COMPUTED
// ==========================================
const isEdit = computed(() => !!route.params.id);
const productId = computed(() => route.params.id);

// ==========================================
// FORM CONFIG
// ==========================================
const formConfig = computed(() => {
  return new FormBuilder()
    .setTitle(isEdit.value ? 'Editar Producto' : 'Nuevo Producto')
    .addSection('Información General', 'inventory_2', { columns: 2 })
      .addTextField('nombreproducto', 'Nombre del Producto', { 
        validation: FormValidation.required(),
        colspan: 2
      })
      .addSelectField('categoriaid', 'Categoría', 
        categorias.value.map(c => ({ value: c.categoriaid, label: c.categoria })),
        { validation: FormValidation.required() }
      )
      .addSelectField('marcaid', 'Marca',
        marcas.value.map(m => ({ value: m.marcaid, label: m.marca })),
        { validation: FormValidation.required() }
      )
    
    .addSection('Variantes del Producto', 'palette')
      .addCustomField('variants_list', {
        label: 'Gestión de Variantes (Color + Talla + SKU + Precio)'
      })
    
    .setSubmitButton(isEdit.value ? 'Guardar Cambios' : 'Crear Producto', 'save')
    .setCancelButton('Cancelar')
    .build();
});

// ==========================================
// DATA TABLE
// ==========================================
const columns = [
  { key: 'color', label: 'Color' },
  { key: 'talla', label: 'Talla' },
  { key: 'sku', label: 'SKU' },
  { key: 'precioventa', label: 'Precio', align: 'right' },
  { key: 'actions', label: 'Acciones', align: 'center' }
];

// ==========================================
// CARGAR DATOS
// ==========================================
const loadCatalogos = async () => {
  try {
    const [categoriasData, marcasData] = await Promise.all([
      store.getCategorias(),
      store.getMarcas()
    ]);
    categorias.value = categoriasData;
    marcas.value = marcasData;
  } catch (error) {
    console.error('Error cargando catálogos:', error);
    errorMessage.value = 'Error al cargar categorías y marcas.';
    showErrorModal.value = true;
  }
};

const loadProductData = async () => {
  if (isEdit.value) {
    const numericId = parseInt(productId.value);
    
    try {
      const product = await store.getProductById(numericId, 1);

      if (product) {
        initialData.value = {
          nombreproducto: product.nombreproducto,
          categoriaid: categorias.value.find(c => c.categoria === product.categoria)?.categoriaid || null,
          marcaid: marcas.value.find(m => m.marca === product.marca)?.marcaid || null
        };
        productVariants.value = product.variantes || [];
      } else {
        console.warn("Producto no encontrado en el store");
        errorMessage.value = "Producto no encontrado";
        showErrorModal.value = true;
      }
    } catch (error) {
      console.error('Error cargando producto:', error);
      errorMessage.value = error.message || "Error al cargar el producto";
      showErrorModal.value = true;
    }
  } else {
    // Reset para creación
    initialData.value = { 
      nombreproducto: '', 
      categoriaid: null, 
      marcaid: null 
    };
    productVariants.value = [];
  }
};

onMounted(async () => {
  await loadCatalogos();
  await loadProductData();
});

// Observar cambios en el ID
watch(() => route.params.id, loadProductData);

// ==========================================
// MANEJO DE VARIANTES
// ==========================================
const openAddVariant = () => {
  editingVariant.value = null;
  editingVariantIndex.value = null;
  isModalOpen.value = true;
};

const openEditVariant = (variant, index) => {
  editingVariant.value = { ...variant };
  editingVariantIndex.value = index;
  isModalOpen.value = true;
};

const handleSaveVariant = (variantData) => {
  if (editingVariantIndex.value !== null) {
    // Editar variante existente
    productVariants.value[editingVariantIndex.value] = variantData;
  } else {
    // Agregar nueva variante
    productVariants.value.push(variantData);
  }
};

const handleDeleteVariant = (index) => {
  if (confirm('¿Estás seguro de eliminar esta variante?')) {
    productVariants.value.splice(index, 1);
  }
};

// ==========================================
// GUARDAR PRODUCTO
// ==========================================
const handleSaveAll = async (formData) => {
  if (productVariants.value.length === 0) {
    errorMessage.value = "Debe agregar al menos una variante";
    toast.error(errorMessage.value);
    return;
  }

  try {
    await store.saveProductWithVariants({
      product: {
        productoid: isEdit.value ? Number(productId.value) : undefined,
        nombreproducto: formData.nombreproducto,
        categoriaid: Number(formData.categoriaid),
        marcaid: Number(formData.marcaid),
      },
      variants: productVariants.value,
      sucursalId: 1
    });

    successMessage.value = isEdit.value
      ? `Producto actualizado correctamente`
      : `Producto creado correctamente`;

    toast.success(successMessage.value);
    router.push({ name: 'inventory-list' });

  } catch (error) {
    errorMessage.value = error.message;
    showErrorModal.value = true;
    toast.error(errorMessage.value);
  }
};

const handleCancel = () => {
  router.push({ name: 'inventory-list' });
};

const goToInventory = () => {
  router.push({ name: 'inventory-list' });
};

// ==========================================
// HELPERS
// ==========================================
const formatPrice = (price) => {
  return `S/ ${parseFloat(price).toFixed(2)}`;
};
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 space-y-8">
    <!-- Formulario Principal -->
    <FormTemplate 
      :config="formConfig" 
      :initial-data="initialData"
      @submit="handleSaveAll"
      @cancel="handleCancel"
    >
      <!-- Slot para la lista de variantes -->
      <template #field-variants_list="{ field }">
        <div class="mt-2 space-y-4">
          <div class="flex justify-between items-center mb-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ field.label }}</p>
            <button 
              @click.prevent="openAddVariant" 
              class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm"
            >
              <span class="material-symbols-outlined text-lg">add</span>
              Añadir Variante
            </button>
          </div>

          <!-- Tabla de variantes -->
          <DataTable 
            v-if="productVariants.length > 0"
            :columns="columns" 
            :data="productVariants"
            :show-pagination="false"
            empty-message="No hay variantes agregadas"
          >
            <!-- Precio -->
            <template #cell-precioventa="{ row }">
              <span class="font-bold text-gray-900 dark:text-white">
                {{ formatPrice(row.precio) }}
              </span>
            </template>

            <!-- Acciones -->
            <template #cell-actions="{ row, index }">
              <div class="flex items-center justify-center gap-1">
                <button
                  @click="openEditVariant(row, index)"
                  class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all"
                  title="Editar variante"
                >
                  <span class="material-symbols-outlined text-xl">edit</span>
                </button>
                <button
                  @click="handleDeleteVariant(index)"
                  class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  title="Eliminar variante"
                >
                  <span class="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            </template>
          </DataTable>

          <!-- Empty state -->
          <div 
            v-else 
            class="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <span class="material-symbols-outlined text-6xl text-gray-300">style</span>
            <p class="text-gray-500 mt-2">No hay variantes agregadas</p>
            <p class="text-sm text-gray-400 mt-1">
              Agrega al menos una variante con color, talla, SKU y precio
            </p>
          </div>
          
          <!-- Advertencia -->
          <p 
            v-if="productVariants.length === 0" 
            class="text-xs text-red-500 italic"
          >
            * Se requiere al menos una variante para crear el producto.
          </p>
        </div>
      </template>
    </FormTemplate>

    <!-- Modal de Variante -->
    <VariantModal 
      v-if="isModalOpen" 
      :initial-data="editingVariant"
      @close="isModalOpen = false"
      @save="handleSaveVariant"
    />

    <!-- Modal de Éxito -->
    <BaseModal
      v-model="showSuccessModal"
      type="success"
      :title="isEdit ? '¡Producto actualizado!' : '¡Producto creado!'"
      :message="successMessage"
      primary-button="Ver Inventario"
      secondary-button="Cerrar"
      @primary="goToInventory"
      @secondary="showSuccessModal = false"
    />

    <!-- Modal de Error -->
    <BaseModal
      v-model="showErrorModal"
      type="error"
      title="Error al guardar"
      :message="errorMessage"
      primary-button="Aceptar"
      @primary="showErrorModal = false"
    />
  </div>
</template>