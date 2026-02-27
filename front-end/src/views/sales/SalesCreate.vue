<template>
  <div class="page-container">
    <main class="main-layout">
      <!-- ══════════ PANEL IZQUIERDO ══════════ -->
      <section class="left-panel custom-scrollbar">

        <!-- Buscador de productos -->
        <div class="section-block">
          <div class="search-wrapper">
            <span class="material-symbols-outlined search-icon">search</span>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Buscar producto por nombre o SKU... (F1)"
              @keydown.f1.prevent="focusSearch"
              ref="searchInput"
            />
          </div>

          <!-- Lista de productos -->
          <div class="product-list">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-card"
              :class="{ 'product-card--low-stock': product.stock <= 5 }"
            >
              <div class="product-card__info">
                <div class="product-card__image">
                  <span class="material-symbols-outlined">checkroom</span>
                </div>
                <div>
                  <h3 class="product-card__name">{{ product.name }}</h3>
                  <p class="product-card__sku">SKU: {{ product.sku }}</p>
                  <div class="product-card__meta">
                    <span class="product-card__price">{{ formatCurrency(product.price) }}</span>
                    <span
                      class="stock-badge"
                      :class="product.stock <= 5 ? 'stock-badge--low' : 'stock-badge--ok'"
                    >
                      {{ product.stock <= 5 ? `Stock Bajo: ${product.stock}` : `STOCK: ${product.stock}` }}
                    </span>
                  </div>
                </div>
              </div>
              <button
                class="btn-add"
                :disabled="product.stock === 0"
                @click="addToCart(product)"
              >
                <span class="material-symbols-outlined">add</span>
                AGREGAR
              </button>
            </div>

            <div v-if="filteredProducts.length === 0" class="empty-search">
              <span class="material-symbols-outlined">search_off</span>
              <p>No se encontraron productos</p>
            </div>
          </div>
        </div>

        <hr class="divider" />

        <!-- Cliente asociado -->
        <div class="section-block">
          <div class="section-header">
            <h2 class="section-title">
              <span class="material-symbols-outlined">person</span>
              Cliente Asociado
            </h2>
            <span class="section-subtitle">
              Actual:
              <span class="text-primary">{{ selectedClient?.name || 'Consumidor Final' }}</span>
            </span>
          </div>

          <div class="client-grid">
            <!-- Búsqueda de clientes -->
            <div class="client-search-col">
              <div class="client-search-row">
                <div class="search-wrapper">
                  <span class="material-symbols-outlined search-icon">person_search</span>
                  <input
                    v-model="clientSearch"
                    type="text"
                    class="search-input search-input--sm"
                    placeholder="Buscar cliente por nombre o documento..."
                  />
                </div>
                <button class="btn-new-client" @click="showNewClientModal = true">
                  + Nuevo Cliente
                </button>
              </div>

              <!-- Dropdown resultados -->
              <div v-if="filteredClients.length > 0" class="client-dropdown custom-scrollbar">
                <div
                  v-for="client in filteredClients"
                  :key="client.id"
                  class="client-option"
                  @click="selectClient(client)"
                >
                  <div class="client-option__header">
                    <span class="client-option__name">{{ client.name }}</span>
                    <span class="client-badge" :class="`client-badge--${client.type}`">
                      {{ client.typeLabel }}
                    </span>
                  </div>
                  <p class="client-option__detail">{{ client.document }} • {{ client.location }}</p>
                </div>
              </div>
            </div>

            <!-- Tarjeta cliente seleccionado -->
            <div class="client-selected-card">
              <template v-if="selectedClient">
                <div class="client-selected-card__header">
                  <div>
                    <span class="client-selected-card__label">Cliente Seleccionado</span>
                    <h4 class="client-selected-card__name">{{ selectedClient.name }}</h4>
                  </div>
                  <span class="client-badge" :class="`client-badge--${selectedClient.type}`">
                    {{ selectedClient.typeLabel }}
                  </span>
                </div>
                <p class="client-selected-card__detail">
                  <span>Documento: {{ selectedClient.document }}</span>
                  <span>Ubicación: {{ selectedClient.location }}</span>
                </p>
                <div class="client-selected-card__actions">
                  <button class="btn-text btn-text--primary" @click="selectedClient = null">Cambiar</button>
                  <button class="btn-text btn-text--danger" @click="selectedClient = null">Quitar</button>
                </div>
              </template>
              <template v-else>
                <div class="client-empty">
                  <span class="material-symbols-outlined">person_off</span>
                  <p>Sin cliente asignado</p>
                  <small>Busca o crea uno arriba</small>
                </div>
              </template>
            </div>
          </div>
        </div>

        <hr class="divider" />

        <!-- Notas internas -->
        <div class="section-block">
          <label class="field-label">Notas internas de la venta</label>
          <textarea
            v-model="saleNotes"
            class="textarea-notes"
            placeholder="Añadir observaciones relevantes para la administración o depósito..."
            rows="3"
          />
        </div>
      </section>

      <!-- ══════════ PANEL DERECHO (CARRITO) ══════════ -->
      <aside class="right-panel">
        <!-- Header del carrito -->
        <div class="cart-header">
          <h2 class="cart-header__title">
            <span class="material-symbols-outlined">shopping_basket</span>
            Resumen de Venta
          </h2>
          <button class="btn-clear" @click="clearCart">
            <span class="material-symbols-outlined">delete</span>
            Limpiar
          </button>
        </div>

        <!-- Items del carrito -->
        <div class="cart-items custom-scrollbar">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="cart-item"
            :class="{ 'cart-item--low-stock': item.stock <= 5 }"
          >
            <div class="cart-item__header">
              <span class="cart-item__name">{{ item.name }}</span>
              <button class="btn-remove" @click="removeFromCart(item.id)">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="cart-item__footer">
              <div class="qty-control">
                <button class="qty-btn" @click="decreaseQty(item)" :disabled="item.qty <= 1">
                  <span class="material-symbols-outlined">remove</span>
                </button>
                <span class="qty-value">{{ item.qty }}</span>
                <button class="qty-btn" @click="increaseQty(item)" :disabled="item.qty >= item.stock">
                  <span class="material-symbols-outlined">add</span>
                </button>
              </div>
              <span class="cart-item__total">{{ formatCurrency(item.price * item.qty) }}</span>
            </div>
          </div>

          <div v-if="cartItems.length === 0" class="cart-empty">
            <span class="material-symbols-outlined">shopping_cart</span>
            <p>Carrito vacío</p>
            <small>Agrega productos desde el buscador</small>
          </div>
        </div>

        <!-- Footer del carrito -->
        <div class="cart-footer">
          <!-- Método de pago -->
          <div class="payment-section">
            <label class="field-label">Método de Pago</label>
            <div class="payment-methods">
              <button
                v-for="method in paymentMethods"
                :key="method.id"
                class="payment-btn"
                :class="{ 'payment-btn--active': selectedPayment === method.id }"
                @click="selectedPayment = method.id"
              >
                <span class="material-symbols-outlined">{{ method.icon }}</span>
                <span>{{ method.label }}</span>
              </button>
            </div>
          </div>

          <!-- Totales -->
          <div class="totals">
            <div class="totals__row">
              <span>Subtotal</span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="totals__row totals__row--divider">
              <span>IGV (18%)</span>
              <span>{{ formatCurrency(igv) }}</span>
            </div>
            <div class="totals__final">
              <span>Total</span>
              <span class="totals__amount">{{ formatCurrency(total) }}</span>
            </div>
          </div>

          <!-- Botón confirmar -->
          <button
            class="btn-confirm"
            :disabled="cartItems.length === 0"
            @click="confirmSale"
          >
            <span class="material-symbols-outlined">check_circle</span>
            CONFIRMAR VENTA
          </button>
          <p class="shortcut-hint">Atajo: Ctrl + Enter para finalizar</p>
        </div>
      </aside>
    </main>

    <!-- ══════════ MODAL ÉXITO ══════════ -->
    <Transition name="fade">
      <div v-if="showSuccessModal" class="modal-overlay" @click.self="showSuccessModal = false">
        <div class="modal-success">
          <div class="modal-success__icon">
            <span class="material-symbols-outlined">check_circle</span>
          </div>
          <h3>¡Venta registrada!</h3>
          <p>La venta fue procesada correctamente por {{ formatCurrency(total) }}</p>
          <div class="modal-success__actions">
            <button class="btn-outline" @click="printReceipt">
              <span class="material-symbols-outlined">print</span> Imprimir
            </button>
            <button class="btn-primary" @click="newSale">
              Nueva Venta
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ── Props ──────────────────────────────────────────
const sucursalActiva = ref('Lima Central')

