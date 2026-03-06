<script setup>
import { computed } from "vue"
import { Line } from "vue-chartjs"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from "chart.js"

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
)

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  labels: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 300
  }
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.title,
      data: props.data,
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59,130,246,0.1)",
      tension: 0.3,
      fill: true,
      pointRadius: 3
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      grid: {
        color: "#eee"
      }
    }
  }
}
</script>

<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3>{{ title }}</h3>
    </div>

    <div class="chart-body" :style="{ height: height + 'px' }">
      <div v-if="loading">Cargando...</div>

      <Line
        v-else
        :data="chartData"
        :options="options"
      />
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.chart-header {
  margin-bottom: 10px;
}

.chart-header h3 {
  font-size: 14px;
  font-weight: 600;
}

.chart-body {
  position: relative;
}
</style>