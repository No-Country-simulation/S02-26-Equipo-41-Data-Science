<template>
  <nav class="flex flex-wrap items-center gap-2 mb-6 text-sm" aria-label="Breadcrumb">
    <template v-for="(item, index) in items" :key="index">
      <!-- Link (si tiene ruta) -->
      <router-link
        v-if="item.to && index < items.length - 1"
        :to="item.to"
        class="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
      >
        {{ item.label }}
      </router-link>
      
      <!-- Último item (activo, sin link) -->
      <span
        v-else
        :class="[
          'font-bold',
          item.to ? 'text-gray-500 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer' : 'text-primary'
        ]"
      >
        {{ item.label }}
      </span>
      
      <!-- Separador (no mostrar después del último item) -->
      <span
        v-if="index < items.length - 1"
        class="material-symbols-outlined text-xs text-gray-400 dark:text-gray-600"
      >
        chevron_right
      </span>
    </template>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => {
      return items.every(item => 
        typeof item === 'object' && 
        'label' in item
      )
    }
  }
})
</script>