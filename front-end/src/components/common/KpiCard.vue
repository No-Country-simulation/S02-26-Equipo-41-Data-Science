<!-- KpiCard.vue - supports variants: default | danger | warning | success -->
<template>
  <div
    :class="[
      'p-5 rounded-xl border shadow-sm flex flex-col justify-between',
      variant === 'danger'
        ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-500 relative overflow-hidden group'
        : 'bg-white dark:bg-background-dark border-slate-100 dark:border-slate-400'
    ]"
  >
    <div class="z-10">
      <p
        :class="[
          'text-xs font-bold uppercase tracking-wider mb-1',
          variant === 'danger' ? 'text-red-600' : 'text-slate-500'
        ]"
      >
        {{ label }}
      </p>

      <div class="flex items-center gap-2">
        <h3
          :class="[
            'text-2xl font-bold',
            variant === 'danger' ? 'text-red-700' : 'text-slate-900 dark:text-white'
          ]"
        >
          {{ value }}
        </h3>
        <span
          v-if="variant === 'danger'"
          class="material-symbols-outlined text-red-500 animate-pulse"
        >
          warning
        </span>
      </div>
    </div>

    <!-- Footer slot: tendencia, meta, subtexto o acción -->
    <div class="mt-3 z-10">
      <!-- Tendencia con ícono (ej: +12.5% vs ayer) -->
      <div
        v-if="trend"
        :class="[
          'flex items-center gap-1.5 text-sm font-bold',
          trend > 0 ? 'text-green-600' : 'text-red-500'
        ]"
      >
        <span class="material-symbols-outlined text-sm font-bold">
          {{ trend > 0 ? 'trending_up' : 'trending_down' }}
        </span>
        <span>{{ trend > 0 ? '+' : '' }}{{ trend }}%</span>
        <span v-if="trendLabel" class="text-[10px] text-slate-400 font-medium ml-1">
          {{ trendLabel }}
        </span>
      </div>

      <!-- Subtexto informativo -->
      <p v-else-if="subtext && variant !== 'danger'" class="text-[10px] text-slate-400 font-medium">
        {{ subtext }}
      </p>

      <!-- Acción (variante danger) -->
      <button
        v-else-if="variant === 'danger' && actionLabel"
        class="text-[10px] text-red-600 font-bold underline"
        @click="$emit('action')"
      >
        {{ actionLabel }}
      </button>
    </div>

    <!-- Ícono decorativo de fondo (variante danger) -->
    <span
      v-if="variant === 'danger' && bgIcon"
      class="material-symbols-outlined absolute -bottom-2 -right-2 text-6xl text-red-100/50 group-hover:scale-110 transition-transform"
    >
      {{ bgIcon }}
    </span>
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
  // Número positivo o negativo para mostrar tendencia
  trend: {
    type: Number,
    default: null
  },
  trendLabel: {
    type: String,
    default: ''
  },
  // Texto pequeño debajo del valor
  subtext: {
    type: String,
    default: ''
  },
  // 'default' | 'danger'
  variant: {
    type: String,
    default: 'default'
  },
  // Solo para variante danger
  actionLabel: {
    type: String,
    default: ''
  },
  bgIcon: {
    type: String,
    default: ''
  }
})

defineEmits(['action'])
</script>
