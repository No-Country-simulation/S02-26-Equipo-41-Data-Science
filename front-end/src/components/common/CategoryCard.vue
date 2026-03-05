<template>
  <div
    class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4"
    @click="$emit('click')"
  >
    <div class="size-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined">{{ icon }}</span>
    </div>
    <div>
      <p class="text-xs font-bold text-slate-400 uppercase tracking-tight">{{ label }}</p>
      <p class="text-lg font-bold text-slate-900">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})

defineEmits(['click'])
</script>
