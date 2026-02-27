import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'bottom-right', // Abajo a la derecha suele ser menos intrusivo
  theme: 'colored', // Usa colores sólidos (rojo para error, verde para success)
  clearOnUrlChange: false, // Evita que se borre si el usuario cambia de ruta justo al guardar
})

app.mount('#app')