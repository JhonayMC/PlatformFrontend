<template>
    <div class="container-fluid ">
        <div class="container-dashboard">
            <div class="flex-container">
                <div v-for="(d, i) in storeOption.getters.getDashboard" :key="i" class="card card-option"
                    @click="panelActivo(d)">
                    <div class="card-body flex-center">
                        <div class="w-100 text-center">
                            <div class="img-1">
                                <img :src="$getSrc(d.icono[0])" class="img-fluid" width="75">
                            </div>
                            <div class="img-2">
                                <img :src="$getSrc(d.icono[1])" class="img-fluid" width="75">
                            </div>
                            <h4>{{ d.titulo }}</h4>
                            <h5>{{ d.subtitulo }}</h5>
                        </div>
                    </div>
                </div>
                <div v-if="store.getters.getUsuario.tipo_usuarios_id == 1" class="card-description">
                    <div class="row justify-content-center">
                        <div class="col-lg-6 col-sm-6">
                            <div class="card shadow-none p-3">
                                <div class="card-body text-muted">
                                    <h4 class="fw-normal text-center">¿Qué es un Reclamo?</h4>
                                    <p class="text-justify">
                                        Es la manifestación mediante la cual un consumidor expresa una disconformidad
                                        relacionada con los bienes o servicios suministrados.
                                    </p>
                                    <p>Ejemplos de reclamos:</p>
                                    <ul>
                                        <li>Falla de producto.</li>
                                        <li>Productos, marca o código no solicitados.</li>
                                        <li>Precio o datos del cliente incorrectos.</li>
                                        <li>Empaque o repuesto en mal estado.</li>
                                        <li>Repuesto diferente a la muestra, original, etc.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-6">
                            <div class="card shadow-none p-3">
                                <div class="card-body text-muted">
                                    <h4 class="fw-normal text-center">¿Qué es un Queja?</h4>
                                    <p class="text-justify">
                                        Es la manifestación que un consumidor realiza para expresar su
                                        malestar o descontento con la atención al público.
                                    </p>
                                    <p>Ejemplos de reclamos:</p>
                                    <ul>
                                        <li>Personal de M&M (vendedor, cajera, seguridad, etc.).</li>
                                        <li>Demora en la atención.</li>
                                        <li>Ambiente.</li>
                                        <li>Desabasto.</li>
                                        <li>Demoras en la entrega de productos.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <OffCanvasBottomFull v-if="store.getters.getUsuario.tipo_usuarios_id == 1" ref="ofr"
                    @reiniciarForm="reiniciar" :confirmacion="panelId != 3">
                    <ReclamoClienteProducto v-show="panelId == 1" ref="producto" :canvasoff="ofr" />
                    <ReclamoClienteOtro v-show="panelId == 2" ref="otro" />
                    <ReclamoConsulta v-show="panelId == 3" ref="consulta" />
                </OffCanvasBottomFull>

                <OffCanvasBottomFull v-if="store.getters.getUsuario.tipo_usuarios_id == 3" ref="ofr"
                    @reiniciarForm="reiniciar" :confirmacion="panelId != 3">
                    <ReclamoClienteProducto v-show="panelId == 1" ref="producto" :canvasoff="ofr"
                        @irSeguimiento="irSeguimiento" />
                    <ReclamoClienteOtro v-show="panelId == 2" ref="otro" />
                    <Seguimiento v-show="panelId == 4" ref="seguimiento" />
                </OffCanvasBottomFull>

                <OffCanvasBottomFull v-if="store.getters.getUsuario.tipo_usuarios_id == 4" ref="ofr"
                    @reiniciarForm="reiniciar" :confirmacion="panelId != 3">
                    <Seguimiento v-show="panelId == 4" ref="seguimiento" />
                </OffCanvasBottomFull>
            </div>
        </div>
    </div>

    <FooterComponent :menu="false" />
</template>

