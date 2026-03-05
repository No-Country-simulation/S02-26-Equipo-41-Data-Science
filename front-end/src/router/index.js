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
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { 
          path: '',
          name: 'dashboard-home',
          component: () => import('@/views/dashboard/DashboardHome.vue'),
          meta: { title: 'Panel de Control' }
        },
        {
          path: 'ventas',
          name: 'dashboard-sales',
          component: () => import('@/views/dashboard/DashboardSales.vue'),
          meta: { title: 'Ventas' }
        },
        {
          path: 'inventario',
          name: 'dashboard-inventory',
          component: () => import('@/views/dashboard/DashboardInventory.vue'),
          meta: { title: 'Inventario' }
        },
        { 
          path: 'clientes', 
          name: 'dashboard-customers',
          component: () => import('@/views/dashboard/DashboardCustomers.vue'), 
          meta: { title: 'Clientes' } 
        },
      ]
    },
    // Rutas de Inventario con subrutas
    {
      path: '/inventario',
      component: () => import('@/views/AppLayout.vue'),
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
      component: () => import('@/views/AppLayout.vue'),
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
      component: () => import('@/views/AppLayout.vue'),
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
      next({ name: 'dashboard' })
      return
    }
  }

  next()
})

export default router