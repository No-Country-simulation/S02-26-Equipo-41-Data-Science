/**
 * TableBuilder - Patrón Builder para configurar tablas de forma fluida
 * 
 * Uso:
 * const tableConfig = new TableBuilder()
 *   .addColumn('name', 'Nombre')
 *   .addColumn('email', 'Correo', 'left')
 *   .addColumn('status', 'Estado', 'center')
 *   .setPagination(10)
 *   .setEmptyMessage('No hay productos')
 *   .build()
 */

export class TableBuilder {
  constructor() {
    this.config = {
      columns: [],
      pagination: {
        enabled: true,
        itemsPerPage: 10
      },
      empty: {
        message: 'No hay datos para mostrar',
        icon: 'inbox'
      },
      rowKey: 'id'
    }
  }

  /**
   * Agregar una columna a la tabla
   * @param {string} key - Clave del dato (soporta notación de punto: 'user.name')
   * @param {string} label - Etiqueta visible
   * @param {string} align - Alineación: 'left', 'center', 'right'
   * @param {object} options - Opciones adicionales { sortable, width, etc }
   */
  addColumn(key, label, align = 'left', options = {}) {
    this.config.columns.push({
      key,
      label,
      align,
      ...options
    })
    return this
  }

  /**
   * Configurar paginación
   * @param {number} itemsPerPage - Items por página
   * @param {boolean} enabled - Habilitar/deshabilitar paginación
   */
  setPagination(itemsPerPage = 10, enabled = true) {
    this.config.pagination = {
      enabled,
      itemsPerPage
    }
    return this
  }

  /**
   * Configurar mensaje de tabla vacía
   * @param {string} message - Mensaje a mostrar
   * @param {string} icon - Icono Material Symbols
   */
  setEmptyMessage(message, icon = 'inbox') {
    this.config.empty = { message, icon }
    return this
  }

  /**
   * Configurar la clave única de cada fila
   * @param {string} key - Nombre del campo que sirve como ID único
   */
  setRowKey(key) {
    this.config.rowKey = key
    return this
  }

  /**
   * Deshabilitar paginación
   */
  disablePagination() {
    this.config.pagination.enabled = false
    return this
  }

  /**
   * Construir la configuración final
   */
  build() {
    return { ...this.config }
  }

  /**
   * Resetear el builder a su estado inicial
   */
  reset() {
    this.config = {
      columns: [],
      pagination: {
        enabled: true,
        itemsPerPage: 10
      },
      empty: {
        message: 'No hay datos para mostrar',
        icon: 'inbox'
      },
      rowKey: 'id'
    }
    return this
  }
}

/**
 * FiltersBuilder - Patrón Builder para configurar filtros
 */
export class FiltersBuilder {
  constructor() {
    this.config = {
      search: {
        enabled: true,
        placeholder: 'Buscar...'
      },
      quickFilters: [],
      advancedFilters: []
    }
  }

  /**
   * Configurar búsqueda
   * @param {string} placeholder - Placeholder del input
   * @param {boolean} enabled - Habilitar/deshabilitar
   */
  setSearch(placeholder = 'Buscar...', enabled = true) {
    this.config.search = { enabled, placeholder }
    return this
  }

  /**
   * Agregar filtro rápido (tabs/botones)
   * @param {string} value - Valor del filtro
   * @param {string} label - Etiqueta visible
   */
  addQuickFilter(value, label) {
    this.config.quickFilters.push({ value, label })
    return this
  }

  /**
   * Agregar filtro avanzado
   * @param {string} key - Clave del filtro
   * @param {string} label - Etiqueta visible
   * @param {string} type - Tipo: 'select', 'text', 'number', 'date'
   * @param {array} options - Opciones para select: [{ value, label }]
   * @param {string} placeholder - Placeholder
   */
  addAdvancedFilter(key, label, type = 'select', options = [], placeholder = '') {
    this.config.advancedFilters.push({
      key,
      label,
      type,
      options,
      placeholder
    })
    return this
  }

  /**
   * Agregar filtro de selección
   */
  addSelectFilter(key, label, options, placeholder = 'Todos') {
    return this.addAdvancedFilter(key, label, 'select', options, placeholder)
  }

  /**
   * Agregar filtro de texto
   */
  addTextFilter(key, label, placeholder = '') {
    return this.addAdvancedFilter(key, label, 'text', [], placeholder)
  }

  /**
   * Agregar filtro numérico
   */
  addNumberFilter(key, label, placeholder = '') {
    return this.addAdvancedFilter(key, label, 'number', [], placeholder)
  }

  /**
   * Agregar filtro de fecha
   */
  addDateFilter(key, label) {
    return this.addAdvancedFilter(key, label, 'date')
  }

  /**
   * Deshabilitar búsqueda
   */
  disableSearch() {
    this.config.search.enabled = false
    return this
  }

  /**
   * Construir la configuración final
   */
  build() {
    return { ...this.config }
  }

  /**
   * Resetear el builder
   */
  reset() {
    this.config = {
      search: {
        enabled: true,
        placeholder: 'Buscar...'
      },
      quickFilters: [],
      advancedFilters: []
    }
    return this
  }
}

// Funciones helper para uso rápido
export const createTable = () => new TableBuilder()
export const createFilters = () => new FiltersBuilder()