<script setup>
import { ref, onMounted, defineComponent } from 'vue'
import store from '@/config/store'
import storeOption from '@/config/store/options'
import FooterComponent from '@/components/FooterComponent.vue'
import OffCanvasBottomFull from '@/components/utilitarios/OffCanvasBottomFull.vue'
import ReclamoClienteOtro from '@/modules/Forms/ReclamoClienteOtro.vue'
import ReclamoClienteProducto from '@/modules/Forms/ReclamoClienteProducto.vue'
import ReclamoConsulta from '@/modules/Forms/ReclamoConsulta.vue'
import Seguimiento from '@/modules/Forms/Seguimiento.vue'

defineComponent({
    ReclamoClienteOtro,
    ReclamoClienteProducto,
    ReclamoConsulta
})

let ofr = ref(null)
let producto = ref(null)
let otro = ref(null)
let consulta = ref(null)
let seguimiento = ref(null)
let panelId = ref('')

const panelActivo = (data) => {
    if (store.getters.getUsuario.tipo_usuarios_id == 1) {
        ofr.value.show(`${data.titulo} Por ${data.subtitulo}`)
        if (data.id === 3) { consulta.value.obtenerDatos() }
    }

    if (store.getters.getUsuario.tipo_usuarios_id == 3 || store.getters.getUsuario.tipo_usuarios_id == 4) {
        if (data.subtitulo !== '') {
            ofr.value.show(`${data.titulo} Por ${data.subtitulo}`)
        } else {
            ofr.value.show((data.subtitulo == '') ? data.titulo : `${data.titulo} Por ${data.subtitulo}`)
        }
        if (data.id === 4) { seguimiento.value.obtenerDatos() }
    }

    panelId.value = data.id
}

const reiniciar = () => {

    switch (panelId.value) {
        case 1:
            producto.value.resetear()
            break;
        case 2:
            otro.value.resetear()
            break;
    }
}

const irSeguimiento = () => {
    ofr.value.hide()
    let modulo = storeOption.getters.getDashboard.filter(d => d.id === 4)
    panelActivo(modulo[0])
}

onMounted(() => {
    if (!storeOption.getters.getTipoCorrelativos.length) storeOption.dispatch('getTipoCorrelativos')
    if (!storeOption.getters.getTipoOperaciones.length) storeOption.dispatch('getTipoOperaciones')
    if (!storeOption.getters.getMotivosProductos.length) storeOption.dispatch('getMotivosProductos')
    if (!storeOption.getters.getMotivosServicios.length) storeOption.dispatch('getMotivosServicios')
    if (!storeOption.getters.getEstados.length) storeOption.dispatch('getEstados')
    if (!storeOption.getters.getOrigenes.length) storeOption.dispatch('getOrigenes')
})
</script>
<style scoped>
.flex-container {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    gap: 2rem;
    height: 100dvh;
}

.card-option {
    background: var(--bs-theme-111);
    color: var(--bs-theme-1);
    cursor: pointer;
    height: 278px;
    width: 370px;
}

.card-option .img-2 {
    display: none;
}

.card-option:hover .img-1 {
    display: none;
}

.card-option:hover .img-2 {
    display: block;
}

.card-option:hover {
    background: var(--bs-theme-1);
    color: white;
}

.card-option:hover .icon {
    background: white;
    color: var(--bs-theme-1);
}

.card-option .icon {
    margin: auto;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: var(--bs-theme-1);
    color: white;
    position: relative;
    top: -20px;
}

.card-option .icon i {
    font-size: 1.5rem;
    line-height: 4rem;
}

.card-description {
    width: 60%;
}

@media (max-width: 1400px) {

    /* Tablets */
    .card-option {
        height: 208px;
        width: 300px;
    }

    .card-description {
        font-size: 12px;
        width: 80%;
    }
}

@media (max-width: 1200px) {

    /* Tablets */
    .card-description {
        font-size: 12px;
        width: 100%;
    }
}

@media (max-width: 768px) {
    /* Móviles */
}

@media (max-width: 576px) {
    /* Móviles pequeños */
}</style>