// ── Búsqueda y productos ───────────────────────────
const searchQuery = ref('')
const searchInput = ref(null)

const products = ref([
  { id: 1,  name: 'Camisa Oxford Slim Fit Celeste', sku: 'OX-102-BLU', price: 25000, stock: 45, category: 'Camisas' },
  { id: 2,  name: 'Pantalón Gabardina Beige - Talle 42', sku: 'GB-42-BEI', price: 32500, stock: 3,  category: 'Pantalones' },
  { id: 3,  name: 'Zapatilla Running Pro', sku: 'ZR-PRO-001', price: 89000, stock: 12, category: 'Calzado' },
  { id: 4,  name: 'Polo Slim Fit Negro', sku: 'PS-N-001', price: 18500, stock: 28, category: 'Polos' },
  { id: 5,  name: 'Jean Skinny Azul - Talle 40', sku: 'JS-AZ-40', price: 45000, stock: 7,  category: 'Pantalones' },
])

const filteredProducts = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return products.value
  return products.value.filter(p =>
    p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  )
})

const focusSearch = () => searchInput.value?.focus()

// ── Clientes ───────────────────────────────────────
const clientSearch = ref('')
const selectedClient = ref(null)
const showNewClientModal = ref(false)

const clients = ref([
  { id: 1, name: 'Juan Pérez',    document: 'DNI: 35.123.456', location: 'Lima, CABA',         type: 'frequent', typeLabel: 'Frecuente' },
  { id: 2, name: 'María García',  document: 'RUC: 27-44556677-9', location: 'Arequipa',        type: 'wholesale', typeLabel: 'Mayorista' },
  { id: 3, name: 'Carlos López',  document: 'DNI: 22.987.654', location: 'Cusco',              type: 'final',    typeLabel: 'Final' },
])

