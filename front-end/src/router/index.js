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
          component: () => import('@/views/inventory/InventoryView.vue'), // Mismo componente
          meta: { title: 'Crear Producto' }
        },
        {
          path: ':id',
          name: 'inventory-detail',
          component: () => import('@/views/inventory/InventoryDetail.vue'),
          meta: { title: 'Detalle de Producto' },
          props: true
        },
        {
          path: ':id/editar',
          name: 'inventory-edit',
          component: () => import('@/views/inventory/InventoryView.vue'), // Mismo componente
          meta: { title: 'Editar Producto' },
          props: true // Esto pasa el :id como prop automáticamente
        },
        {
          path: ':id/ajustar-stock',
          name: 'inventory-adjust-stock',
          component: () => import('@/views/inventory/InventoryStockAdjust.vue'),
          meta: { title: 'Ajustar Stock' },
          props: true,
        },
      ]
    },
    {
      path: '/ventas',
      component: () => import('@/views/sales/SalesLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'sales-list',
          component: () => import('@/views/sales/SalesList.vue'),
          meta: { title: 'Listado de Ventas' }
        },
        {
          path: 'crear',
          name: 'sales-create',
          component: () => import('@/views/sales/SalesCreate.vue'),
          meta: { title: 'Crear Venta' }
        },
      ]    
    },      
    {
      path: '/clientes',
      name: 'customers',
      component: () => import('@/views/customer/CustomerLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path:'',
          name: 'customer-list',
          component: () => import('@/views/customer/CustomerList.vue'),
          meta: { title: 'Listado de Clientes' }
        },
        {
          path: ':id',
          name: 'customer-detail',
          component: () => import('@/views/customer/CustomerDetail.vue'),
          meta: { title: 'Detalle de Cliente' },
          props: true
        }
      ]  
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