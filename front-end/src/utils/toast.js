import { toast as toastify } from 'vue3-toastify'

export const toast = {
  success: (message, options = {}) => {
    toastify.success(message, options)
  },
  
  error: (message, options = {}) => {
    toastify.error(message, options)
  },
  
  warning: (message, options = {}) => {
    toastify.warning(message, options)
  },
  
  info: (message, options = {}) => {
    toastify.info(message, options)
  }
}