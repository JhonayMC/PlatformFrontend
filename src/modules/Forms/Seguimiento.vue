<template>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-lg-12">
                <div class="card shadow-none border">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-2 col-md-3">
                                <label class="d-flex justify-content-between">
                                    Tipo de Registro <small @click="filtros.tipo_registro = ''"
                                        class="cursor-pointer text-muted">Limpiar</small>
                                </label>
                                <select v-model.trim="filtros.tipo_registro" class="form-select">
                                    <option value="" selected>Todos</option>
                                    <option value="reclamos">Reclamos</option>
                                    <option value="quejas">Quejas</option>
                                </select>
                            </div>
                            <div class="col-lg-4 col-md-3">
                                <label class="d-flex justify-content-between">
                                    Cliente <small @click="filtros.buscar = ''"
                                        class="cursor-pointer text-muted">Limpiar</small>
                                </label>
                                <input v-model.trim="filtros.buscar" type="search" class="form-control"
                                    placeholder="Ingrese Código, Razón Social, RUC">
                            </div>
                            <div class="col-lg-2 col-md-3">
                                <label class="d-flex justify-content-between">
                                    Estado <small @click="filtros.estado = ''"
                                        class="cursor-pointer text-muted">Limpiar</small>
                                </label>
                                <select v-model.trim="filtros.estado" class="form-select">
                                    <option value="" disabled selected>Seleccionar</option>
                                    <option v-for="(d, i) in $storeOption.getters.getEstados" :key="i" :value="d.id">{{
                                        d.nombre }}</option>
                                </select>
                            </div>
                            <div class="col-lg-2 col-md-3">
                                <label class="d-flex justify-content-between">
                                    Leyenda <small @click="filtros.leyenda = ''"
                                        class="cursor-pointer text-muted">Limpiar</small>
                                </label>
                                <select v-model.trim="filtros.leyenda" class="form-select">
                                    <option value="" disabled selected>Seleccionar</option>
                                    <option value="NCP">Nota de Crédito de Proveedor</option>
                                    <option value="NCC">Nota de Crédito de Cliente</option>
                                </select>
                            </div>
                            <div class="col-lg-2 d-flex align-items-end">
                                <button @click="obtenerDatos(1)" class="btn btn-primary w-100">Filtrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-12">
                <div class="card shadow-none border">
                    <div class="card-body">
                        <div class="row mt-4">
                            <div class="table-responsive" style="max-height: 30em;overflow: auto;">
                                <table class="table table-hovered text-center">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>N° de Registro</th>
                                            <th>Motivo</th>
                                            <th>Fecha Registro</th>
                                            <th>Código Cliente</th>
                                            <th>Razón Social del Cliente</th>
                                            <th>Clasif. Venta</th>
                                            <th>Poten. Venta</th>
                                            <th>Documento</th>
                                            <th>Modalidad</th>
                                            <th>CL/CM</th>
                                            <th>Proveedor</th>
                                            <th>NC</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(d, i) in lista" :key="i">
                                            <td>{{ d.nro }}</td>
                                            <td>{{ d.id }}</td>
                                            <td>{{ d.motivo }}</td>
                                            <td>{{ d.fecha_registro }}</td>
                                            <td>{{ d.codigo_cliente }}</td>
                                            <td>{{ d.razon_social }}</td>
                                            <td>{{ d.clasificacion_venta }}</td>
                                            <td>{{ d.potencial_venta }}</td>
                                            <td>{{ d.documento }}</td>
                                            <td>{{ d.modalidad }}</td>
                                            <td>{{ d.cl_cm }}</td>
                                            <td>{{ d.proveedor }}</td>
                                            <td>{{ d.nc }}</td>
                                            <td>{{ d.estado_desc }}</td>
                                            <td class="d-flex flex-wrap gap-1">
                                                <button @click="detalle.mostrarModal(d.id)"
                                                    class="btn btn-sm btn-outline-primary" title="Ver Detalle">
                                                    <i class="far fa-eye"></i>
                                                </button>
                                                <button v-if="d.estado == 2" @click="anular.mostrarModal(d.id)"
                                                    class="btn btn-sm btn-outline-primary" title="Anular">
                                                    <i class="far fa-close"></i>
                                                </button>
                                                <!-- <button class="btn btn-sm btn-outline-primary" title="Sugerir">
                                                    <i class="far fa-comment"></i>
                                                </button> -->
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <nav class="flex-center">
                                        <ul class="pagination mx-auto">
                                            <li class="page-item" :class="{ disabled: !paginacion.has_prev }">
                                                <a class="page-link" @click="cambiarPagina(paginacion.page - 1)"
                                                    aria-label="Previous">
                                                    <span aria-hidden="true">&laquo;</span>
                                                </a>
                                            </li>
                                            <li v-for="p in paginacion.total_pages" :key="p"
                                                class="page-item cursor-pointer" :class="{ active: p === paginacion.page }">
                                                <a class="page-link" @click="cambiarPagina(p)">{{ p }}</a>
                                            </li>
                                            <li class="page-item" :class="{ disabled: !paginacion.has_next }">
                                                <a class="page-link" @click="cambiarPagina(paginacion.page + 1)"
                                                    aria-label="Next">
                                                    <span aria-hidden="true">&raquo;</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <div>
                <ModalAnularRq ref="anular" @guardado="obtenerDatos" />
            </div>
            <div>
                <ModalDetalleRq ref="detalle" />
            </div>
        </Teleport>
    </div>
</template>
<script setup>
import ModalAnularRq from '@/components/modules/Seguimiento/ModalAnularRq.vue'
import ModalDetalleRq from '@/components/modules/Seguimiento/ModalDetalleRq.vue'
import { ref, defineComponent } from 'vue'
import store from '@/config/store'

defineComponent({
    ModalAnularRq,
    ModalDetalleRq
})

let anular = ref(null)
let detalle = ref(null)
let filtros = ref({
    tipo_registro: '',
    buscar: '',
    estado: '',
    leyenda: '',
})
let lista = ref([])
let paginacion = ref({
    page: 1,
    items_per_page: 10,
    total_pages: 1,
    has_next: false,
    has_prev: false
})
let seleccionado = ref('')


const obtenerDatos = (pagina = 1) => {
    setFiltros()
    seleccionado.value = ''
    Util.cargando(1)
    ac.get('/seguimiento', {
        params: {
            page: pagina,
            tipo_registro: filtros.value.tipo_registro,
            buscar: filtros.value.buscar,
            estado: filtros.value.estado,
            leyenda: filtros.value.leyenda
        }
    })
        .then(({ data }) => {
            lista.value = data.data
            paginacion.value.page = data.pagination_info.page
            paginacion.value.items_per_page = data.pagination_info.items_per_page
            paginacion.value.total_pages = data.pagination_info.total_pages
            paginacion.value.has_next = data.pagination_info.has_next
            paginacion.value.has_prev = data.pagination_info.has_prev
            if (pagina == 1) Toast.fire({ icon: 'success', title: 'Su consulta ha sido cargada.' })
        }).catch((err) => {
            Toast.fire({ icon: 'error', title: 'Oops ha ocurrido algo inesperado.' })
        }).finally(() => Util.cargando(-1))
}

const setFiltros = () => {
    if (store.getters.getUsuario.tipo_usuarios_id == 3) {
        filtros.value.estado = 2
    }
    if (store.getters.getUsuario.tipo_usuarios_id == 4) {
        filtros.value.estado = 5
    }
}

const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= paginacion.value.total_pages) {
        obtenerDatos(nuevaPagina)
    }
}

defineExpose({ obtenerDatos })

</script>
<style scoped></style>