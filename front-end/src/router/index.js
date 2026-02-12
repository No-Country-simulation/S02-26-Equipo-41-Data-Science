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
    {
      path: '/inventario',
      name: 'inventory',
      component: () => import('@/views/InventoryView.vue'),
      meta: { requiresAuth: true }
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

// Navigation guard - verificamos autenticación sin usar el store
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth) {
    // Verificar si hay token en localStorage o sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    
    if (!token) {
      next({ name: 'login' })
      return
    }
  }

  // Si está autenticado e intenta ir a login, redirigir a home
  if (to.name === 'login') {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      next({ name: 'home' })
      return
    }
  }

  next()
})

export default router