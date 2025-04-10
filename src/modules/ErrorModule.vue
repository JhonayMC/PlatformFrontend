<template>
    <div class="container">
        <div class="misc-wrapper">
            <div>¡Modulo en mantenimiento!</div>
            <div>Disculpe las molestias, pero estamos realizando un mantenimiento en este momento.</div>
            <div><button class="btn btn-danger mt-3" @click="$router.go(-1)">Regresar a la página anterior.</button></div>
            <div>
                <img :src="$getSrc('/images/utils/luck.png')" width="500" class="img-fluid" />
            </div>
        </div>
        
    </div>
</template>
<script>

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