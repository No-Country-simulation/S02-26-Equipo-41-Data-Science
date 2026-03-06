<script setup>
import { Bar } from "vue-chartjs"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js"

import { computed } from "vue"

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
)

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  datasets: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ""
  }
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: "top"
    },
    title: {
      display: false
    }
  },

  scales: {
    x: {
      stacked: true,
      grid: {
        display: false
      }
    },
    y: {
      stacked: true,
      grid: {
        color: "#f1f5f9"
      },
      beginAtZero: true
    }
  }
}
</script>

<template>
  <div class="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-100 dark:border-slate-400 shadow-sm">
    <div v-if="title" class="mb-4">
      <h3 class="text-lg font-bold text-slate-900 dark:text-white">
        {{ title }}
      </h3>
    </div>

    <div class="h-[250px]">
      <Bar
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>