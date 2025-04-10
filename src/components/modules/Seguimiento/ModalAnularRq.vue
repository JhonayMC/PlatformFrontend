<template>
    <div class="modal fade" :id="modal_id" tabindex="-1" aria-hidden="true" data-bs-backdrop="static"
        data-bs-keyboard="false">
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Formulario de Anulación: {{ form.id }}</h5>
                    <button @click="cancelar" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-12">
                            <label>Motivo:</label>
                            <textarea v-model.trim="form.motivo" cols="30" rows="5" class="form-control"></textarea>
                        </div>
                        <div class="col-md-12 pt-3" align="center">
                            <button :disabled="form.motivo == ''" @click="guardar" class="btn btn-danger mx-1 px-5">Anular</button>
                            <button @click="cancelar" class="btn btn-secondary mx-1 px-5">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

let modal_id = Util.uuid()
let form = ref({
    id: '',
    motivo: ''
})
let errores = ref([])

const mostrarModal = (id) => {
    form.value.id = id
    $(`#${modal_id}`).modal('show')
}

const cancelar = () => {
    form.value.id = ''
    form.value.motivo = ''
    $(`#${modal_id}`).modal('hide')
    errores.value = []
}

const guardar = async () => {
    let pre = await confirmar()
    if (!pre) return
    Util.load(true)
    ac.post('/reclamo-queja/anular', form.value)
        .then(({ data }) => {
            Util.load(false)
            $(`#${modal_id}`).modal('hide')
            cancelar()
            Toast.fire({ icon: "success", title: "Registro Anulado!.", })
            emit('guardado')
        }).catch((err) => {
            Util.load(false)
            errores.value = (err.response.status == 422) ? err.response.data.errors : []
        })    
}


const confirmar = () => {
    return Swal.fire({
        title: '¿Estás seguro de anular el Registro?',
        text: "Una vez registrado no podrá modificar la información",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Anular',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        return result.isConfirmed
    })
}

const emit = defineEmits(['guardado'])
defineExpose({ mostrarModal })

</script>

<style scoped></style>