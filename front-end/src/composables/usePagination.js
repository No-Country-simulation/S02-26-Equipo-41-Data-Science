// composables/usePagination.js
import { ref, computed } from 'vue'

export function usePagination(initialPageSize = 10) {

  const page = ref(1)
  const pageSize = ref(initialPageSize)
  const total = ref(0)

  const totalPages = computed(() =>
    Math.ceil(total.value / pageSize.value)
  )

  const from = computed(() =>
    (page.value - 1) * pageSize.value
  )

  const to = computed(() =>
    from.value + pageSize.value - 1
  )

  function setTotal(value) {
    total.value = value
  }

  function next() {
    if (page.value < totalPages.value) page.value++
  }

  function prev() {
    if (page.value > 1) page.value--
  }

  function reset() {
    page.value = 1
  }

  return {
    page,
    pageSize,
    total,
    totalPages,
    from,
    to,
    setTotal,
    next,
    prev,
    reset
  }
}