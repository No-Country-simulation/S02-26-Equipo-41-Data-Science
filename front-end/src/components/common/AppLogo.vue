<template>
  <div :class="['flex items-center gap-2', centerClass]">
    <span 
      aria-hidden="true" 
      class="material-symbols-outlined text-primary"
      :class="iconSizeClass"
    >
      {{ icon }}
    </span>
    <h1 
      :class="[
        'text-text-primary dark:text-white font-black tracking-tight uppercase',
        textSizeClass
      ]"
    >
      DATAMARK
    </h1>
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

const iconSizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-2xl'
    case 'lg':
      return 'text-5xl'
    default:
      return 'text-4xl'
  }
})

const textSizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xl'
    case 'lg':
      return 'text-4xl'
    default:
      return 'text-3xl'
  }
})

const centerClass = computed(() => props.center ? 'justify-center' : '')
</script>