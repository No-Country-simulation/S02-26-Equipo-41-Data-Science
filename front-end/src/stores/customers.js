import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useClientsStore = defineStore('clients', () => {
  // ==========================================
  // STATE
  // ==========================================
  const clients = ref([])
  const loading = ref(false)
  const error = ref(null)

  // ==========================================
  // GETTERS
  // ==========================================
  
  /**
   * Estadísticas generales de clientes
   */
  const stats = computed(() => {
    const total = clients.value.length
    const mayoristas = clients.value.filter(c => c.type === 'Mayorista').length
    const minoristas = clients.value.filter(c => c.type === 'Minorista').length
    const premium = clients.value.filter(c => c.type === 'Premium').length
    
    // Total de ventas
    const totalSales = clients.value.reduce((sum, c) => sum + c.totalPurchases, 0)
    
    return {
      total,
      mayoristas,
      minoristas,
      premium,
      totalSales: `S/ ${totalSales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
    }
  })

  // ==========================================
  // ACTIONS
  // ==========================================
  
  /**
   * Obtener clientes del servidor
   */
  async function fetchClients() {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Reemplazar con llamada real al API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Datos mock de clientes
      clients.value = [
        {
          id: 1,
          name: 'Alejandro Mendoza',
          email: 'amendoza@email.com',
          type: 'Mayorista',
          age: 34,
          gender: 'Masculino',
          location: 'Lima, PE',
          totalPurchases: 4250.00,
          lastPurchase: '2024-03-01T10:30:00Z',
          lastPurchaseLabel: 'Hace 2 días',
          avatar: 'AM',
          avatarColor: 'bg-primary/20 text-primary'
        },
        {
          id: 2,
          name: 'Carla Rodríguez',
          email: 'carla.ro@email.com',
          type: 'Minorista',
          age: 28,
          gender: 'Femenino',
          location: 'Arequipa, PE',
          totalPurchases: 850.00,
          lastPurchase: '2024-03-03T10:45:00Z',
          lastPurchaseLabel: 'Hoy, 10:45 AM',
          avatar: 'CR',
          avatarColor: 'bg-emerald-100 text-emerald-600'
        },
        {
          id: 3,
          name: 'Juan Torres',
          email: 'jtorres@business.pe',
          type: 'Premium',
          age: 45,
          gender: 'Masculino',
          location: 'Cusco, PE',
          totalPurchases: 12400.00,
          lastPurchase: '2024-02-25T14:20:00Z',
          lastPurchaseLabel: 'Hace 1 semana',
          avatar: 'JT',
          avatarColor: 'bg-amber-100 text-amber-600'
        },
        {
          id: 4,
          name: 'Lucía Valdivia',
          email: 'luciav@email.com',
          type: 'Minorista',
          age: 22,
          gender: 'Femenino',
          location: 'Trujillo, PE',
          totalPurchases: 1120.00,
          lastPurchase: '2024-03-02T16:15:00Z',
          lastPurchaseLabel: 'Ayer',
          avatar: 'LV',
          avatarColor: 'bg-purple-100 text-purple-600'
        },
        {
          id: 5,
          name: 'Roberto Palacios',
          email: 'rpalacios@gmail.com',
          type: 'Mayorista',
          age: 41,
          gender: 'Masculino',
          location: 'Piura, PE',
          totalPurchases: 3100.00,
          lastPurchase: '2024-04-15T09:00:00Z',
          lastPurchaseLabel: '15 Abr 2024',
          avatar: 'RP',
          avatarColor: 'bg-indigo-100 text-indigo-600'
        },
        {
          id: 6,
          name: 'María Flores',
          email: 'mflores@empresa.pe',
          type: 'Premium',
          age: 38,
          gender: 'Femenino',
          location: 'Lima, PE',
          totalPurchases: 15600.00,
          lastPurchase: '2024-03-01T11:00:00Z',
          lastPurchaseLabel: 'Hace 2 días',
          avatar: 'MF',
          avatarColor: 'bg-rose-100 text-rose-600'
        },
        {
          id: 7,
          name: 'Diego Sánchez',
          email: 'dsanchez@email.com',
          type: 'Minorista',
          age: 31,
          gender: 'Masculino',
          location: 'Arequipa, PE',
          totalPurchases: 720.00,
          lastPurchase: '2024-02-28T15:30:00Z',
          lastPurchaseLabel: 'Hace 3 días',
          avatar: 'DS',
          avatarColor: 'bg-cyan-100 text-cyan-600'
        },
        {
          id: 8,
          name: 'Ana Gutiérrez',
          email: 'agutiérrez@hotmail.com',
          type: 'Mayorista',
          age: 29,
          gender: 'Femenino',
          location: 'Lima, PE',
          totalPurchases: 5800.00,
          lastPurchase: '2024-03-02T08:45:00Z',
          lastPurchaseLabel: 'Ayer',
          avatar: 'AG',
          avatarColor: 'bg-teal-100 text-teal-600'
        },
        {
          id: 9,
          name: 'Carlos Pérez',
          email: 'cperez@negocio.com',
          type: 'Minorista',
          age: 35,
          gender: 'Masculino',
          location: 'Cusco, PE',
          totalPurchases: 950.00,
          lastPurchase: '2024-02-20T12:00:00Z',
          lastPurchaseLabel: 'Hace 2 semanas',
          avatar: 'CP',
          avatarColor: 'bg-orange-100 text-orange-600'
        },
        {
          id: 10,
          name: 'Sofía Ramírez',
          email: 'sofia.ram@gmail.com',
          type: 'Premium',
          age: 42,
          gender: 'Femenino',
          location: 'Lima, PE',
          totalPurchases: 18900.00,
          lastPurchase: '2024-03-03T09:20:00Z',
          lastPurchaseLabel: 'Hoy, 9:20 AM',
          avatar: 'SR',
          avatarColor: 'bg-pink-100 text-pink-600'
        }
      ]
      
      return clients.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching clients:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener cliente por ID
   */
  async function getClientById(id) {
    let client = clients.value.find(c => c.id == id)
    
    if (!client) {
      await fetchClients()
      client = clients.value.find(c => c.id == id)
    }
    
    return client || null
  }

  /**
   * Crear nuevo cliente
   */
  async function createClient(clientData) {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newClient = {
        id: Math.max(...clients.value.map(c => c.id), 0) + 1,
        ...clientData,
        totalPurchases: 0,
        lastPurchase: null,
        lastPurchaseLabel: 'Sin compras',
        avatar: clientData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        avatarColor: getRandomAvatarColor()
      }
      
      clients.value.push(newClient)
      return newClient
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar cliente
   */
  async function updateClient(id, clientData) {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = clients.value.findIndex(c => c.id == id)
      if (index !== -1) {
        clients.value[index] = {
          ...clients.value[index],
          ...clientData
        }
        return clients.value[index]
      }
      throw new Error('Cliente no encontrado')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Eliminar cliente
   */
  async function deleteClient(id) {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = clients.value.findIndex(c => c.id == id)
      if (index !== -1) {
        clients.value.splice(index, 1)
        return true
      }
      return false
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Filtrar clientes según criterios
   */
  function getFilteredClients(filters) {
    let result = [...clients.value]

    // Búsqueda por nombre o email
    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search)
      )
    }

    // Filtro por tipo
    if (filters.quickFilter && filters.quickFilter !== 'all') {
      result = result.filter(p => p.type === filters.quickFilter)
    }

    // Filtros avanzados
    if (filters.advanced) {
      // Filtro de edad
      if (filters.advanced.ageRange) {
        const ageFilter = filters.advanced.ageRange
        if (ageFilter === '18-25') {
          result = result.filter(c => c.age >= 18 && c.age <= 25)
        } else if (ageFilter === '26-40') {
          result = result.filter(c => c.age >= 26 && c.age <= 40)
        } else if (ageFilter === '41+') {
          result = result.filter(c => c.age >= 41)
        }
      }

      // Filtro de género
      if (filters.advanced.gender) {
        result = result.filter(c => c.gender === filters.advanced.gender)
      }

      // Filtro de ubicación
      if (filters.advanced.location) {
        result = result.filter(c => c.location.includes(filters.advanced.location))
      }
    }

    return result
  }

  /**
   * Generar color aleatorio para avatar
   */
  function getRandomAvatarColor() {
    const colors = [
      'bg-primary/20 text-primary',
      'bg-emerald-100 text-emerald-600',
      'bg-amber-100 text-amber-600',
      'bg-purple-100 text-purple-600',
      'bg-indigo-100 text-indigo-600',
      'bg-rose-100 text-rose-600',
      'bg-cyan-100 text-cyan-600',
      'bg-teal-100 text-teal-600',
      'bg-orange-100 text-orange-600',
      'bg-pink-100 text-pink-600'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    clients,
    loading,
    error,
    
    // Getters
    stats,
    
    // Actions
    fetchClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getFilteredClients,
    clearError
  }
})