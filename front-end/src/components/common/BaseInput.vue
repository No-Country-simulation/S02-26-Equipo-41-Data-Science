<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="label-base">
      {{ label }}
    </label>
    <div class="relative">
      <span 
        v-if="icon" 
        class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary icon-sm"
      >
        {{ icon }}
      </span>
      <input
        :type="computedType"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="[
          icon ? 'input-with-icon' : 'input-base',
          hasError ? 'border-red-500 focus:ring-red-500' : ''
        ]"
        :required="required"
        :disabled="disabled"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
        @click="togglePassword"
      >
        <span class="material-symbols-outlined icon-sm">
          {{ showPassword ? 'visibility_off' : 'visibility' }}
        </span>
      </button>
    </div>
    <span v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)

const hasError = computed(() => !!props.error)

const computedType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>