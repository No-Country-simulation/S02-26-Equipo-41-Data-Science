/**
 * FormBuilder - Patrón Builder para configuración de formularios
 * 
 * Permite crear formularios complejos con secciones, campos y validaciones
 * de forma declarativa y reutilizable.
 * 
 * @example
 * const formConfig = new FormBuilder()
 *   .setTitle('Crear Producto')
 *   .addSection('Información Básica', 'info')
 *   .addTextField('name', 'Nombre del Producto', { required: true })
 *   .addSelectField('category', 'Categoría', categories, { required: true })
 *   .build()
 */

export class FormBuilder {
  constructor() {
    this.config = {
      title: '',
      description: '',
      sections: [],
      submitButton: {
        text: 'Guardar',
        icon: 'save',
        variant: 'primary'
      },
      cancelButton: {
        text: 'Cancelar',
        show: true
      },
      layout: 'default' // 'default' | 'compact' | 'wide'
    }
    this.currentSection = null
  }

  /**
   * Configurar título del formulario
   */
  setTitle(title, description = '') {
    this.config.title = title
    this.config.description = description
    return this
  }

  /**
   * Agregar una sección al formulario
   * @param {string} title - Título de la sección
   * @param {string} icon - Icono Material Symbols
   * @param {object} options - Opciones adicionales { description, columns }
   */
  addSection(title, icon = 'folder', options = {}) {
    this.currentSection = {
      title,
      icon,
      description: options.description || '',
      fields: [],
      columns: options.columns || 2,
      divider: options.divider !== false,
      background: options.background || false
    }
    this.config.sections.push(this.currentSection)
    return this
  }

  /**
   * Agregar campo de texto
   */
  addTextField(name, label, options = {}) {
    this._ensureSection()
    this.currentSection.fields.push({
      type: 'text',
      name,
      label,
      placeholder: options.placeholder || '',
      required: options.required || false,
      disabled: options.disabled || false,
      icon: options.icon || null,
      help: options.help || '',
      defaultValue: options.defaultValue || '',
      colspan: options.colspan || 1,
      validation: options.validation || null
    })
    return this
  }

  /**
   * Agregar campo de número
   */
  addNumberField(name, label, options = {}) {
    this._ensureSection()
    this.currentSection.fields.push({
      type: 'number',
      name,
      label,
      placeholder: options.placeholder || '0',
      required: options.required || false,
      disabled: options.disabled || false,
      prefix: options.prefix || null, // Ej: 'S/', '$'
      suffix: options.suffix || null,
      min: options.min || null,
      max: options.max || null,
      step: options.step || 1,
      help: options.help || '',
      defaultValue: options.defaultValue || '',
      colspan: options.colspan || 1
    })
    return this
  }

  /**
   * Agregar campo de select/dropdown
   */
  addSelectField(name, label, options = [], fieldOptions = {}) {
    this._ensureSection()
    this.currentSection.fields.push({
      type: 'select',
      name,
      label,
      options, // Array de { value, label }
      required: fieldOptions.required || false,
      disabled: fieldOptions.disabled || false,
      placeholder: fieldOptions.placeholder || 'Seleccionar...',
      help: fieldOptions.help || '',
      defaultValue: fieldOptions.defaultValue || '',
      colspan: fieldOptions.colspan || 1
    })
    return this
  }

  /**
   * Agregar campo de textarea
   */
  addTextAreaField(name, label, options = {}) {
    this._ensureSection()
    this.currentSection.fields.push({
      type: 'textarea',
      name,
      label,
      placeholder: options.placeholder || '',
      required: options.required || false,
      disabled: options.disabled || false,
      rows: options.rows || 3,
      help: options.help || '',
      defaultValue: options.defaultValue || '',
      colspan: options.colspan || 2 // Por defecto ocupa todo el ancho
    })
    return this
  }

  /**
   * Agregar campo de fecha
   */
  addDateField(name, label, options = {}) {
    this._ensureSection()
    this.currentSection.fields.push({
      type: 'date',
      name,
      label,
      required: options.required || false,
      disabled: options.disabled || false,
      min: options.min || null,
      max: options.max || null,
      help: options.help || '',
      defaultValue: options.defaultValue || '',
      colspan: options.colspan || 1
    })
    return this
  }

