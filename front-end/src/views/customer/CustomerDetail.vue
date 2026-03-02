<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <BaseBreadcrumb :items="breadcrumbItems" class="mb-6" />

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
      <BaseButton @click="goBack" class="mt-4">Volver al listado</BaseButton>
    </div>

    <!-- Contenido -->
    <div v-else-if="client">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
              {{ client.name }}
            </h1>
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                getClientTypeBadge(client.type)
              ]"
            >
              {{ client.type }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-sm">
              <span class="material-symbols-outlined text-base">fingerprint</span>
              ID: CLI-{{ String(client.id).padStart(4, '0') }}
            </p>
            <p class="text-slate-400 dark:text-slate-500 italic text-sm">
              Cliente generado automáticamente a partir de ventas registradas
            </p>
          </div>
        </div>

        <!-- Badge Modo Lectura -->
        <div class="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <span class="material-symbols-outlined text-base">visibility</span>
          Modo lectura
        </div>
      </div>

      <!-- Grid Principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Columna Izquierda (2/3) -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Perfil del Cliente -->
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-lg">person</span>
              <h2 class="font-semibold text-slate-900 dark:text-white uppercase text-sm tracking-wider">
                Perfil del Cliente
              </h2>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <!-- Nombre Completo -->
              <div class="flex flex-col gap-1">
                <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Nombre Completo
                </span>
                <span class="text-slate-900 dark:text-slate-200 font-medium">
                  {{ client.name }}
                </span>
              </div>

              <!-- Documento -->
              <div class="flex flex-col gap-1">
                <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Documento (DNI)
                </span>
                <span class="text-slate-900 dark:text-slate-200 font-medium">
                  {{ client.documentNumber || 'No registrado' }}
                </span>
              </div>

              <!-- Género -->
              <div class="flex flex-col gap-1">
                <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Género
                </span>
                <div class="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-medium">
                  <span class="material-symbols-outlined text-primary/70 text-base">
                    {{ client.gender === 'Masculino' ? 'male' : client.gender === 'Femenino' ? 'female' : 'person' }}
                  </span>
                  {{ client.gender }}
                </div>
              </div>

              <!-- Ubicación -->
              <div class="flex flex-col gap-1">
                <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Ubicación
                </span>
                <div class="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-medium">
                  <span class="material-symbols-outlined text-primary/70 text-base">location_on</span>
                  {{ client.location }}
                </div>
              </div>
            </div>
          </div>

          <!-- Insights de Consumo -->
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-lg">insights</span>
              <h2 class="font-semibold text-slate-900 dark:text-white uppercase text-sm tracking-wider">
                Insights de Consumo
              </h2>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <!-- Producto más comprado -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-primary">
                  <span class="material-symbols-outlined text-xl">shopping_bag</span>
                </div>
                <div class="flex flex-col gap-0.5">
                  <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Producto más comprado
                  </span>
                  <span class="text-slate-900 dark:text-slate-200 font-bold">
                    {{ insights.topProduct }}
                  </span>
                </div>
              </div>

              <!-- Categoría favorita -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-primary">
                  <span class="material-symbols-outlined text-xl">category</span>
                </div>
                <div class="flex flex-col gap-0.5">
                  <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Categoría favorita
                  </span>
                  <span class="text-slate-900 dark:text-slate-200 font-bold">
                    {{ insights.favoriteCategory }}
                  </span>
                </div>
              </div>

              <!-- Frecuencia de compra -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-primary">
                  <span class="material-symbols-outlined text-xl">update</span>
                </div>
                <div class="flex flex-col gap-0.5">
                  <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Frecuencia de compra
                  </span>
                  <span class="text-slate-900 dark:text-slate-200 font-bold">
                    {{ insights.purchaseFrequency }}
                  </span>
                </div>
              </div>

              <!-- Días promedio entre compras -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-primary">
                  <span class="material-symbols-outlined text-xl">calendar_today</span>
                </div>
                <div class="flex flex-col gap-0.5">
                  <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Días prom. entre compras
                  </span>
                  <span class="text-slate-900 dark:text-slate-200 font-bold">
                    {{ insights.avgDaysBetweenPurchases }} días
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contexto Demográfico -->
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-lg">info</span>
              <h2 class="font-semibold text-slate-900 dark:text-white uppercase text-sm tracking-wider">
                Contexto Demográfico
              </h2>
            </div>
            <div class="p-6 flex flex-col gap-8">
              <div class="flex-1 space-y-6">
                <!-- Edad -->
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Edad
                  </span>
                  <span class="text-slate-900 dark:text-slate-200 font-medium">
                    {{ client.age }} años
                  </span>
                </div>

                <!-- Observaciones -->
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Observaciones registradas
                  </span>
                  <div class="p-4 bg-background-light dark:bg-slate-800/50 rounded-lg border-l-4 border-primary/30">
                    <p class="text-sm text-slate-600 dark:text-slate-400 italic">
                      {{ client.observations || 'Sin observaciones registradas.' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha (1/3) -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Resumen Comercial -->
          <div class="bg-primary text-white rounded-xl shadow-xl shadow-primary/20 overflow-hidden">
            <div class="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <h2 class="font-semibold text-lg flex items-center gap-2">
                <span class="material-symbols-outlined">receipt_long</span>
                Resumen Comercial
              </h2>
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                  summary.isActive ? 'bg-green-400 text-green-950' : 'bg-red-400 text-red-950'
                ]"
              >
                {{ summary.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </div>

            <div class="p-6 space-y-8">
              <!-- Total Compras -->
              <div class="space-y-1">
                <span class="text-primary-100 text-xs font-medium uppercase tracking-widest opacity-80">
                  Total Compras
                </span>
                <div class="text-4xl font-bold tracking-tight">
                  <span class="text-2xl font-light opacity-90">S/</span>
                  {{ formatCurrency(client.totalPurchases) }}
                </div>
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-2 gap-4">
                <div class="p-3 bg-white/10 rounded-lg border border-white/10">
                  <span class="text-xs text-white/70 block mb-1">Cantidad de Órdenes</span>
                  <span class="text-2xl font-bold">{{ summary.totalOrders }}</span>
                </div>
                <div class="p-3 bg-white/10 rounded-lg border border-white/10">
                  <span class="text-xs text-white/70 block mb-1">Ticket Promedio</span>
                  <span class="text-lg font-bold">S/ {{ summary.avgTicket }}</span>
                </div>
              </div>

              <!-- Última Compra -->
              <div class="flex items-center gap-3 bg-white/10 p-4 rounded-lg border border-white/10">
                <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined">event</span>
                </div>
                <div>
                  <span class="text-xs text-white/70 block">Última Compra</span>
                  <span class="font-medium">{{ client.lastPurchaseLabel }}</span>
                </div>
              </div>

              <!-- Estado del Cliente -->
              <div class="pt-2">
                <div class="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Estado del Cliente</span>
                  <span class="font-semibold text-white">
                    {{ summary.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
                <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    :class="[
                      'h-full transition-all',
                      summary.isActive ? 'bg-green-400 w-full' : 'bg-red-400 w-1/3'
                    ]"
                  ></div>
                </div>
                <p class="text-[10px] text-white/50 mt-2 italic text-center">
                  Basado en actividad reciente de los últimos 30 días
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useClientsStore } from '@/stores/customers'

const route = useRoute()
const router = useRouter()
const clientsStore = useClientsStore()

// ==========================================
// STATE
// ==========================================
const client = ref(null)
const loading = ref(true)
const error = ref(null)

// ==========================================
// BREADCRUMBS
// ==========================================
const breadcrumbItems = computed(() => [
  { label: 'Clientes', to: '/clientes' },
  { label: 'Detalle de Cliente', to: `/clientes/${route.params.id}`, active: true }
])

// ==========================================
// INSIGHTS (Datos simulados)
// ==========================================
const insights = computed(() => {
  if (!client.value) return {}

  // Insights basados en el tipo de cliente y ubicación
  const insightsByType = {
    'Mayorista': {
      topProduct: 'Polo Algodón Premium',
      favoriteCategory: 'Ropa Corporativa',
      purchaseFrequency: 'Semanal',
      avgDaysBetweenPurchases: 7
    },
    'Premium': {
      topProduct: 'Bota Trekking Explorer',
      favoriteCategory: 'Calzado Premium',
      purchaseFrequency: 'Quincenal',
      avgDaysBetweenPurchases: 15
    },
    'Minorista': {
      topProduct: 'Zapatilla Runner Air Pro',
      favoriteCategory: 'Calzado Deportivo',
      purchaseFrequency: 'Mensual',
      avgDaysBetweenPurchases: 25
    }
  }

  return insightsByType[client.value.type] || insightsByType['Minorista']
})

// ==========================================
// RESUMEN COMERCIAL
// ==========================================
const summary = computed(() => {
  if (!client.value) return {}

  const totalOrders = Math.floor(client.value.totalPurchases / 300)
  const avgTicket = Math.floor(client.value.totalPurchases / totalOrders)

  // Cliente activo si compró en los últimos 30 días
  const lastPurchaseDate = new Date(client.value.lastPurchase)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const isActive = lastPurchaseDate > thirtyDaysAgo

  return {
    totalOrders,
    avgTicket,
    isActive
  }
})

// ==========================================
// UTILITIES
// ==========================================
const getClientTypeBadge = (type) => {
  const badges = {
    'Mayorista': 'bg-primary/10 text-primary border-primary/20',
    'Minorista': 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    'Premium': 'bg-amber-100 text-amber-700 border-amber-200'
  }
  return badges[type] || badges['Minorista']
}

const formatCurrency = (value) => {
  return value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const goBack = () => {
  router.push({ name: 'clients' })
}

// ==========================================
// LIFECYCLE
// ==========================================
onMounted(async () => {
  try {
    const clientId = parseInt(route.params.id)
    
    // Obtener cliente del store
    const fetchedClient = await clientsStore.getClientById(clientId)
    
    if (fetchedClient) {
      // Agregar observaciones simuladas
      client.value = {
        ...fetchedClient,
        documentNumber: generateDocumentNumber(fetchedClient),
        observations: generateObservations(fetchedClient)
      }
    } else {
      error.value = 'Cliente no encontrado'
    }
  } catch (err) {
    error.value = 'Error al cargar el cliente'
    console.error(err)
  } finally {
    loading.value = false
  }
})

// ==========================================
// HELPERS
// ==========================================
function generateDocumentNumber(client) {
  // Generar DNI ficticio basado en el ID
  return String(40000000 + client.id * 123456).substring(0, 8)
}

function generateObservations(client) {
  const observationsByType = {
    'Mayorista': `Cliente corporativo con compras recurrentes de ${client.name.split(' ')[0]}. Interesado en pedidos al por mayor y descuentos por volumen.`,
    'Premium': `Cliente VIP ${client.name} con preferencia por productos de alta gama. Requiere atención personalizada y acceso a colecciones exclusivas.`,
    'Minorista': `Cliente recurrente ${client.name.split(' ')[0]} interesado en productos de uso personal. Buen historial de pagos y fidelidad a la marca.`
  }
  
  return observationsByType[client.type] || `Cliente registrado: ${client.name}.`
}
</script>