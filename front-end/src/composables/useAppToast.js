// src/composables/useAppToast.js
import { toast } from 'vue3-toastify'

export function useAppToast() {
  
  // Función privada base para mantener la lógica centralizada
  const triggerToast = (message, type) => {
    toast(message, {
      type: type, // 'success' | 'error' | 'warning' | 'info'
      // Aquí puedes sobreescribir opciones globales si un toast específico lo requiere
      // transition: 'slide',
    })
  }

  // Exponemos métodos semánticos muy fáciles de usar
  return {
    success: (message) => triggerToast(message, 'success'),
    error:   (message) => triggerToast(message, 'error'),
    warning: (message) => triggerToast(message, 'warning'),
    info:    (message) => triggerToast(message, 'info')
  }
}