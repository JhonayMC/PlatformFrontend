<template>
    <div class="modal fade" :id="modal_id" tabindex="-1" aria-hidden="true" data-bs-backdrop="static"
        data-bs-keyboard="false">
        <div class="modal-dialog modal-xxl">
            <div class="modal-content">
                <div class="modal-header row">
                    <div class="col-lg-4">
                        <h5 class="modal-title">
                            Detalle: {{ modelo.cliente?.codigo }} - {{ modelo.cliente?.nombre_completo }}
                        </h5>
                    </div>
                    <div class="col-lg-4">
                        <div class="input-group">
                            <button :class="panel == 1 ? 'btn btn-primary w-50' : 'btn btn-outline-primary w-50'"
                                @click="panel = 1">
                                Detalle
                            </button>
                            <button
                                v-if="modelo.id != '' && habilitarCierre && store.getters.getUsuario.tipo_usuarios_id == 3"
                                :class="panel == 2 ? 'btn btn-primary w-50' : 'btn btn-outline-primary w-50'"
                                @click="panel = 2">
                                Cierre
                            </button>
                            <button
                                v-if="modelo.id != '' && habilitarCierre && store.getters.getUsuario.tipo_usuarios_id == 4"
                                :class="panel == 3 ? 'btn btn-primary w-50' : 'btn btn-outline-primary w-50'"
                                @click="panel = 3">
                                Evaluación
                            </button>
                        </div>
                    </div>
                    <div class="col-lg-4 text-end">
                        <button @click="cancelar" type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                </div>
                <div v-if="modelo.id != ''" class="modal-body">
                    <div v-if="panel == 1" class="row">
                        <div class="col-lg-9">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="table-responsive">
                                        <table class="table table-sm table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td colspan="3">&nbsp;</td>
                                                    <td align="end"><span class="badge text-dark border">Estado: {{
                                                        modelo.estado_desc }}</span></td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Tipo de Registro:</th>
                                                    <td class="text-muted">{{ modelo.tipo_registro }}</td>
                                                    <th class="fw-semibold">N° de Registro</th>
                                                    <td class="text-muted">{{ modelo.motivo }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Motivo:</th>
                                                    <td class="text-muted">{{ modelo.motivo }}</td>
                                                    <th class="fw-semibold">Fecha de Registro</th>
                                                    <td class="text-muted">{{ modelo.fecha_registro }}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Cliente:</th>
                                                    <td class="text-muted">{{ modelo.cliente?.codigo }}-{{
                                                        modelo.cliente?.nombre_completo }}</td>
                                                    <th>&nbsp;</th>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Clasificación venta:</th>
                                                    <td class="text-muted">{{ modelo.cliente?.clasificacion_venta }}</td>
                                                    <th class="fw-semibold">Potencial venta:</th>
                                                    <td class="text-muted">{{ modelo.cliente?.potencial_venta }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Persona que registro:</th>
                                                    <td class="text-muted">{{ modelo.registrador?.nombre }}</td>
                                                    <th class="fw-semibold">DNI:</th>
                                                    <td class="text-muted">{{ modelo.registrador?.documento }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Teléfono:</th>
                                                    <td class="text-muted">{{ modelo.registrador?.celular }}</td>
                                                    <th class="fw-semibold">E-Mail:</th>
                                                    <td class="text-muted">{{ modelo.registrador?.correo }}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">N° Factura:</th>
                                                    <td class="text-muted">{{ modelo.nro_factura }}</td>
                                                    <th class="fw-semibold">Fecha de venta:</th>
                                                    <td class="text-muted">{{ modelo.fecha_venta }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">N° Interno:</th>
                                                    <td class="text-muted">{{ modelo.nro_interno }}</td>
                                                    <th class="fw-semibold">Provincia:</th>
                                                    <td class="text-muted">{{ modelo.provincia }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">N° Guía de remisión:</th>
                                                    <td class="text-muted">{{ modelo.nro_guia_remision }}</td>
                                                    <th class="fw-semibold">Sucursal:</th>
                                                    <td class="text-muted">{{ modelo.sucursal }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Almacén:</th>
                                                    <td class="text-muted">{{ modelo.almacen }}</td>
                                                    <th class="fw-semibold">Vendedor:</th>
                                                    <td class="text-muted">{{ modelo.vendedor }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Condición de pago:</th>
                                                    <td class="text-muted">{{ modelo.condicion_pago }}</td>
                                                    <th class="fw-semibold">Transportista:</th>
                                                    <td class="text-muted">{{ modelo.transportista }}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4">
                                                        <p class="fw-semibold">Producto en reclamo:</p>
                                                        <div class="table-responsive">
                                                            <table class="table table-sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="fw-semibold text-primary2">Código</th>
                                                                        <th class="fw-semibold text-primary2">Línea</th>
                                                                        <th class="fw-semibold text-primary2">Organización
                                                                        </th>
                                                                        <th class="fw-semibold text-primary2">Marca</th>
                                                                        <th class="fw-semibold text-primary2">Marca
                                                                            Descripción</th>
                                                                        <th class="fw-semibold text-primary2">Fábrica</th>
                                                                        <th class="fw-semibold text-primary2">Artículo</th>
                                                                        <th class="fw-semibold text-primary2">Nombre</th>
                                                                        <th class="fw-semibold text-primary2">Precio de
                                                                            Venta</th>
                                                                        <th class="fw-semibold text-primary2">Cantidad</th>
                                                                        <th class="fw-semibold text-primary2">Und. Reclamo
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="(p, i) in modelo.productos" :key="i"
                                                                        class="text-muted">
                                                                        <td>{{ p.codigo }}</td>
                                                                        <td>{{ p.linea }}</td>
                                                                        <td>{{ p.organizacion }}</td>
                                                                        <td>{{ p.marca }}</td>
                                                                        <td>{{ p.marca_desc }}</td>
                                                                        <td>{{ p.fabrica }}</td>
                                                                        <td>{{ p.articulo }}</td>
                                                                        <td>{{ p.nombre }}</td>
                                                                        <td>{{ p.precio_venta }}</td>
                                                                        <td>{{ p.cantidad }}</td>
                                                                        <td>{{ p.und_reclamo }}</td>
                                                                    </tr>
                                                                    <tr v-if="!modelo.productos?.length">
                                                                        <td colspan="11" align="center">No se encontró
                                                                            productos.</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">N° de Placa:</th>
                                                    <td class="text-muted">{{ modelo.transporte?.nro_placa }}</td>
                                                    <th class="fw-semibold">Marca:</th>
                                                    <td class="text-muted">{{ modelo.transporte?.marca }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Año:</th>
                                                    <td class="text-muted">{{ modelo.transporte?.anio }}</td>
                                                    <th class="fw-semibold">&nbsp;</th>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Modelo del Vehiculo:</th>
                                                    <td class="text-muted">{{ modelo.transporte?.modelo }}</td>
                                                    <th class="fw-semibold">Modelo del Motor:</th>
                                                    <td class="text-muted">{{ modelo.transporte?.motor }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Tipo de operación:</th>
                                                    <td class="text-muted">{{ modelo.tipo_operacion }}</td>
                                                    <th>&nbsp;</th>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Fecha de Instalación del Producto:</th>
                                                    <td class="text-muted">{{ modelo.fecha_instalacion }}</td>
                                                    <th>&nbsp;</th>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Kilometraje en la instalación:</th>
                                                    <td class="text-muted">{{ modelo.km_instalacion }}<i>km</i></td>
                                                    <th class="fw-semibold">Horas de uso del producto en reclamo:</th>
                                                    <td class="text-muted">{{ modelo.hora_uso }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold">Kilometraje recorrido:</th>
                                                    <td class="text-muted">{{ modelo.km_recorrido }}<i>km</i></td>
                                                    <th class="fw-semibold">Kilometraje actual:</th>
                                                    <td class="text-muted">{{ modelo.km_actual }}<i>km</i></td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <th class="fw-semibold" colspan="4">Detalle de reclamo:</th>
                                                </tr>
                                                <tr>
                                                    <td colspan="4" class="text-muted">{{ modelo.detalle }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <p>Adjuntos:</p>
                                    <div class="row">
                                        <div class="col-lg-3" v-for="(a, i) in archivos" :key="i">
                                            <a :href="a.url" download target="_blank"
                                                class="card border shadow-none text-decoration-none">
                                                <component :is="a.tipo" class="card-img-top"
                                                    v-bind="a.tipo === 'img' ? { src: a.url, alt: 'Imagen adjunta' } : { controls: true }">
                                                    <source v-if="a.tipo === 'video'" :src="a.url" :type="a.mime">
                                                    Tu navegador no soporta este formato de video.
                                                </component>
                                                <div class="card-body">
                                                    <p class="card-text">{{ a.nombre }}</p>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 border-start">
                            <div class="row">
                                <div v-if="store.getters.getUsuario.tipo_usuarios_id == 3" class="col-12">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" @change="enTienda" :disabled="modelo.en_tienda"
                                            type="checkbox" id="swtichPT" :checked="modelo.en_tienda">
                                        <label class="form-check-label" for="swtichPT">Productos en Tienda</label>
                                    </div>
                                </div>
                                <div v-if="store.getters.getUsuario.tipo_usuarios_id == 4" class="col-12">
                                    <button v-if="!modelo.conformidad" @click="solicitarConformidad"
                                        class="btn btn-warning w-100">
                                        <i class="far fa-warning"></i> Solicitar Conformidad
                                    </button>
                                    <i v-if="modelo.conformidad" class="btn" disabled>Solicitud de Conformidad Enviada.</i>
                                </div>
                                <div class="col-lg-12">
                                    <p>Formato de Registro:</p>
                                    <a :href="modelo.pdf?.url" download target="_blank"
                                        class="card border shadow-none text-decoration-none">
                                        <div class="card-body p-2 d-flex flex-wrap gap-2 align-items-center">
                                            <div><i class="fas fa-file-pdf h2"></i></div>
                                            <div class="card-text">
                                                {{ modelo.pdf?.nombre }}
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div v-if="store.getters.getUsuario.tipo_usuarios_id == 3" class="col-lg-12">
                                    <div v-if="!modelo.guiado" class="card shadow-none bg-light">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <label>Recoger productos en agencia:</label>
                                                    <input type="file" class="form-control" @change="readFile($event)"
                                                        :class="(errores.guia) ? 'is-invalid' : ''"
                                                        accept="application/pdf,image/*">
                                                    <small v-if="errores.guia">{{ errores.guia[0] }}</small>
                                                </div>
                                                <div class="col-lg-12">
                                                    <label>Fecha de Llegada:</label>
                                                    <input v-model.trim="form.fecha" type="date" class="form-control"
                                                        :class="(errores.fecha) ? 'is-invalid' : ''">
                                                    <small v-if="errores.fecha">{{ errores.fecha[0] }}</small>
                                                </div>
                                                <div class="col-lg-12 text-end">
                                                    <button @click="guardarGuia" class="btn btn-primary">Guardar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="modelo.guiado" class="card bg-light">
                                        <p>Fecha de Llegada: {{ modelo.guiado?.fecha }}</p>
                                        <p>Archivo: <a :href="modelo.guiado?.archivo" target="_blank" rel="noopener noreferrer">Has clic aquí para descargar.</a>
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-12 mt-5">
                                    <p>Comentarios:</p>
                                    <hr>
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <textarea v-model.trim="form.comentario" cols="30" rows="2" class="form-control"
                                                :class="(errores.comentario) ? 'is-invalid' : ''"
                                                placeholder="Escribe un comentario"></textarea>
                                            <small v-if="errores.comentario">{{ errores.comentario[0] }}</small>
                                        </div>
                                        <div class="col-lg-12 text-end">
                                            <button @click="guardarComentario"
                                                class="btn btn-sm btn-primary">Comentar</button>
                                        </div>
                                    </div>
                                    <div class="overflow-auto" style="max-height: 20em;">
                                        <div v-for="(d, i) in modelo.comentarios" :key="i"
                                            class="card shadow-none border-0">
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <small>{{ d.creado_por }}</small>
                                                        <div>
                                                            <small>{{ d.comentario }}</small>
                                                        </div>
                                                        <div class="text-end text-muted">
                                                            <small><i>{{ d.creado_el }}</i></small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="!modelo.comentarios?.length">
                                            <p class="text-muted">No hay comentarios.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="panel == 2" class="row justify-content-center">
                        <div class="col-lg-9 text-end">
                            <span class="badge text-dark border">Estado: {{ modelo.estado_desc }}</span>
                        </div>
                        <div class="col-lg-9">
                            <div class="row">
                                <div class="col-lg-4">
                                    <label>Origen de reclamo:</label>
                                    <select v-model.trim="cierreForm.origen"
                                        :class="(errores.origen) ? 'is-invalid form-select' : 'form-select'">
                                        <option value="" disabled>Seleccionar</option>
                                        <option v-for="(d, i) in $storeOption.getters.getOrigenes" :key="i" :value="d.id">{{
                                            d.nombre }}</option>
                                    </select>
                                    <small v-if="errores.origen" class="text-danger">{{ errores.origen[0] }}</small>
                                </div>
                                <div class="col-12">
                                    <label>Detalle de Solución:</label>
                                    <textarea v-model.trim="cierreForm.detalle" rows="5"
                                        :class="(errores.detalle) ? 'is-invalid form-control' : 'form-control'"></textarea>
                                    <small v-if="errores.detalle" class="text-danger">{{ errores.detalle[0] }}</small>
                                </div>
                                <div class="col-12 text-end">
                                    <button @click="cierre" class="btn btn-primary px-5">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <EvaluacionTecnica v-if="panel == 3" :modelo="modelo" />
                </div>
                <div v-if="modelo.id == ''" class="modal-body">
                    <div class="alert alert-danger" role="alert">
                        <h4 class="alert-heading">Detalle no encontrado!</h4>
                        <p>No se ha encontrado el registro.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineComponent } from 'vue'
import acf from '@/config/axiosF'
import store from '@/config/store'
import EvaluacionTecnica from '@/components/modules/Seguimiento/layouts/EvaluacionTecnica.vue'

defineComponent({
    EvaluacionTecnica,
})

let panel = ref(1)
let modal_id = Util.uuid()
let modelo = ref({
    id: '',
    adjuntos: []
})
let form = ref({
    guia: '',
    fecha: '',
    comentario: ''
})
let cierreForm = ref({
    origen: '',
    detalle: ''
})
let errores = ref([])
const habilitarCierre = ref(false)

const mostrarModal = (id) => {
    modelo.value.id = id
    panel.value = 1
    $(`#${modal_id}`).modal('show')
    obtenerDetalle(id)
}

const cancelar = () => {
    modelo.value.id = ''
    $(`#${modal_id}`).modal('hide')
}

const obtenerDetalle = async () => {
    Util.cargando(1)
    ac.get(`/reclamo-queja/${modelo.value.id}`)
        .then(({ data }) => {
            panel.value = 1
            modelo.value = data
            habilitarCierre.value = verificarCerrado()
        }).catch((err) => {
            errores.value = (err.response.status == 422) ? err.response.data.errors : []
        })
        .finally(() => Util.cargando(-1))
}

const guardarGuia = () => {
    Util.cargando(1)
    let formData = new FormData()
    formData.append('rq_id', modelo.value.id)
    formData.append('fecha_llegada', form.value.fecha)
    if (form.value.guia != '') { formData.append('archivo', form.value.guia, form.value.guia.name) }

    acf.post(`/reclamo-queja/${modelo.value.id}/guiado`, formData)
        .then(({ data }) => {
            form.value.guia = ''
            form.value.fecha = ''
            $('input[type="file"]').val('')
            Swal.fire('Guía registrada!', '', 'success')
            obtenerDetalle(modelo.value.id)
        }).catch((err) => {
            errores.value = (err.response.status == 422) ? err.response.data.errors : []
        }).finally(() => Util.cargando(-1))
}

const enTienda = async (e) => {
    let pre = await Util.confirmar()
    if (!pre) return e.target.checked = modelo.value.en_tienda
    Util.cargando(1)
    ac.post(`/reclamo-queja/${modelo.value.id}/en-tienda`, { en_tienda: modelo.value.en_tienda })
        .then(({ data }) => {
            modelo.value.en_tienda = e.target.checked
            Swal.fire('Recepción de Productos actualizado!.', '', 'success')
        })
        .catch((err) => {
            e.target.checked = modelo.value.en_tienda
            errores.value = (err.response.status == 422) ? err.response.data.errors : []
        })
        .finally(() => Util.cargando(-1))
}

const guardarComentario = () => {
    Util.cargando(1)
    ac.post(`/reclamo-queja/${modelo.value.id}/comentario`, { comentario: form.value.comentario })
        .then(({ data }) => {
            modelo.value.comentarios = data.data
            form.value.comentario = ''
            obtenerDetalle(modelo.value.id)
        }).catch((err) => {
            errores.value = (err.response.status == 422) ? err.response.data.errors : []
        }).finally(() => Util.cargando(-1))
}

const cierre = async () => {
    let pre = await Util.confirmar()
    if (!pre) return
    Util.cargando(1)
    ac.post(`/reclamo-queja/${modelo.value.id}/cierre`, cierreForm.value)
        .then(({ data }) => {
            Swal.fire('Registro cerrado!.', '', 'success')
            obtenerDetalle(modelo.value.id)
        }).catch((err) => {
            errores.value = (err.response.status == 422) ? err.response.data.errores : []
        }).finally(() => Util.cargando(-1))
}

const solicitarConformidad = async () => {
    let pre = await Util.confirmar()
    if (!pre) return
    Util.cargando(1)
    ac.get(`/reclamo-queja/${modelo.value.id}/solicitud-conformidad`)
        .then(({ data }) => {
            modelo.conformidad = true
            Swal.fire('Solicitud de conformidad enviada!.', '', 'success')
            obtenerDetalle(modelo.value.id)
        }).catch((err) => {
            errores.value = (err.response.status == 422) ? err.response.data.errors : []
        }).finally(() => Util.cargando(-1))
}

const obtenerTipoArchivo = (extension) => {
    const ext = extension.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext)) return "img"
    if (["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(ext)) return "video"
    return "div"
}

const obtenerTipoVideo = (extension) => {
    const tipos = {
        mp4: "video/mp4",
        webm: "video/webm",
        ogg: "video/ogg",
        mov: "video/quicktime",
        avi: "video/x-msvideo",
        mkv: "video/x-matroska"
    }
    return tipos[extension.toLowerCase()] || "video/mp4"
}

const archivos = computed(() => {
    if (modelo.value.id == '') {
        return []
    } else {
        return modelo.value.adjuntos.map(a => ({
            ...a,
            tipo: obtenerTipoArchivo(a.extension),
            mime: obtenerTipoVideo(a.extension)
        }))
    }
})

const verificarCerrado = () => {
    if (modelo.value.id == '') return false
    let estados = [1, 2, 5, 6, 7, 9]
    return (estados.includes(modelo.value.estado))
}

const readFile = (e) => {
    form.value.guia = e.target.files[0]
}


defineExpose({ mostrarModal })

</script>

<style scoped></style>