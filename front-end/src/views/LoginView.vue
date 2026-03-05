<template>
  <main class="flex min-h-screen w-full overflow-hidden">
    <!-- Left Side: Atmospheric Image with Overlay -->
    <div class="hidden lg:flex lg:w-1/2 relative">
      <div class="absolute inset-0 bg-primary/40 z-10 mix-blend-multiply"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent z-10"></div>
      <img
        alt="Modern minimalist clothing store interior"
        class="absolute inset-0 w-full h-full object-cover"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMN_7XViS8S5zxDZ-yiwT-_D2H3z1njinUI-O77LOM7P2sDRhjh2NlvZaVhBjz5npBxSke_EtDmqx4yrVBvqtAC_wbVYcLpTd3NxfbSMHJHyymvvLt7kjhUPvJpgcRz4-g7s8JGouwjxyRqdImm8eCPGMWkVfhq8F-CPDU_rzX9fqqzI5sO8B3Kyf5dvAkq6lPt9t85u2-3edqPZH8if_PDk0PbehSDLWXXiTIaEDcsn1prKydTMUOvKM6GiXSJXkiCDVhisYe0o4"
      />
      <div class="relative z-20 flex flex-col justify-end p-20 text-white">
        <h3 class="text-4xl font-bold mb-4">Gestión Inteligente</h3>
        <p class="text-lg text-white/90 max-w-md">
          Optimiza tu inventario y ventas con la plataforma líder para el sector retail en Perú.
        </p>
      </div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white dark:bg-background-dark">
      <div class="w-full max-w-[440px] flex flex-col gap-8">
        <!-- Branding -->
        <div class="flex flex-col items-center lg:items-start gap-2">
          <AppLogo class="mb-2" />
        </div>

        <!-- Welcome Message -->
        <div class="text-left">
          <h3 class="text-text-primary dark:text-white text-2xl font-bold">
            Bienvenido de nuevo
          </h3>
          <p class="text-text-secondary dark:text-gray-400 mt-1">
            Ingresa tus credenciales para acceder al panel.
          </p>
        </div>

        <!-- Login Form -->
        <LoginForm />

        <!-- Footer Links -->
        <div class="mt-8 flex flex-col items-center lg:items-start gap-4 divider pt-8">
          <p class="text-text-secondary text-xs">
            © 2024 DATAMARK Perú. Todos los derechos reservados.
          </p>
          <div class="flex gap-6">
            <a href="#" class="text-text-secondary dark:text-gray-400 text-xs hover:text-primary transition-colors">
              Términos de Servicio
            </a>
            <a href="#" class="text-text-secondary dark:text-gray-400 text-xs hover:text-primary transition-colors">
              Política de Privacidad
            </a>
            <a href="#" class="text-text-secondary dark:text-gray-400 text-xs hover:text-primary transition-colors">
              Ayuda
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import AppLogo from '@/components/common/AppLogo.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
</script>