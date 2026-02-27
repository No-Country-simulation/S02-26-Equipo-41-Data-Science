import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useInventoryStore = defineStore('inventory', () => {
  // ==========================================
  // STATE
  // ==========================================
  const products = ref([])      // Modelos base
  const variants = ref([])      // Variantes (color + talla)
  const loading = ref(false)
  const error = ref(null)

  // ==========================================
  // GETTERS
  // ==========================================
  
  /**
   * Estadísticas generales del inventario
   */
  const stats = computed(() => {
    const total = products.value.length
    const lowStockVariants = variants.value.filter(v => v.stock > 0 && v.stock < v.minStock).length
    const outOfStockVariants = variants.value.filter(v => v.stock === 0).length
    const totalValue = variants.value.reduce((sum, v) => sum + (v.price * v.stock), 0)

    return {
      total,
      lowStockVariants,
      outOfStockVariants,
      totalValue: `S/ ${totalValue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
    }
  })

  /**
   * Productos enriquecidos con información agregada de variantes
   */
  const enrichedProducts = computed(() => {
    return products.value.map(product => {
      // Obtener variantes del producto
      const productVariants = variants.value.filter(v => v.productId === product.id)
      
      // Stock total (suma de todas las variantes)
      const totalStock = productVariants.reduce((sum, v) => sum + v.stock, 0)
      
      // Contar variantes con problemas
      const lowStockCount = productVariants.filter(v => v.stock > 0 && v.stock < v.minStock).length
      const outOfStockCount = productVariants.filter(v => v.stock === 0).length
      
      // Rango de precios
      const prices = productVariants.map(v => v.price)
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
      const priceRange = minPrice === maxPrice 
        ? `S/ ${minPrice.toFixed(2)}`
        : `S/ ${minPrice.toFixed(2)} – S/ ${maxPrice.toFixed(2)}`
      
      // Determinar estado general de stock
      let stockStatus = 'ok'
      let stockBadge = 'En Stock'
      let stockColor = 'emerald'
      
      if (totalStock === 0) {
        stockStatus = 'out'
        stockBadge = 'Sin Stock'
        stockColor = 'red'
      } else if (totalStock < 20 || lowStockCount > 0) {
        stockStatus = 'low'
        stockBadge = 'Stock Bajo'
        stockColor = 'orange'
      }
      
      // Colores y tallas únicos
      const colors = [...new Set(productVariants.map(v => v.color))].filter(Boolean)
      const sizes = [...new Set(productVariants.map(v => v.size))].filter(Boolean)

      return {
        // Datos del producto base
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        brand: product.brand,
        description: product.description,
        image: product.image,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        
        // Datos agregados de variantes
        variantsCount: productVariants.length,
        colorsCount: colors.length,
        sizesCount: sizes.length,
        colors,
        sizes,
        totalStock,
        priceRange,
        stockStatus,
        stockBadge,
        stockColor,
        lowStockCount,
        outOfStockCount,
        variants: productVariants
      }
    })
  })

  // ==========================================
  // ACTIONS
  // ==========================================
  
  /**
   * Obtener productos y variantes del servidor
   */
  async function fetchProducts() {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Reemplazar con llamada real al API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Datos mock de productos (modelos base)
      products.value = [
        {
          id: 1,
          sku: 'CAL-001',
          name: 'Zapatilla Runner Air Pro',
          category: 'Calzado',
          brand: 'Nike',
          description: 'Zapatilla deportiva de alta calidad con tecnología Air Pro para máximo rendimiento',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
          status: 'active',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-02-20T14:30:00Z'
        },
        {
          id: 2,
          sku: 'ROP-012',
          name: 'Polo Algodón Premium',
          category: 'Ropa',
          brand: 'Lacoste',
          description: 'Polo de algodón 100% premium con diseño clásico',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          status: 'active',
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-02-18T11:20:00Z'
        },
        {
          id: 3,
          sku: 'ROP-045',
          name: 'Casaca Jean Vintage',
          category: 'Ropa',
          brand: 'Levis',
          description: 'Casaca jean con estilo vintage y acabado desgastado',
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
          status: 'active',
          createdAt: '2024-01-20T15:00:00Z',
          updatedAt: '2024-02-22T09:45:00Z'
        },
        {
          id: 4,
          sku: 'CAL-088',
          name: 'Bota Trekking Explorer',
          category: 'Calzado',
          brand: 'Timberland',
          description: 'Bota resistente para trekking y aventura en cualquier terreno',
          image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
          status: 'active',
          createdAt: '2024-02-01T08:00:00Z',
          updatedAt: '2024-02-25T16:00:00Z'
        }
      ]
      
      // Datos mock de variantes
      variants.value = [
        // Zapatilla Runner Air Pro - CAL-001 (8 variantes)
        { id: 1, productId: 1, sku: 'CAL-001-RJ-38', color: 'Rojo', size: '38', price: 249.90, cost: 150.00, stock: 5, minStock: 10 },
        { id: 2, productId: 1, sku: 'CAL-001-RJ-39', color: 'Rojo', size: '39', price: 249.90, cost: 150.00, stock: 8, minStock: 10 },
        { id: 3, productId: 1, sku: 'CAL-001-RJ-40', color: 'Rojo', size: '40', price: 249.90, cost: 150.00, stock: 12, minStock: 10 },
        { id: 4, productId: 1, sku: 'CAL-001-RJ-41', color: 'Rojo', size: '41', price: 249.90, cost: 150.00, stock: 15, minStock: 10 },
        { id: 5, productId: 1, sku: 'CAL-001-AZ-40', color: 'Azul', size: '40', price: 249.90, cost: 150.00, stock: 10, minStock: 10 },
        { id: 6, productId: 1, sku: 'CAL-001-AZ-41', color: 'Azul', size: '41', price: 249.90, cost: 150.00, stock: 22, minStock: 10 },
        { id: 7, productId: 1, sku: 'CAL-001-NG-40', color: 'Negro', size: '40', price: 269.90, cost: 160.00, stock: 8, minStock: 10 },
        { id: 8, productId: 1, sku: 'CAL-001-NG-41', color: 'Negro', size: '41', price: 269.90, cost: 160.00, stock: 6, minStock: 10 },
        
        // Polo Algodón Premium - ROP-012 (5 variantes)
        { id: 9, productId: 2, sku: 'ROP-012-BL-S', color: 'Blanco', size: 'S', price: 45.00, cost: 25.00, stock: 2, minStock: 5 },
        { id: 10, productId: 2, sku: 'ROP-012-BL-M', color: 'Blanco', size: 'M', price: 45.00, cost: 25.00, stock: 3, minStock: 5 },
        { id: 11, productId: 2, sku: 'ROP-012-BL-L', color: 'Blanco', size: 'L', price: 45.00, cost: 25.00, stock: 5, minStock: 5 },
        { id: 12, productId: 2, sku: 'ROP-012-AZ-M', color: 'Azul', size: 'M', price: 45.00, cost: 25.00, stock: 0, minStock: 5 },
        { id: 13, productId: 2, sku: 'ROP-012-NG-M', color: 'Negro', size: 'M', price: 45.00, cost: 25.00, stock: 8, minStock: 5 },
        
        // Casaca Jean Vintage - ROP-045 (3 variantes - TODAS SIN STOCK)
        { id: 14, productId: 3, sku: 'ROP-045-AZ-M', color: 'Azul', size: 'M', price: 120.00, cost: 70.00, stock: 0, minStock: 3 },
        { id: 15, productId: 3, sku: 'ROP-045-AZ-L', color: 'Azul', size: 'L', price: 120.00, cost: 70.00, stock: 0, minStock: 3 },
        { id: 16, productId: 3, sku: 'ROP-045-AZ-XL', color: 'Azul', size: 'XL', price: 145.00, cost: 85.00, stock: 0, minStock: 3 },
        
        // Bota Trekking Explorer - CAL-088 (4 variantes)
        { id: 17, productId: 4, sku: 'CAL-088-NG-40', color: 'Negro', size: '40', price: 385.50, cost: 250.00, stock: 3, minStock: 5 },
        { id: 18, productId: 4, sku: 'CAL-088-NG-41', color: 'Negro', size: '41', price: 385.50, cost: 250.00, stock: 4, minStock: 5 },
        { id: 19, productId: 4, sku: 'CAL-088-NG-42', color: 'Negro', size: '42', price: 385.50, cost: 250.00, stock: 2, minStock: 5 },
        { id: 20, productId: 4, sku: 'CAL-088-MA-41', color: 'Marrón', size: '41', price: 385.50, cost: 250.00, stock: 6, minStock: 5 }
      ]
      
      return { products: products.value, variants: variants.value }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching products:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function saveProduct(productData, productVariants) {
    loading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Convertimos el ID a número de forma segura
      const isEdit = !!productData.id;
      const numericProductId = isEdit ? Number(productData.id) : null;

      if (isEdit) {
        // 1. Actualizar modelo base
        const pIndex = products.value.findIndex(p => p.id === numericProductId);
        if (pIndex !== -1) {
          products.value[pIndex] = { 
            ...products.value[pIndex], 
            ...productData, 
            id: numericProductId, // Forzamos Number
            updatedAt: new Date().toISOString() 
          };
        }
        
        // 2. Limpiar variantes viejas y asociar las nuevas asegurando el tipado
        variants.value = variants.value.filter(v => Number(v.productId) !== numericProductId);
        const variantsWithId = productVariants.map(v => ({ 
          ...v, 
          productId: numericProductId,
          price: Number(v.price) || 0, // Doble validación en la persistencia
          stock: Number(v.stock) || 0
        }));
        variants.value.push(...variantsWithId);

      } else {
        // Lógica de Creación
        const newId = Math.max(0, ...products.value.map(p => p.id)) + 1;
        products.value.push({ 
          ...productData, 
          id: newId, 
          createdAt: new Date().toISOString() 
        });
        
        const newVariants = productVariants.map(v => ({ 
          ...v, 
          id: Date.now() + Math.random(), 
          productId: newId,
          price: Number(v.price) || 0,
          stock: Number(v.stock) || 0
        }));
        variants.value.push(...newVariants);
      }
      
      return true;
    } catch (err) {
      error.value = "Error al guardar el producto";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Obtener un producto por ID (con variantes)
   */
  async function getProductById(id) {
    let product = enrichedProducts.value.find(p => p.id == id)
    
    if (!product) {
      await fetchProducts()
      product = enrichedProducts.value.find(p => p.id == id)
    }
    
    return product || null
  }

  /**
   * Filtrar productos según criterios
   */
  function getFilteredProducts(filters) {
    let result = [...enrichedProducts.value]

    // Búsqueda por nombre, SKU o marca
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
      result = result.filter(p => p.category === filters.quickFilter)
    }

    // Filtros avanzados
    if (filters.advanced) {
      // Filtro de stock
      if (filters.advanced.stock) {
        const stockFilter = filters.advanced.stock
        if (stockFilter === 'out') {
          result = result.filter(p => p.totalStock === 0)
        } else if (stockFilter === 'low') {
          result = result.filter(p => p.stockStatus === 'low')
        } else if (stockFilter === 'ok') {
          result = result.filter(p => p.stockStatus === 'ok')
        }
      }

      // Filtro de precio
      if (filters.advanced.priceRange) {
        const range = filters.advanced.priceRange
        result = result.filter(p => {
          const prices = p.variants.map(v => v.price)
          if (prices.length === 0) return false
          
          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)
          
          if (range === '0-50') {
            return minPrice <= 50
          } else if (range === '50-200') {
            return maxPrice > 50 && minPrice <= 200
          } else if (range === '200-500') {
            return maxPrice > 200 && minPrice <= 500
          } else if (range === '500+') {
            return minPrice > 500
          }
          return true
        })
      }
    }

    return result
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    products,
    variants,
    loading,
    error,
    
    // Getters
    stats,
    enrichedProducts,
    
    // Actions
    fetchProducts,
    saveProduct,
    getProductById,
    getFilteredProducts,
    clearError
  }
})