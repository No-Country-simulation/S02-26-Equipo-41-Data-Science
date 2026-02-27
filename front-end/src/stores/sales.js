import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSalesStore = defineStore('sales', () => {
  // ==========================================
  // STATE - CARRITO
  // ==========================================
  const cart = ref([])
  const selectedPaymentMethod = ref('efectivo')
  const notes = ref('')
  
  // ==========================================
  // STATE - CLIENTE
  // ==========================================
  const selectedClient = ref(null)
  const searchClientQuery = ref('')
  
  // ==========================================
  // CLIENTES MOCK
  // ==========================================
  const clients = ref([
    {
      id: 1,
      name: 'Juan Pérez',
      documentType: 'DNI',
      documentNumber: '35123456',
      location: 'Buenos Aires, CABA',
      clientType: 'Frecuente'
    },
    {
      id: 2,
      name: 'María García',
      documentType: 'CUIT',
      documentNumber: '27-44556677-9',
      location: 'Rosario, Santa Fe',
      clientType: 'Mayorista'
    },
    {
      id: 3,
      name: 'Carlos López',
      documentType: 'DNI',
      documentNumber: '22987654',
      location: 'Córdoba Capital',
      clientType: 'Final'
    }
  ])

  // ==========================================
  // GETTERS - CARRITO
  // ==========================================
  
  /**
   * Subtotal (sin IVA)
   */
  const subtotal = computed(() => {
    return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  /**
   * IVA (21%)
   */
  const iva = computed(() => {
    return subtotal.value * 0.21
  })

  /**
   * Total (subtotal + IVA)
   */
  const total = computed(() => {
    return subtotal.value + iva.value
  })

  /**
   * Cantidad total de items
   */
  const totalItems = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  /**
   * ¿Carrito vacío?
   */
  const isEmpty = computed(() => {
    return cart.value.length === 0
  })

  /**
   * Cliente actual (seleccionado o consumidor final)
   */
  const currentClient = computed(() => {
    return selectedClient.value || {
      id: null,
      name: 'Consumidor Final',
      documentType: '',
      documentNumber: '',
      location: '',
      clientType: 'Final'
    }
  })

  /**
   * Clientes filtrados por búsqueda
   */
  const filteredClients = computed(() => {
    if (!searchClientQuery.value) return clients.value
    
    const search = searchClientQuery.value.toLowerCase()
    return clients.value.filter(client =>
      client.name.toLowerCase().includes(search) ||
      client.documentNumber.includes(search)
    )
  })

  // ==========================================
  // ACTIONS - CARRITO
  // ==========================================
  
  /**
   * Agregar producto al carrito
   */
  function addToCart(variant, productName, quantity = 1) {
    // Verificar si ya existe en el carrito
    const existingItem = cart.value.find(item => item.variantId === variant.id)
    
    if (existingItem) {
      // Aumentar cantidad si no excede el stock
      const newQuantity = existingItem.quantity + quantity
      if (newQuantity <= variant.stock) {
        existingItem.quantity = newQuantity
      } else {
        throw new Error(`Stock insuficiente. Disponible: ${variant.stock}`)
      }
    } else {
      // Agregar nuevo item
      if (quantity > variant.stock) {
        throw new Error(`Stock insuficiente. Disponible: ${variant.stock}`)
      }
      
      cart.value.push({
        variantId: variant.id,
        productId: variant.productId,
        sku: variant.sku,
        name: productName, // Nombre del producto base
        color: variant.color,
        size: variant.size,
        price: variant.price,
        quantity: quantity,
        maxStock: variant.stock,
        hasLowStock: variant.stock < variant.minStock
      })
    }
  }

  /**
   * Remover producto del carrito
   */
  function removeFromCart(variantId) {
    const index = cart.value.findIndex(item => item.variantId === variantId)
    if (index !== -1) {
      cart.value.splice(index, 1)
    }
  }

  /**
   * Actualizar cantidad de un item
   */
  function updateQuantity(variantId, newQuantity) {
    const item = cart.value.find(i => i.variantId === variantId)
    if (!item) return
    
    if (newQuantity <= 0) {
      removeFromCart(variantId)
      return
    }
    
    if (newQuantity > item.maxStock) {
      throw new Error(`Stock insuficiente. Disponible: ${item.maxStock}`)
    }
    
    item.quantity = newQuantity
  }

  /**
   * Incrementar cantidad
   */
  function incrementQuantity(variantId) {
    const item = cart.value.find(i => i.variantId === variantId)
    if (!item) return
    
    if (item.quantity < item.maxStock) {
      item.quantity++
    } else {
      throw new Error(`Stock insuficiente. Disponible: ${item.maxStock}`)
    }
  }

  /**
   * Decrementar cantidad
   */
  function decrementQuantity(variantId) {
    const item = cart.value.find(i => i.variantId === variantId)
    if (!item) return
    
    if (item.quantity > 1) {
      item.quantity--
    } else {
      removeFromCart(variantId)
    }
  }

  /**
   * Limpiar carrito
   */
  function clearCart() {
    cart.value = []
    selectedPaymentMethod.value = 'efectivo'
    notes.value = ''
  }

  // ==========================================
  // ACTIONS - CLIENTE
  // ==========================================
  
  /**
   * Seleccionar cliente
   */
  function selectClient(client) {
    selectedClient.value = client
  }

  /**
   * Quitar cliente seleccionado (volver a consumidor final)
   */
  function removeClient() {
    selectedClient.value = null
  }

  /**
   * Buscar cliente
   */
  function searchClient(query) {
    searchClientQuery.value = query
  }

  // ==========================================
  // ACTIONS - MÉTODOS DE PAGO
  // ==========================================
  
  /**
   * Seleccionar método de pago
   */
  function selectPaymentMethod(method) {
    selectedPaymentMethod.value = method
  }

  // ==========================================
  // ACTIONS - VENTA
  // ==========================================
  
  /**
   * Confirmar venta
   */
  async function confirmSale() {
    if (isEmpty.value) {
      throw new Error('El carrito está vacío')
    }
    
    try {
      // TODO: Llamada al API para registrar la venta
      const saleData = {
        clientId: currentClient.value.id,
        items: cart.value.map(item => ({
          variantId: item.variantId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        paymentMethod: selectedPaymentMethod.value,
        subtotal: subtotal.value,
        iva: iva.value,
        total: total.value,
        notes: notes.value,
        date: new Date().toISOString()
      }
      
      // Simular llamada al API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('Venta registrada:', saleData)
      
      // Limpiar estado después de confirmar
      clearCart()
      removeClient()
      
      return saleData
    } catch (error) {
      console.error('Error al confirmar venta:', error)
      throw error
    }
  }

  return {
    // State
    cart,
    selectedPaymentMethod,
    notes,
    selectedClient,
    searchClientQuery,
    clients,
    
    // Getters
    subtotal,
    iva,
    total,
    totalItems,
    isEmpty,
    currentClient,
    filteredClients,
    
    // Actions - Carrito
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    
    // Actions - Cliente
    selectClient,
    removeClient,
    searchClient,
    
    // Actions - Pago
    selectPaymentMethod,
    
    // Actions - Venta
    confirmSale
  }
})