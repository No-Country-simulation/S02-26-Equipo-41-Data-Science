<template>
  <div :class="['flex items-center gap-2', centerClass]">
    <img 
      src="@/assets/img/logo-compania.png"
      alt="Logo de la compañia"
      :class="logoSizeClass"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  center: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: 'analytics'
  }
})


const logoSizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-6 w-auto'
    case 'lg':
      return 'h-18 w-auto'
    default:
      return 'h-12 w-auto'
  }
})

const centerClass = computed(() => props.center ? 'justify-center' : '')
</script>