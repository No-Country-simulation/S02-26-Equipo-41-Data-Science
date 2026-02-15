import { ref, onMounted } from 'vue'

export function useDarkMode() {
  const isDark = ref(false)

  const toggleDark = () => {
    isDark.value = !isDark.value
    updateTheme()
  }

  const setDark = (value) => {
    isDark.value = value
    updateTheme()
  }

  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
    updateTheme()
  }

  onMounted(() => {
    initTheme()
  })

  return {
    isDark,
    toggleDark,
    setDark,
    initTheme
  }
}