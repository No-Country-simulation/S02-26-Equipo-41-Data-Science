import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const rememberMe = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  // Actions
  async function login(email, password, remember = false) {
    try {
      // Simulación de API call - reemplazar con llamada real
      // const response = await fetch('/api/auth/login', {...})
      
      // Mock de respuesta exitosa
      const mockUser = {
        id: 1,
        name: 'Usuario Demo',
        email: email,
        role: 'admin'
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()

      user.value = mockUser
      token.value = mockToken
      rememberMe.value = remember

      // Guardar en localStorage
      if (remember) {
        localStorage.setItem('token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
      } else {
        sessionStorage.setItem('token', mockToken)
        sessionStorage.setItem('user', JSON.stringify(mockUser))
      }

      return { success: true, user: mockUser }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  function logout() {
    user.value = null
    token.value = null
    rememberMe.value = false
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }

  function restoreSession() {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      return true
    }
    return false
  }

  // Auto-restaurar sesión al inicializar el store
  restoreSession()

  return {
    user,
    token,
    rememberMe,
    isAuthenticated,
    currentUser,
    login,
    logout,
    restoreSession
  }
})