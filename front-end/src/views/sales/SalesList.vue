<template>
    <div class="max-w-[1400px] mx-auto px-8 pb-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    Ventas
                </h2>
                <p class="text-gray-500 dark:text-gray-400 text-sm">
                    Listado de ventas realizadas, con detalles de productos, clientes y fechas.
                </p>
            </div>
            <BaseButton
                variant="primary"
                icon-left="add"
                copy
                @click="goToCreate"
            >
                Agregar Venta
            </BaseButton>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import BaseButton from '@/components/common/BaseButton.vue';

const router = useRouter();

const goToCreate = () => {
  router.push({ name: 'sales-create' });
};

</script>