const filteredClients = computed(() => {
  const q = clientSearch.value.toLowerCase().trim()
  if (!q) return clients.value
  return clients.value.filter(c =>
    c.name.toLowerCase().includes(q) || c.document.toLowerCase().includes(q)
  )
})

const selectClient = (client) => {
  selectedClient.value = client
  clientSearch.value = ''
}

// ── Carrito ────────────────────────────────────────
const cartItems = ref([])
const saleNotes = ref('')

const addToCart = (product) => {
  const existing = cartItems.value.find(i => i.id === product.id)
  if (existing) {
    if (existing.qty < existing.stock) existing.qty++
    return
  }
  cartItems.value.push({ ...product, qty: 1 })
}

const removeFromCart = (id) => {
  cartItems.value = cartItems.value.filter(i => i.id !== id)
}

const increaseQty = (item) => { if (item.qty < item.stock) item.qty++ }
const decreaseQty = (item) => { if (item.qty > 1) item.qty-- }

const clearCart = () => {
  cartItems.value = []
  selectedClient.value = null
  saleNotes.value = ''
}

// ── Pago y totales ─────────────────────────────────
const selectedPayment = ref('cash')

const paymentMethods = [
  { id: 'cash',     label: 'Efectivo', icon: 'payments' },
  { id: 'card',     label: 'Tarjeta',  icon: 'credit_card' },
  { id: 'transfer', label: 'Transf.',  icon: 'account_balance' },
]

const subtotal = computed(() =>
  cartItems.value.reduce((sum, i) => sum + i.price * i.qty, 0)
)
const igv     = computed(() => Math.round(subtotal.value * 0.18))
const total   = computed(() => subtotal.value + igv.value)

// ── Confirmar venta ────────────────────────────────
const showSuccessModal = ref(false)

const confirmSale = () => {
  if (cartItems.value.length === 0) return
  showSuccessModal.value = true
}

const printReceipt = () => {
  window.print()
}

const newSale = () => {
  clearCart()
  showSuccessModal.value = false
}

