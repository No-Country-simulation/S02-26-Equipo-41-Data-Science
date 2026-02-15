import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    // Rutas de Inventario con subrutas
    {
      path: '/inventario',
      component: () => import('@/views/inventory/InventoryLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'inventory-list',
          component: () => import('@/views/inventory/InventoryList.vue'),
          meta: { title: 'Listado de Productos' }
        },
        {
          path: 'crear',
          name: 'inventory-create',
          component: () => import('@/views/inventory/InventoryCreate.vue'),
          meta: { title: 'Crear Producto' }
        },
        {
          path: ':id',
          name: 'inventory-detail',
          component: () => import('@/views/inventory/InventoryDetail.vue'),
          meta: { title: 'Detalle de Producto' },
          props: true
        }
      ]
    },
    {
      path: '/ventas',
      name: 'sales',
      component: () => import('@/views/SalesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/clientes',
      name: 'customers',
      component: () => import('@/views/CustomersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth || to.name === 'login') {
    const { useAuthStore } = await import('@/stores/auth')
    const authStore = useAuthStore()

    if (requiresAuth && !authStore.isAuthenticated) {
      const sessionRestored = authStore.restoreSession()
      
      if (!sessionRestored) {
        next({ name: 'login' })
        return
      }
    }

    if (to.name === 'login' && authStore.isAuthenticated) {
      next({ name: 'home' })
      return
    }
  }

  next()
})

export default router