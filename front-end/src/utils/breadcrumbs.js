// utils/breadcrumbs.js
export const inventoryBreadcrumbs = {
  list: () => [{ label: 'Inventario' }],
  create: () => [
    { label: 'Inventario', to: '/inventario' },
    { label: 'Crear Producto' }
  ],
  detail: (id) => [
    { label: 'Inventario', to: '/inventario' },
    { label: 'Detalle' }
  ],
  edit: (id) => [
    { label: 'Inventario', to: '/inventario' },
    { label: 'Detalle', to: `/inventario/${id}` },
    { label: 'Editar' }
  ]
}