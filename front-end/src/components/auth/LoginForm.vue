<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
    <!-- Email Input -->
    <BaseInput
      v-model="formData.email"
      type="email"
      label="Correo electrónico"
      placeholder="ej. usuario@empresa.com"
      icon="mail"
      :error="errors.email"
      required
    />

    <!-- Password Input -->
    <BaseInput
      v-model="formData.password"
      type="password"
      label="Contraseña"
      placeholder="••••••••"
      icon="lock"
      :error="errors.password"
      required
    />

    <!-- Options: Remember me & Forgot password -->
    <div class="flex items-center justify-between py-1">
      <label class="flex items-center gap-2 cursor-pointer group">
        <input
          v-model="formData.rememberMe"
          type="checkbox"
          class="checkbox-custom"
        />
        <span class="text-sm text-text-primary dark:text-gray-300 group-hover:text-primary transition-colors">
          Recordarme
        </span>
      </label>
      <a
        href="#"
        class="text-sm font-semibold link-primary"
        @click.prevent="handleForgotPassword"
      >
        ¿Olvidaste tu contraseña?
      </a>
    </div>

    <!-- Error Message -->
    <div
      v-if="generalError"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
    >
      {{ generalError }}
    </div>

    <!-- Submit Button -->
    <BaseButton
      type="submit"
      variant="primary"
      size="lg"
      icon-right="arrow_forward"
      :loading="isLoading"
      full-width
      class="mt-2"
    >
      Iniciar Sesión
    </BaseButton>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const generalError = ref('')
const isLoading = ref(false)

const validateForm = () => {
  let isValid = true
  errors.email = ''
  errors.password = ''
  generalError.value = ''

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    errors.email = 'El correo electrónico es requerido'
    isValid = false
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Ingresa un correo electrónico válido'
    isValid = false
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'La contraseña es requerida'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.login(
      formData.email,
      formData.password,
      formData.rememberMe
    )

    if (result.success) {
      // Redirect to dashboard
      router.push({ name: 'home' })
    } else {
      generalError.value = 'Credenciales incorrectas. Por favor, intenta nuevamente.'
    }
  } catch (error) {
    generalError.value = 'Ha ocurrido un error. Por favor, intenta más tarde.'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  // TODO: Implementar recuperación de contraseña
  alert('Funcionalidad de recuperación de contraseña en desarrollo')
}
</script>