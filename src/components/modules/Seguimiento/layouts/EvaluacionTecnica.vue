<template>
    <div class="row justify-content-center">
        <div class="col-lg-9 text-end">
            <span class="badge text-dark border">Estado: {{ props.modelo.estado_desc }}</span>
        </div>
        <div class="col-lg-9">
            <div class="form-check form-switch">
                <input class="form-check-input" :checked="step1" type="checkbox" id="sw1" @change="evaProceso"
                    :disabled="step1">
                <label class="form-check-label ms-2 pt-1" for="sw1">Evaluación en proceso - M&M</label>
            </div>
            <div v-if="step1">
                <p class="text-primary">
                    Laudo técnico: N° {{ form.laudo_codigo }}
                    <span class="ms-4">{{ form.laudo_fecha }}</span>
                </p>
                <div class="card border-0 shadow-none bg-light2">
                    <div class="card-body py-1">
                        <div class="table-responsive">
                            <table class="table table-sm table-borderless m-0">
                                <tbody>
                                    <tr>
                                        <td class="fw-semibold text-primary2" style="width: 15%;">Cliente:</td>
                                        <td style="width: 45%;"><span class="text-muted">{{
                                            props.modelo.cliente?.nombre_completo }}</span></td>
                                        <td class="fw-semibold text-primary2" style="width: 20%;">DNI/RUC:</td>
                                        <td style="width: 20%;"><span class="text-muted">{{ props.modelo.cliente?.documento
                                        }}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold text-primary2" style="width: 15%;">Factura:</td>
                                        <td style="width: 45%;"><span class="text-muted">{{ props.modelo.nro_factura
                                        }}</span></td>
                                        <td class="fw-semibold text-primary2" style="width: 20%;">Fecha Venta:</td>
                                        <td style="width: 20%;"><span class="text-muted">{{ props.modelo.fecha_venta
                                        }}</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="card border-0 shadow-none bg-light2 mt-2">
                    <div class="card-body py-1">
                        <div class="table-responsive">
                            <table class="table table-sm table-borderless m-0">
                                <tbody v-for="(d, i) in props.modelo.productos" :key="i">
                                    <tr>
                                        <td class="fw-semibold text-primary2 " style="width: 15%;">Descripción:</td>
                                        <td style="width: 45%;"><span class="text-muted">{{ d.codigo }}</span></td>
                                        <td class="fw-semibold text-primary2 " style="width: 20%;">Marca:</td>
                                        <td style="width: 20%;"><span class="text-muted">{{ d.marca }}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold text-primary2 " style="width: 15%;">Artículo:</td>
                                        <td style="width: 45%;"><span class="text-muted">{{ d.articulo }}</span></td>
                                        <td class="fw-semibold text-primary2 " style="width: 20%;">Fábrica:</td>
                                        <td style="width: 20%;"><span class="text-muted">{{ d.fabrica }}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold text-primary2 " style="width: 15%;">Línea:</td>
                                        <td style="width: 45%;"><span class="text-muted">{{ d.linea }}</span></td>
                                        <td class="fw-semibold text-primary2 " style="width: 20%;">Cantidad:</td>
                                        <td style="width: 20%;"><span class="text-muted">{{ d.und_reclamo }}</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <ul style="list-style: upper-roman;">
                    <li class="fw-semibold text-primary2">
                        Estado del Producto Recibido
                        <small class="text-muted fw-normal">(Min: 3, Máx: 10)</small>
                    </li>
                    <div class="my-2 d-flex gap-2 flex-wrap list-img">
                        <div v-for="(d, i) in lista_recibidos" :key="i" class="upload-box">
                            <img :src="d.url" class="img-fluid rounded">
                            <button @click="eliminarImg(d, i, 'recibido')" class="btn btn-sm btn-danger">Eliminar</button>
                        </div>
                        <div class="upload-box" @click="agregarImg">
                            <input type="file" @change="changeFile" class="d-none" accept="image/*">
                            <div class="upload-text">Añadir fotos</div>
                            <div class="upload-icon">+</div>
                        </div>
                    </div>
                    <li class="fw-semibold text-primary2">
                        Evaluación del Producto
                        <small class="text-muted fw-normal">(Min: 3, Máx: 10)</small>
                    </li>
                    <div class="my-2 d-flex gap-2 flex-wrap list-img">
                        <div v-for="(d, i) in lista_evaluados" :key="i" class="upload-box">
                            <img :src="d.url" class="img-fluid rounded" width="80" :title="d.detalle">
                            <button @click="eliminarImg(d,i, 'evauacion')" class="btn btn-sm btn-danger">Eliminar</button>
                        </div>
                        <div class="upload-box" @click="agregarImgDesc">
                            <div class="upload-text">Añadir</div>
                            <div class="upload-icon">+</div>
                            <div><small class="text-muted">Detalle...</small></div>
                        </div>
                    </div>
                    <li class="fw-semibold text-primary2">Posibles causas de la falla</li>
                    <div class="my-2">
                        <textarea v-model.trim="form.causa" rows="2" class="form-control bg-light2"
                            placeholder="Escribir causas"></textarea>
                    </div>
                    <li class="fw-semibold text-primary2">Resultados</li>
                    <div class="my-2">
                        <select v-model.trim="form.resultado_id" class="form-select bg-light2">
                            <option value="" disabled>Seleccionar</option>
                            <option v-for="(d, i) in resultados" :key="i" :value="d.id">{{ d.nombre }}</option>
                        </select>
                    </div>
                    <li class="fw-semibold text-primary2">Conclusiones</li>
                    <div class="my-2">
                        <textarea v-model.trim="form.conclusion" rows="2" class="form-control bg-light2"
                            placeholder="Escribir conclusiones"></textarea>
                    </div>
                    <li class="fw-semibold text-primary2">Recomendaciones</li>
                    <div class="my-2">
                        <textarea v-model.trim="form.recomendacion" rows="2" class="form-control bg-light2"
                            placeholder="Escribir recomendaciones"></textarea>
                    </div>
                </ul>
                <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-primary">Guardar</button>
                    <button class="btn btn-warning">Solicitar conformidad</button>
                    <button class="btn btn-danger">Ver PDF</button>
                </div>
            </div>
        </div>
        <div class="col-lg-9">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="sw2">
                <label class="form-check-label ms-2 pt-1" for="sw2">Enviado a terceros</label>
            </div>
        </div>
        <div class="col-lg-9">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="sw3">
                <label class="form-check-label ms-2 pt-1" for="sw3">Proveedor realizará evaluación</label>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <div class="modal fade" :id="modalimgevaid" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
            data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Subir Imagen</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12">
                                <label>Subir Imagen</label>
                                <input type="file" id="eva-img" class="form-control">
                            </div>
                            <div class="col-12">
                                <label>Detalle</label>
                                <textarea rows="3" id="eva-detalle" class="form-control" placeholder="Ingresar detalle"></textarea>
                            </div>
                            <div class="col-12">
                                <button @click="guardarImgEva" class="btn btn-primary w-100">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    modelo: {
        type: Object,
        require: true
    }
})

