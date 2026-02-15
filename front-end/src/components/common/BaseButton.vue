<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span
      v-if="loading"
      class="material-symbols-outlined animate-spin icon-sm"
    >
      progress_activity
    </span>
    <span v-if="iconLeft && !loading" class="material-symbols-outlined icon-sm">
      {{ iconLeft }}
    </span>
    <span v-if="$slots.default">
      <slot />
    </span>
    <span v-if="iconRight && !loading" class="material-symbols-outlined icon-sm">
      {{ iconRight }}
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost', 'danger'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  iconLeft: {
    type: String,
    default: ''
  },
  iconRight: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  const classes = ['btn']
  
  // Variants
  switch (props.variant) {
    case 'primary':
      classes.push('btn-primary')
      break
    case 'secondary':
      classes.push('btn-secondary')
      break
    case 'ghost':
      classes.push('btn-ghost')
      break
    case 'danger':
      classes.push('bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20')
      break
  }
  
  // Sizes
  switch (props.size) {
    case 'sm':
      classes.push('px-4 py-2 text-sm')
      break
    case 'lg':
      classes.push('px-8 py-4 text-lg')
      break
  }
  
  // Full width
  if (props.fullWidth) {
    classes.push('w-full')
  }
  
  // Disabled state
  if (props.disabled || props.loading) {
    classes.push('opacity-50 cursor-not-allowed')
  }
  
  return classes.join(' ')
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>