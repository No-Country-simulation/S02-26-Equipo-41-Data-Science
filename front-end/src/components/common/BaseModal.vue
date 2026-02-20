<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
          
          <div class="p-6">
            <div class="flex justify-center mb-5">
              <img 
                :src="config.image"
                alt="icon"
                class="w-12 h-12 object-contain"
              />
            </div>

            <div class="text-center">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ title }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ description }}
              </p>
            </div>
          </div>

          <div class="px-6 py-4 flex gap-3 justify-center">
            <BaseButton
              v-if="button1Title"
              copy
              variant="secondary"
              @click="$emit('action1')"
            >
              {{ button1Title }}
            </BaseButton>
            
            <BaseButton
              v-if="button2Title"
              :variant="config.btnVariant"
              copy
              :loading="loading"
              @click="$emit('action2')"
            >
              {{ button2Title }}
            </BaseButton>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import successImg from '@/assets/img/check.png'
import errorImg from '@/assets/img/mark.png'
import warningImg from '@/assets/img/alert.png'
import infoImg from '@/assets/img/question.png'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info', 'warning'].includes(value.toLowerCase())
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  button1Title: {
    type: String,
    default: 'Cancelar'
  },
  button2Title: {
    type: String,
    default: 'Aceptar'
  },
  // Opcional: Prop para manejar el estado de carga del botón principal del modal
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['action1', 'action2', 'close'])

// Mapeamos el tipo de modal al variant de tu BaseButton
const typeConfig = {
  success: {
    image: successImg,
    textColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    btnVariant: 'success'
  },
  error: {
    image: errorImg,
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    btnVariant: 'danger'
  },
  warning: {
    image: warningImg,
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    btnVariant: 'warning'
  },
  info: {
    image: infoImg,
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    btnVariant: 'primary'
  }
}

const config = computed(() => typeConfig[props.type.toLowerCase()])
</script>

<style scoped>
/* Las mismas transiciones de antes */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .transform,
.modal-leave-to .transform {
  transform: scale(0.95);
  opacity: 0;
}
</style>