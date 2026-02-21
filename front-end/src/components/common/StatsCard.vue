<template>
  <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
    <!-- Header -->
    <div 
      v-if="title"
      class="px-5 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between"
      :class="headerBackground ? 'bg-gray-50/50 dark:bg-slate-800/30' : ''"
    >
      <h3 class="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
        <span v-if="icon" class="material-symbols-outlined text-gray-500 !text-xl">
          {{ icon }}
        </span>
        {{ title }}
      </h3>
      <span v-if="badgeIcon" class="material-symbols-outlined text-primary !text-xl">
        {{ badgeIcon }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-5">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  badgeIcon: {
    type: String,
    default: ''
  },
  headerBackground: {
    type: Boolean,
    default: false
  }
})
</script>