import { defineStore } from "pinia"

export const useSucursalStore = defineStore("sucursal", {
  state: () => ({
    sucursalActual: null,
    sucursales: []
  }),

  actions: {
    setSucursal(id) {
      this.sucursalActual = id
      localStorage.setItem("sucursal_id", id)
    },

    cargarSucursalGuardada() {
      const saved = localStorage.getItem("sucursal_id")
      if (saved) {
        this.sucursalActual = Number(saved)
      }
    },

    setSucursales(data) {
      this.sucursales = data
    }
  }
})