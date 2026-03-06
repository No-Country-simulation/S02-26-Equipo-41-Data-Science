<template>
  <div
    class="bg-white dark:bg-background-dark p-4 rounded-xl border border-slate-100 dark:border-slate-400 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4"
    @click="$emit('click')"
  >
    <div class="size-12 rounded-lg bg-blue-50 dark:bg-blue-500/30 text-primary flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined">{{ icon }}</span>
    </div>
    <div>
      <p class="text-xs font-bold text-slate-400 uppercase tracking-tight">{{ label }}</p>
      <p class="text-lg font-bold text-slate-900 dark:text-white">{{ value }}</p>
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
