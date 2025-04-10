<template>
    <div class="modal fade" :id="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">                    
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-user">
                        <div class="circle">
                            <span class="text-uppercase">{{ $store.getters.getUsuario.nombre_completo[0] }}</span>                            
                        </div>
                    </div>
                    <h5 class="text-center mt-3">{{ $store.getters.getUsuario.nombre_completo }}</h5>
                    <p class="text-center text-muted">{{ $store.getters.getUsuario.correo }}</p>
                    <div class="mt-3">
                        <div class="row my-1">
                            <div class="col text-end px-2">
                                Perfil:
                            </div>
                            <div class="col text-start">
                                {{ $store.getters.getUsuario.tipo?.nombre }}
                            </div>
                        </div>
                        <div class="row my-1">
                            <div class="col text-end px-2">
                                Documento:
                            </div>
                            <div class="col text-start">
                                {{ $store.getters.getUsuario.documento }}
                            </div>
                        </div>
                        <div class="row my-1">
                            <div class="col text-end px-2">
                                Fecha de Creación:
                            </div>
                            <div class="col text-start">
                                {{ $filters.date($store.getters.getUsuario.creado_en, 'YYYY/MM/DD HH:mm A') }}
                            </div>
                        </div>
                        <div class="row my-1">
                            <div class="col text-end px-2">
                                Cambio de Contraseña:
                            </div>
                            <div class="col text-start">
                                {{ $filters.date($store.getters.getUsuario.expira_en, 'YYYY/MM/DD HH:mm A') }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 py-4"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref } from 'vue'

    let modal = ref(Util.uuid())

    const show = () => {
        $(`#${modal.value}`).modal("show")
    }

    defineExpose({ show })
</script>
<style scoped>
    .container-user {
        width: 100%;        
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .container-user .circle {
        min-width: 150px;
        min-height: 150px;
        background: var(--bs-indigo);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    .container-user .circle span {
        color: white;
        font-size: 75px;
        font-style: bold;
    }
</style>