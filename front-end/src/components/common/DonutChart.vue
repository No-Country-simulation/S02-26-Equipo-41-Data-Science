<template>
  <div class="relative size-44">
    <svg class="size-full -rotate-90" viewBox="0 0 36 36">
      <!-- Track -->
      <circle cx="18" cy="18" r="15.9" fill="none" class="stroke-slate-100" stroke-width="3.5" />
      <!-- Progress -->
      <circle
        cx="18" cy="18" r="15.9" fill="none"
        class="stroke-primary transition-all duration-700"
        stroke-width="3.5"
        stroke-linecap="round"
        :stroke-dasharray="`${percentage} 100`"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-3xl font-bold text-slate-900 dark:text-white">{{ percentage }}%</span>
      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  percentage: { type: Number, required: true },
  label:      { type: String, required: true  }
})
</script>
