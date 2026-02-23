import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store de Ventas — DATAMARK
 * Maneja el estado del carrito, productos, clientes y registro de ventas
 */
export const useSalesStore = defineStore('sales', () => {

  // ── Estado ────────────────────────────────────────
  const cartItems   = ref([])
  const saleNotes   = ref('')
  const selectedClient  = ref(null)
  const selectedPayment = ref('cash')
  const salesHistory    = ref([])

  // ── Productos (reemplazar con llamada a API) ───────
  const products = ref([
    { id: 1, name: 'Camisa Oxford Slim Fit Celeste',      sku: 'OX-102-BLU', price: 25000, stock: 45, category: 'Camisas'    },
    { id: 2, name: 'Pantalón Gabardina Beige - Talle 42', sku: 'GB-42-BEI',  price: 32500, stock: 3,  category: 'Pantalones' },
    { id: 3, name: 'Zapatilla Running Pro',               sku: 'ZR-PRO-001', price: 89000, stock: 12, category: 'Calzado'    },
    { id: 4, name: 'Polo Slim Fit Negro',                 sku: 'PS-N-001',   price: 18500, stock: 28, category: 'Polos'      },
    { id: 5, name: 'Jean Skinny Azul - Talle 40',         sku: 'JS-AZ-40',   price: 45000, stock: 7,  category: 'Pantalones' },
  ])

  // ── Clientes (reemplazar con llamada a API) ────────
  const clients = ref([
    { id: 1, name: 'Juan Pérez',   document: 'DNI: 35.123.456',    location: 'Lima, CABA',  type: 'frequent',  typeLabel: 'Frecuente'  },
    { id: 2, name: 'María García', document: 'RUC: 27-44556677-9', location: 'Arequipa',    type: 'wholesale', typeLabel: 'Mayorista'  },
    { id: 3, name: 'Carlos López', document: 'DNI: 22.987.654',    location: 'Cusco',        type: 'final',    typeLabel: 'Final'      },
  ])

  // ── Computed ──────────────────────────────────────
  const cartCount = computed(() => cartItems.value.reduce((s, i) => s + i.qty, 0))
  const subtotal  = computed(() => cartItems.value.reduce((s, i) => s + i.price * i.qty, 0))
  const igv       = computed(() => Math.round(subtotal.value * 0.18))
  const total     = computed(() => subtotal.value + igv.value)
  const isEmpty   = computed(() => cartItems.value.length === 0)

  // ── Acciones del carrito ──────────────────────────
  const addToCart = (product) => {
    const existing = cartItems.value.find(i => i.id === product.id)
    if (existing) {
      if (existing.qty < product.stock) existing.qty++
      return
    }
    cartItems.value.push({ ...product, qty: 1 })
  }

  const removeFromCart = (productId) => {
    cartItems.value = cartItems.value.filter(i => i.id !== productId)
  }

  const increaseQty = (item) => {
    const found = cartItems.value.find(i => i.id === item.id)
    if (found && found.qty < found.stock) found.qty++
  }

  const decreaseQty = (item) => {
    const found = cartItems.value.find(i => i.id === item.id)
    if (found && found.qty > 1) found.qty--
    else if (found && found.qty === 1) removeFromCart(item.id)
  }

  const clearCart = () => {
    cartItems.value    = []
    saleNotes.value    = ''
    selectedClient.value = null
    selectedPayment.value = 'cash'
  }

  // ── Confirmar venta ───────────────────────────────
  const confirmSale = () => {
    if (isEmpty.value) return null

    const sale = {
      id:        Date.now(),
      date:      new Date().toISOString(),
      items:     [...cartItems.value],
      client:    selectedClient.value,
      payment:   selectedPayment.value,
      notes:     saleNotes.value,
      subtotal:  subtotal.value,
      igv:       igv.value,
      total:     total.value,
    }

    salesHistory.value.unshift(sale)

    // Descontar stock
    sale.items.forEach(cartItem => {
      const product = products.value.find(p => p.id === cartItem.id)
      if (product) product.stock -= cartItem.qty
    })

    clearCart()
    return sale
  }

  // ── Búsqueda ──────────────────────────────────────
  const searchProducts = (query) => {
    const q = query.toLowerCase().trim()
    if (!q) return products.value
    return products.value.filter(p =>
      p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    )
  }

  const searchClients = (query) => {
    const q = query.toLowerCase().trim()
    if (!q) return clients.value
    return clients.value.filter(c =>
      c.name.toLowerCase().includes(q) || c.document.toLowerCase().includes(q)
    )
  }

  return {
    // State
    cartItems, saleNotes, selectedClient, selectedPayment,
    salesHistory, products, clients,
    // Computed
    cartCount, subtotal, igv, total, isEmpty,
    // Actions
    addToCart, removeFromCart, increaseQty, decreaseQty,
    clearCart, confirmSale, searchProducts, searchClients,
  }
})