  /**
   * Agregar campo de toggle/switch
   */
  addToggleField(name, label, options = {}) {
    this._ensureSection()
    this.currentSection.fields.push({
      type: 'toggle',
      name,
      label,
      description: options.description || '',
      defaultValue: options.defaultValue || false,
      colspan: options.colspan || 2
    })
    return this
  }

  /**
   * Agregar campo de radio buttons
   */
  addRadioField(name, label, options = [], fieldOptions = {}) {
    this._ensureSection()
    this.currentSection.fields.push({
      type: 'radio',
      name,
      label,
      options, // Array de { value, label }
      required: fieldOptions.required || false,
      defaultValue: fieldOptions.defaultValue || '',
      colspan: fieldOptions.colspan || 2,
      layout: fieldOptions.layout || 'horizontal' // 'horizontal' | 'vertical'
    })
    return this
  }

  /**
   * Agregar campo de checkboxes
   */
  addCheckboxField(name, label, options = {}) {
    this._ensureSection()
    this.currentSection.fields.push({
      type: 'checkbox',
      name,
      label,
      description: options.description || '',
      defaultValue: options.defaultValue || false,
      colspan: options.colspan || 2
    })
    return this
  }

  /**
   * Agregar campo de archivo/imagen
   */
  addFileField(name, label, options = {}) {
    this._ensureSection()
    this.currentSection.fields.push({
      type: 'file',
      name,
      label,
      accept: options.accept || 'image/*',
      multiple: options.multiple || false,
      help: options.help || 'PNG, JPG hasta 5MB',
      colspan: options.colspan || 2,
      preview: options.preview !== false
    })
    return this
  }

  /**
   * Agregar campo personalizado (para casos especiales)
   */
  addCustomField(name, component, options = {}) {
    this._ensureSection()
    this.currentSection.fields.push({
      type: 'custom',
      name,
      component, // Nombre del componente Vue
      props: options.props || {},
      colspan: options.colspan || 1
    })
    return this
  }

  /**
   * Agregar un divider/separador
   */
  addDivider() {
    this._ensureSection()
    this.currentSection.fields.push({
      type: 'divider'
    })
    return this
  }

  /**
   * Configurar botón de submit
   */
  setSubmitButton(text, icon = 'save', variant = 'primary') {
    this.config.submitButton = { text, icon, variant }
    return this
  }

  /**
   * Configurar botón de cancelar
   */
  setCancelButton(text, show = true) {
    this.config.cancelButton = { text, show }
    return this
  }

  /**
   * Ocultar botón de cancelar
   */
  hideCancelButton() {
    this.config.cancelButton.show = false
    return this
  }

  /**
   * Configurar layout del formulario
   */
  setLayout(layout) {
    this.config.layout = layout
    return this
  }

  /**
   * Construir la configuración final
   */
  build() {
    if (this.config.sections.length === 0) {
      throw new Error('El formulario debe tener al menos una sección')
    }
    return { ...this.config }
  }

  /**
   * Resetear el builder
   */
  reset() {
    this.config = {
      title: '',
      description: '',
      sections: [],
      submitButton: { text: 'Guardar', icon: 'save', variant: 'primary' },
      cancelButton: { text: 'Cancelar', show: true },
      layout: 'default'
    }
    this.currentSection = null
    return this
  }

  // Método privado para asegurar que existe una sección actual
  _ensureSection() {
    if (!this.currentSection) {
      this.addSection('Información', 'folder')
    }
  }
}

// Funciones helper para uso rápido
export const createForm = () => new FormBuilder()

/**
 * Helpers para validación
 */
export const FormValidation = {
  required: (message = 'Este campo es requerido') => ({
    type: 'required',
    message
  }),
  
  minLength: (min, message = `Mínimo ${min} caracteres`) => ({
    type: 'minLength',
    value: min,
    message
  }),
  
  maxLength: (max, message = `Máximo ${max} caracteres`) => ({
    type: 'maxLength',
    value: max,
    message
  }),
  
  email: (message = 'Email inválido') => ({
    type: 'email',
    message
  }),
  
  pattern: (regex, message) => ({
    type: 'pattern',
    value: regex,
    message
  }),
  
  custom: (validator, message) => ({
    type: 'custom',
    validator,
    message
  })
}