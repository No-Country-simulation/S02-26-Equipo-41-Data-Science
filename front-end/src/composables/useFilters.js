// composables/useFilters.js
import { ref } from 'vue'

export function useFilters(initial = {}) {

  const filters = ref({ ...initial })

  function setFilter(key, value) {
    // Soportar notación de punto para objetos anidados
    if (key.includes('.')) {
      const keys = key.split('.')
      let obj = filters.value
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) {
          obj[keys[i]] = {}
        }
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
    } else {
      filters.value[key] = value
    }
  }

  function clear() {
    filters.value = { ...initial }
  }

  return {
    filters,
    setFilter,
    clear
  }
}