let modalimgevaid = Util.uuid()
let form = ref({
    laudo_codigo: '',
    laudo_fecha: '',
    producto_recibido: [],
    imgs_evaluacion: [],
    causa: '',
    resultado_id: '',
    conclusion: '',
    recomendacion: ''
})
let lista_recibidos = ref([])
let lista_evaluados = ref([])

let resultados = ref([])
let step1 = ref(false)
let errores = ref([])

const evaProceso = async (e) => {
    let pre = await Util.confirmar()
    if (!pre) return e.target.checked = step1.value
    Util.cargando(1)
    ac.post(`/reclamo-queja/${props.modelo.id}/evaluacion-en-proceso`)
        .then(({ data }) => {
    step1.value = e.target.checked
        Swal.fire('Evaluación en Proceso Activado!.', '', 'success')
    })
    .catch((err) => {
        e.target.checked = step1.value
        errores.value = (err.response.status == 422) ? err.response.data.errors : []
    })
    .finally(() => Util.cargando(-1))
}

const getResultados = () => {
    Util.cargando(1)
    ac.get('/evaluacion-proceso-resultados')
        .then(({ data }) => {
            resultados.value = data
        })
        .finally(() => Util.cargando(-1))
}

const agregarImg = (e) => {
    const fileInput = e.currentTarget.querySelector("input[type='file']")
    if (fileInput) {
        fileInput.click()
    }
}

const agregarImgDesc = () => {
    $(`#${modalimgevaid}`).modal('show')
}

const changeFile = (e) => {
    const file = e.target.files[0]
    if (file && form.value.producto_recibido.length < 10) {
        form.value.producto_recibido.push(file)
        const reader = new FileReader()
        reader.onload = (e) => {
            lista_recibidos.value.push({ url: e.target.result })
            Toast.fire({ icon: 'success', title: 'Imagen agregada' })
        }
        reader.readAsDataURL(file)
    }
}

const guardarImgEva = () => {
    const file = document.getElementById('eva-img').files[0]
    const detalle = document.getElementById('eva-detalle').value
    if (file && form.value.imgs_evaluacion.length < 10) {
        form.value.imgs_evaluacion.push({ file, detalle })
        const reader = new FileReader()
        reader.onload = (e) => {
            lista_evaluados.value.push({ url: e.target.result, detalle })
            Toast.fire({ icon: 'success', title: 'Imagen agregada' })
        }
        reader.readAsDataURL(file)
        document.getElementById('eva-img').value = ''
        document.getElementById('eva-detalle').value = ''
        $(`#${modalimgevaid}`).modal('hide')
    }
}

const eliminarImg = (data, key, tipo) => {
    
}

onMounted(() => {
    getResultados()
})

</script>

<style scoped>
.form-switch .form-check-input {
    width: 3em;
    height: 1.5em;
}

.upload-box {
    width: 120px;
    height: 120px;
    background-color: var(--bs-light2);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    font-family: Arial, sans-serif;
}

.upload-box:hover {
    background-color: #e0e3e7;
}

.upload-text {
    color: var(--bs-theme-11);
    font-size: 12px;
    margin-bottom: 8px;
}

.upload-icon {
    width: 40px;
    height: 40px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: var(--bs-theme-11);
    border: 2px solid var(--bs-theme-11);
}

.upload-box:hover .upload-icon {
    background-color: var(--bs-theme-11);
    color: white;
}

.list-img .btn {
    display: none;
}

.list-img:hover .btn {
    display: block;
}
</style>