// ── Atajo teclado ──────────────────────────────────
const handleKeydown = (e) => {
  if (e.ctrlKey && e.key === 'Enter') confirmSale()
  if (e.key === 'F1') { e.preventDefault(); focusSearch() }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

// ── Utilidades ─────────────────────────────────────
const formatCurrency = (val) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 0 }).format(val / 100)
</script>

<style scoped>
/* ── Layout ─────────────────────────────────────── */
.page-container {
  @apply min-h-screen flex flex-col bg-background-light dark:bg-background-dark;
}

.main-layout {
  @apply flex flex-1 overflow-hidden;
}

/* ── Panel izquierdo ────────────────────────────── */
.left-panel {
  @apply w-2/3 p-6 flex flex-col gap-6 overflow-y-auto;
}

.section-block {
  @apply flex flex-col gap-4;
}

.section-header {
  @apply flex items-center justify-between;
}

.section-title {
  @apply text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-tight;
}

.section-subtitle {
  @apply text-sm font-semibold text-slate-500;
}

.divider {
  @apply border-slate-200 dark:border-slate-800;
}

/* ── Buscador ───────────────────────────────────── */
.search-wrapper {
  @apply relative;
}

.search-icon {
  @apply absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none;
}

.search-input {
  @apply w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400;
}

.search-input--sm {
  @apply py-3 text-sm;
}

/* ── Lista de productos ─────────────────────────── */
.product-list {
  @apply flex flex-col gap-3;
}

.product-card {
  @apply bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:shadow-md transition-shadow;
}

.product-card--low-stock {
  @apply border-l-4 border-l-amber-400;
}

.product-card__info {
  @apply flex items-center gap-4;
}

.product-card__image {
  @apply w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400;
}

.product-card__name {
  @apply font-bold text-slate-900 dark:text-white;
}

.product-card__sku {
  @apply text-[10px] text-slate-500 uppercase font-bold tracking-wider;
}

.product-card__meta {
  @apply flex items-center gap-3 mt-1;
}

.product-card__price {
  @apply text-sm font-bold text-primary;
}

.stock-badge {
  @apply px-2 py-0.5 rounded text-[10px] font-bold;
}

.stock-badge--ok {
  @apply bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400;
}

.stock-badge--low {
  @apply bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400;
}

.btn-add {
  @apply bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.empty-search {
  @apply flex flex-col items-center justify-center py-10 text-slate-400 gap-2;
}

/* ── Clientes ───────────────────────────────────── */
.client-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6 items-start;
}

.client-search-col {
  @apply flex flex-col gap-3;
}

.client-search-row {
  @apply flex gap-2;
}

.btn-new-client {
  @apply px-4 py-3 border border-primary text-primary text-xs font-bold rounded-xl hover:bg-primary/5 transition-colors uppercase whitespace-nowrap;
}

.client-dropdown {
  @apply bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto;
}

.client-option {
  @apply p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors;
}

.client-option__header {
  @apply flex justify-between items-center mb-1;
}

.client-option__name {
  @apply text-sm font-bold text-slate-900 dark:text-white;
}

.client-option__detail {
  @apply text-[11px] text-slate-500 font-medium;
}

.client-badge {
  @apply px-2 py-0.5 rounded text-[9px] font-bold uppercase;
}

.client-badge--frequent {
  @apply bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400;
}

.client-badge--wholesale {
  @apply bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400;
}

.client-badge--final {
  @apply bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400;
}

/* Tarjeta cliente seleccionado */
.client-selected-card {
  @apply bg-blue-50/50 dark:bg-primary/10 border border-blue-200 dark:border-primary/30 rounded-xl p-4 flex flex-col justify-between min-h-[140px];
}

.client-selected-card__header {
  @apply flex justify-between items-start;
}

.client-selected-card__label {
  @apply text-xs font-bold text-primary uppercase tracking-widest mb-1 block;
}

.client-selected-card__name {
  @apply text-lg font-bold text-slate-900 dark:text-white;
}

.client-selected-card__detail {
  @apply text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium flex flex-col gap-0.5;
}

.client-selected-card__actions {
  @apply flex gap-4 mt-4 pt-3 border-t border-blue-100 dark:border-primary/20;
}

