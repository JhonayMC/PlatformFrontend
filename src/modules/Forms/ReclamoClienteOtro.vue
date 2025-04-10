<template>
    <div class="container h-100">
        <div v-if="opcionActiva == ''" class="flex-center h-100">
            <div class="col-lg-6">
                <div class="row">
                    <div class="col-12 text-center">
                        <h2>Seleccionar Tipo de Reclamo</h2>
                    </div>
                </div>
                <div class="flex-center gap-5 mt-2">
                    <div v-for="(d, i) in opciones" :key="i" class="col-lg-6">
                        <div class="card shadow-none border p-lg-5 card-option" @click="setOpcion(d.id)">
                            <div class="card-body row">
                                <div class="col-12 text-center img-1">
                                    <img :src="$getSrc(d.icono[0])" class="img-fluid" width="90">
                                </div>
                                <div class="col-12 text-center img-2">
                                    <img :src="$getSrc(d.icono[1])" class="img-fluid" width="90">
                                </div>
                                <div class="col-12 text-center">
                                    <h5>{{ d.titulo }}</h5>
                                </div>
                            </div>                
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="opcionActiva != ''">
            <ReclamoQuejaProducto ref="producto" v-if="opcionActiva==1" @regresar="opcionActiva = ''" />
            <ReclamoQuejaServicio ref="servicio" v-if="opcionActiva==2" @regresar="opcionActiva = ''" />
        </div>
    </div>
</template>
<script setup>
    import ReclamoQuejaProducto from './ReclamoQuejaProducto.vue'
    import ReclamoQuejaServicio from './ReclamoQuejaServicio.vue'
    import { ref } from 'vue'

    let opciones = [
        { id: 1, titulo: 'Producto', icono: ['/icons/product-d.gif', '/icons/product-l.gif'] },
        { id: 2, titulo: 'Servicio', icono: ['/icons/service-d.gif', '/icons/service-l.gif'] }
    ]
    let opcionActiva = ref('')

    let producto = ref(null)
    let servicio = ref(null)

    const setOpcion = (opcion) => {
        opcionActiva.value = opcion
    }

    const resetear = () => { 
        if (opcionActiva.value == 1) {
            producto.value.resetear()    
        } else if (opcionActiva.value == 2)  {
            servicio.value.resetear()
        }
        opcionActiva.value = ''
    }
    
    defineExpose({ resetear })
</script>
<style scoped>
    .card-option {
        cursor: pointer;
        background: var(--bs-theme-111);
    }
    .card-option .img-2 {
        display: none;
    }
    .card-option:hover {
        background-color: var(--bs-theme-1);
        color: #fff;
    }
    .card-option:hover .img-1 {
        display: none;
    }
    .card-option:hover .img-2 {
        display: block;
    }
</style>