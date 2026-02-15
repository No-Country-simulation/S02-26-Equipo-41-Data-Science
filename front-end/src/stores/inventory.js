import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const products = ref([])
  const loading = ref(false)

  // Getters
  const stats = computed(() => {
    const total = products.value.length
    const lowStock = products.value.filter(p => p.stock > 0 && p.stock < 10).length
    const outOfStock = products.value.filter(p => p.stock === 0).length
    const totalValue = products.value.reduce((sum, p) => sum + (p.price * p.stock), 0)

    return {
      total,
      lowStock,
      outOfStock,
      totalValue: `S/ ${totalValue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
    }
  })

  // Actions
  async function fetchProducts() {
    loading.value = true
    try {
      // Simulación de API call - Reemplazar con llamada real
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Datos de ejemplo
      products.value = [
        {
          id: 1,
          sku: 'CAL-001',
          name: 'Zapatilla Runner Air Pro - Rojo',
          category: 'Calzado',
          brand: 'Nike',
          description: 'Zapatilla deportiva de alta calidad con tecnología Air Pro',
          price: 249.90,
          cost: 150.00,
          stock: 42,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
        },
        {
          id: 2,
          sku: 'ROP-012',
          name: 'Polo Algodón Premium - Blanco',
          category: 'Ropa',
          brand: 'Lacoste',
          description: 'Polo de algodón 100% premium',
          price: 45.00,
          cost: 25.00,
          stock: 3,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
        },
        {
          id: 3,
          sku: 'ROP-045',
          name: 'Casaca Jean Vintage - Azul',
          category: 'Ropa',
          brand: 'Levis',
          description: 'Casaca jean con estilo vintage',
          price: 120.00,
          cost: 70.00,
          stock: 0,
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'
        },
        {
          id: 4,
          sku: 'CAL-088',
          name: 'Bota Trekking Explorer - Negro',
          category: 'Calzado',
          brand: 'Timberland',
          description: 'Bota resistente para trekking y aventura',
          price: 385.50,
          cost: 250.00,
          stock: 9,
          image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400'
        }
      ]
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function getProductById(id) {
    // Primero buscar en el estado local
    let product = products.value.find(p => p.id == id)
    
    if (!product) {
      // Si no está en el estado, cargar todos los productos
      await fetchProducts()
      product = products.value.find(p => p.id == id)
    }
    
    return product || null
  }

  async function createProduct(productData) {
    try {
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newProduct = {
        id: Math.max(...products.value.map(p => p.id), 0) + 1,
        ...productData,
        createdAt: new Date().toISOString()
      }
      
      products.value.push(newProduct)
      return newProduct
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async function updateProduct(id, productData) {
    try {
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = products.value.findIndex(p => p.id == id)
      if (index !== -1) {
        products.value[index] = {
          ...products.value[index],
          ...productData,
          updatedAt: new Date().toISOString()
        }
        return products.value[index]
      }
      throw new Error('Product not found')
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async function deleteProduct(id) {
    try {
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = products.value.findIndex(p => p.id == id)
      if (index !== -1) {
        products.value.splice(index, 1)
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  function getFilteredProducts(filters) {
    let result = [...products.value]

    // Búsqueda
    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search) ||
        (p.brand && p.brand.toLowerCase().includes(search))
      )
    }

    // Filtro rápido de categoría
    if (filters.quickFilter && filters.quickFilter !== 'all') {
      const categoryMap = {
        clothing: 'Ropa',
        footwear: 'Calzado'
      }
      const category = categoryMap[filters.quickFilter]
      if (category) {
        result = result.filter(p => p.category === category)
      }
    }

    // Filtros avanzados
    if (filters.advanced) {
      // Filtro de stock
      if (filters.advanced.stock) {
        const stockFilter = filters.advanced.stock
        if (stockFilter === 'out') {
          result = result.filter(p => p.stock === 0)
        } else if (stockFilter === 'low') {
          result = result.filter(p => p.stock > 0 && p.stock < 10)
        } else if (stockFilter === 'ok') {
          result = result.filter(p => p.stock >= 10)
        }
      }

      // Filtro de precio
      if (filters.advanced.priceRange) {
        const range = filters.advanced.priceRange
        if (range === '0-50') {
          result = result.filter(p => p.price >= 0 && p.price <= 50)
        } else if (range === '50-200') {
          result = result.filter(p => p.price > 50 && p.price <= 200)
        } else if (range === '200-500') {
          result = result.filter(p => p.price > 200 && p.price <= 500)
        } else if (range === '500+') {
          result = result.filter(p => p.price > 500)
        }
      }
    }

    return result
  }

  return {
    products,
    loading,
    stats,
    fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getFilteredProducts
  }
})