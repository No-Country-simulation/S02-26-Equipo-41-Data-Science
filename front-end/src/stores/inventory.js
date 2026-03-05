import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

export const useInventoryStore = defineStore('inventory', () => {

  // ==========================================
  // STATE
  // ==========================================
  const loading = ref(false)
  const error = ref(null)

  /**
   * Obtener productos y variantes del servidor
   */
  async function fetchProducts({ sucursalId = 1, from, to, filters }) {
    loading.value = true
    error.value = null
    
    try {
   
      let query = supabase
        .from('productos_catalogo_por_sucursal')
        .select('*', { count: 'exact' })
        .eq('sucursalid', sucursalId)
        
      if (filters.search) {
        query = query.ilike('nombreproducto', `%${filters.search}%`)
      }

      if (filters.quickFilter && filters.quickFilter !== 'all') {
        query = query.eq('categoria', filters.quickFilter)
      }

      if (filters.advanced) {
      // Filtro de stock
        if (filters.advanced.stock) {
          const stockFilter = filters.advanced.stock
          if (stockFilter === 'out') {
            query = query.eq('stock_status', 'out')
          } else if (stockFilter === 'low') {
            query = query.eq('stock_status', 'low')
          } else if (stockFilter === 'ok') {
            query = query.eq('stock_status', 'ok')
          }
        }

        // Filtro de precio
        if (filters.advanced.priceRange) {
          const range = filters.advanced.priceRange
          if (range === '0-50') {
            query = query.lte('max_price', 50)
          } else if (range === '50-200') {
            query = query.gte('min_price', 50).lte('max_price', 200)
          } else if (range === '200-500') {
            query = query.gte('min_price', 200).lte('max_price', 500)
          } else if (range === '500+') {
            query = query.gt('min_price', 500)
          }
        }
      }
      
    return await query.range(from, to)  

    } catch (err) {
      error.value = err.message
      console.error('Error fetching products:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function saveProductWithVariants({ product, variants, sucursalId }) {

    // Preparar product JSON limpio
    const productPayload = {
      nombreproducto: product.nombreproducto,
      categoriaid: product.categoriaid,
      marcaid: product.marcaid,
    };

    if (product.productoid) {
      productPayload.productoid = product.productoid;
    }

    // Preparar variantes
    const variantsPayload = variants.map(v => ({
      varianteid: v.varianteid ?? null,
      color: v.color,
      talla: v.talla,
      sku: v.sku,
      precioventa: Number(v.precio)
    }));

    console.log('Payload para RPC:', variantsPayload);

    const { data, error } = await supabase.rpc(
      'save_product_with_variants',
      {
        p_product: productPayload,
        p_variants: variantsPayload,
        p_sucursal_id: sucursalId
      }
    );

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return data;
  }

  async function deleteProduct(productId) {
    const { error } = await supabase.rpc('delete_product', {
      p_product_id: productId
    });

    if (error) throw error;
  }

  /**
   * Obtener un producto por ID (con variantes)
   */
  async function getProductById(productId, sucursalId) {

    const { data, error } = await supabase
      .from('productos_catalogo_por_sucursal')
      .select('*')
      .eq('productoid', productId)
      .eq('sucursalid', sucursalId)
      .single()

    if (error) {
      console.error(error)
      return null
    }

    return data
  }


  async function getCategorias() {
    let { data, error } = await supabase
      .from('categorias')
      .select('*')

    if (error) {
      console.error('Error fetching categorias:', error)
      throw error
    }

    return data || []
  }

  /**
   * Obtener catálogo de marcas
   */
  async function getMarcas() {
    let { data, error } = await supabase
      .from('marcas')
      .select('*')

    if (error) {
      console.error('Error fetching marcas:', error)
      throw error
    }

    return data || []
  }

  /**
   * Obtener tipos de movimiento
   */
  async function getTiposMovimiento() {
    const { data, error } = await supabase
      .from('tipomovimiento')
      .select('tipoid, nombre')
      .order('nombre')

    if (error) {
      console.error('Error fetching tipos movimiento:', error)
      throw error
    }

    return data || []
  }

  /**
   * Obtener proveedores
   */
  async function getProveedores() {
    const { data, error } = await supabase
      .from('proveedores')
      .select('*')
      .order('razonsocial')

    if (error) {
      console.error('Error fetching proveedores:', error)
      throw error
    }

    return data || []
  }

  /**
   * Obtener inventario por variante y sucursal
   */
  async function getInventarioByVariant(varianteid, sucursalid) {
    const { data, error } = await supabase
      .from('inventario')
      .select('inventarioid, varianteid, sucursalid, stockactual')
      .eq('varianteid', varianteid)
      .eq('sucursalid', sucursalid)
      .single()

    if (error) {
      console.error('Error fetching inventario:', error)
      throw error
    }

    return data
  }

  /**
   * Aplicar ajuste de stock mediante RPC
   */
  async function aplicarAjusteStock(ajusteData) {
    loading.value = true
    error.value = null

    try {
      const { data, error: rpcError } = await supabase.rpc(
        'registrar_ajuste_stock',
        {
          p_inventarioid: ajusteData.p_inventarioid,
          p_cantidad: ajusteData.p_cantidad,
          p_tipoid: ajusteData.p_tipoid,
          p_proveedorid: ajusteData.p_proveedorid,
          p_costo_unitario: ajusteData.p_costo_unitario,
          p_motivo: ajusteData.p_motivo,
          p_notas: ajusteData.p_notas,
          p_fecha: ajusteData.p_fecha
        }
      )

      if (rpcError) throw rpcError

      return data

    } catch (err) {
      console.error('Error aplicando ajuste:', err)
      error.value = err.message || "Error al aplicar ajuste de stock"
      throw err
    } finally {
      loading.value = false
    }
  }


  function clearError() {
    error.value = null
  }

  return {
    loading,
    error,
    fetchProducts,
    saveProductWithVariants,
    deleteProduct,
    getProductById,
    getCategorias,
    getMarcas,
    getTiposMovimiento,
    getProveedores,
    getInventarioByVariant,
    aplicarAjusteStock,
    clearError
  }
})