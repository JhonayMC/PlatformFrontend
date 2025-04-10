<template>
    <div class="container-xxl container-p-y">
        <div class="misc-wrapper">
            <h2 class="mb-2 mx-2">Página no encontrada :(</h2>
            <p class="mb-4 mx-2">¡Ups! 😖 La URL solicitada no se encontró en este servidor.</p>
            <div><button class="btn btn-danger" @click="$router.go(-1)">Regresar a la página anterior.</button></div>
            <div class="mt-3">
                <img :src="$getSrc('/images/utils/404.png')" width="404" class="img-fluid">
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.misc-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - (1.625rem * 2));
    text-align: center;
}
    
</style>