.client-empty {
  @apply flex flex-col items-center justify-center h-full gap-1 text-slate-400 py-4;
}

.btn-text {
  @apply text-[11px] font-bold uppercase hover:underline;
}

.btn-text--primary { @apply text-primary; }
.btn-text--danger  { @apply text-rose-500; }

/* ── Notas ──────────────────────────────────────── */
.field-label {
  @apply text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block;
}

.textarea-notes {
  @apply w-full text-sm p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium placeholder:text-slate-400 shadow-sm resize-none text-slate-800 dark:text-slate-200;
}

/* ── Panel derecho (carrito) ────────────────────── */
.right-panel {
  @apply w-1/3 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col;
}

.cart-header {
  @apply p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center;
}

.cart-header__title {
  @apply text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white;
}

.btn-clear {
  @apply text-rose-500 text-xs font-bold flex items-center gap-1 hover:underline uppercase tracking-tighter;
}

/* Items del carrito */
.cart-items {
  @apply flex-1 overflow-y-auto p-4 flex flex-col gap-3;
}

.cart-item {
  @apply flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800;
}

.cart-item--low-stock {
  @apply border-l-4 border-l-amber-500;
}

.cart-item__header {
  @apply flex justify-between items-start;
}

.cart-item__name {
  @apply font-bold text-sm text-slate-900 dark:text-white;
}

.btn-remove {
  @apply text-slate-400 hover:text-rose-500 transition-colors;
}

.cart-item__footer {
  @apply flex items-center justify-between;
}

.qty-control {
  @apply flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 overflow-hidden;
}

.qty-btn {
  @apply px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed;
}

.qty-value {
  @apply px-3 py-1 text-sm font-bold w-10 text-center border-x border-slate-100 dark:border-slate-800;
}

.cart-item__total {
  @apply font-bold text-slate-900 dark:text-white;
}

.cart-empty {
  @apply flex flex-col items-center justify-center h-full gap-2 text-slate-400 py-10;
}

/* Footer del carrito */
.cart-footer {
  @apply p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)];
}

.payment-section {
  @apply flex flex-col gap-3;
}

.payment-methods {
  @apply grid grid-cols-3 gap-2;
}

.payment-btn {
  @apply flex flex-col items-center justify-center p-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:border-primary/50 hover:text-primary transition-all text-[10px] font-bold uppercase gap-1;
}

.payment-btn--active {
  @apply border-primary bg-primary/10 text-primary;
}

/* Totales */
.totals {
  @apply flex flex-col gap-1.5 pt-2;
}

.totals__row {
  @apply flex justify-between items-center text-slate-500 text-sm font-semibold;
}

.totals__row--divider {
  @apply pb-2 border-b border-slate-200 dark:border-slate-700;
}

.totals__final {
  @apply flex justify-between items-center pt-3;
}

.totals__final > span:first-child {
  @apply text-lg font-black tracking-tight uppercase text-slate-900 dark:text-white;
}

.totals__amount {
  @apply text-3xl font-black text-emerald-600 dark:text-emerald-400;
}

/* Botón confirmar */
.btn-confirm {
  @apply w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100;
}

.shortcut-hint {
  @apply text-[10px] text-center text-slate-400 font-bold uppercase tracking-wider;
}

/* ── Modal éxito ────────────────────────────────── */
.modal-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center;
}

.modal-success {
  @apply bg-white dark:bg-slate-900 rounded-2xl p-8 flex flex-col items-center gap-4 text-center shadow-2xl w-80;
}

.modal-success__icon {
  @apply text-emerald-500 text-6xl;
}

.modal-success h3 {
  @apply text-2xl font-black text-slate-900 dark:text-white;
}

.modal-success p {
  @apply text-sm text-slate-500;
}

.modal-success__actions {
  @apply flex gap-3 w-full;
}

.btn-outline {
  @apply flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-colors;
}

.btn-primary {
  @apply flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors;
}

/* ── Transitions ────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Custom scrollbar ───────────────────────────── */
.custom-scrollbar::-webkit-scrollbar       { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-slate-200 dark:bg-slate-700 rounded-full; }
</style>