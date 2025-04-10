<template>
    <div class="row">
        <div v-if="!props.buscador" class="col-lg-5">
            <label>Cliente</label>
            <input type="text" class="form-control" :value="form.cliente" disabled>
        </div>
        <div v-if="props.buscador" class="col-lg-5">
            <label>Cliente</label>
            <div v-if="form.cliente == ''" class="input-group">
                <input v-model.trim="textoBuscar" type="text" class="form-control"
                    placeholder="Ingrese Código, Razón Social, RUC">
                <button @click="buscarCliente" class="btn btn-light border px-lg-5" :disabled="textoBuscar == ''">
                    <i class="far fa-search"></i>
                </button>
            </div>
            <div v-if="form.cliente != ''" class="input-group">
                <input :value="form.cliente" type="text" class="form-control" disabled>
                <button @click="quitarCliente" class="btn btn-danger border px-lg-5" title="Quitar Cliente">
                    <i class="far fa-close"></i>
                </button>
            </div>
            <div v-if="textoBuscar != ''" class="resultados-buscador">
                <div v-if="lista.length">
                    <div v-for="(d, i) in lista" :key="i" class="resultado" @click="seleccionar(d)">
                        <div>Cliente: {{ d.nombre_completo }} ({{ d.documento }})</div>
                        <div><small>{{ seleccionado == d ? 'Quitar' : 'Seleccionar' }}</small></div>
                    </div>
                </div>
                <div v-if="!lista.length" class="resultado justify-content-center">
                    <div><small>No hay datos relacionados.</small></div>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
        <div v-if="store.getters.getUsuario.tipo_usuarios_id != 1" class="col-lg-12">
            <div class="row">
                <div class="col-lg-4">
                    <label>Clasificación por Venta</label>
                    <input v-model.trim="form.clasificacion_venta" type="text"
                        :class="(errores.nombres) ? 'is-invalid form-control' : 'form-control'" disabled>
                </div>
                <div class="col-lg-3"></div>
                <div class="col-lg-4">
                    <label>Potencial de Venta</label>
                    <input v-model.trim="form.potencial_venta" type="text"
                        :class="(errores.nombres) ? 'is-invalid form-control' : 'form-control'" disabled>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-2">
        <div class="col-lg-4">
            <label>DNI *</label>
            <div class="d-flex gap-5">
                <input v-model="form.dni" type="text" placeholder="00000000"
                    :class="(errores.dni) ? 'is-invalid form-control' : 'form-control'">
                <button :disabled="form.dni.length != 8" @click="buscar" class="btn btn-primary">Buscar</button>
            </div>
            <small v-if="errores.dni" class="text-danger">{{ errores.dni[0] }}</small>
        </div>
        <div class="col-lg-4">
            <label>Nombres</label>
            <input v-model.trim="form.nombres" type="text"
                :class="(errores.nombres) ? 'is-invalid form-control' : 'form-control'" :disabled="!noEncontrado">
            <small v-if="errores.nombres" class="text-danger">{{ errores.nombres[0] }}</small>
        </div>
        <div class="col-lg-4">
            <label>Apellidos</label>
            <input v-model.trim="form.apellidos" type="text"
                :class="(errores.apellidos) ? 'is-invalid form-control' : 'form-control'" :disabled="!noEncontrado">
            <small v-if="errores.apellidos" class="text-danger">{{ errores.apellidos[0] }}</small>
        </div>
    </div>
    <div class="row justify-content-between mt-2">
        <div class="col-lg-4">
            <label>E-mail *</label>
            <input v-model.trim="form.correo" type="text" placeholder="Ejem: ejemplo@dom.com"
                :class="(errores.correo) ? 'is-invalid form-control' : 'form-control'">
            <small v-if="errores.correo" class="text-danger">{{ errores.correo[0] }}</small>
        </div>
        <div class="col-lg-2"></div>
        <div class="col-lg-4">
            <label>Teléfono *</label>
            <input v-model.trim="form.telefono" type="text" placeholder="Ejem: +51912345678"
                :class="(errores.telefono) ? 'is-invalid form-control' : 'form-control'">
            <small v-if="errores.telefono" class="text-danger">{{ errores.telefono[0] }}</small>
        </div>
        <div class="col-lg-1"></div>
    </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import store from '@/config/store'
import Formato from "@/config/formato.js"

const props = defineProps({
    buscador: {
        type: Boolean,
        default: false
    }
})

let textoBuscar = ref('')
let lista = ref([])
let seleccionado = ref('')
let form = ref({
    cliente: '',
    dni: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    clasificacion_venta: '',
    potencial_venta: '',
})
let noEncontrado = ref(false)
let errores = ref([])

const asignarCliente = (cliente) => {
    if (!props.buscador) {
        form.value.cliente = cliente.nombre
        if (store.getters.getUsuario.tipo_usuarios_id != 1) {
            form.value.clasificacion_venta = cliente?.clasificacion_venta
            form.value.potencial_venta = cliente?.potencial_venta
        }
    }
}

const seleccionar = (data) => {
    form.value.cliente = `${data.documento}-${data.nombre_completo}`
    form.value.clasificacion_venta = data?.clasificacion_venta
    form.value.potencial_venta = data?.potencial_venta
    textoBuscar.value = ''
    lista.value = []
}

const buscar = () => {
    Util.cargando(1)
    ac.get(`/buscar-dni/${form.value.dni}`)
        .then(({ data }) => {
            noEncontrado.value = false
            form.value.nombres = data?.data?.nombres
            form.value.apellidos = data?.data?.apellidos
            errores.value = []
            Swal.fire({ icon: 'success', title: 'Persona Encontrada', text: 'Datos cargados correctamente' })
        }).catch((err) => {
            noEncontrado.value = true
            errores.value = (err.response.status == 422) ? err.response.data.errores : []
            Swal.fire({ icon: 'error', title: 'Error al buscar la persona', text: err.response.data.message })
        }).finally(() => Util.cargando(-1))
}

const buscarCliente = () => {
    Util.cargando(1)
    ac.get('/buscar-cliente', { params: { buscar: textoBuscar.value }})
        .then(({ data }) => {
            lista.value = data
            errores.value = []
        }).catch((err) => {
            errores.value = (err.response.status == 422) ? err.response.data.errores : []
            Swal.fire({ icon: 'error', title: 'Error al buscar la persona', text: err.response.data.message })
        }).finally(() => Util.cargando(-1))
}

const quitarCliente = () => {
    form.value.cliente = ''
    form.value.clasificacion_venta = ''
    form.value.potencial_venta = ''
    seleccionado.value = ''
    lista.value = []
    textoBuscar.value = ''
}


const limpiar = () => {
    form.value.cliente = ''
    form.value.dni = ''
    form.value.nombres = ''
    form.value.apellidos = ''
    form.value.correo = ''
    form.value.telefono = ''

    noEncontrado.value = false
    errores.value = []
}


const completado = computed(() => {
    return errores.value.length == 0
        && form.value.dni != ''
        && form.value.nombres != ''
        && form.value.apellidos != ''
        && form.value.correo != ''
        && form.value.telefono != ''
})

watch(() => form.value, (n) => {
    form.value.dni = Formato('digitos', n.dni).substring(0, 8)
    form.value.nombres = Formato('nombre', n.nombres)
    form.value.apellidos = Formato('nombre', n.apellidos)
    form.value.correo = Formato('correo', n.correo)
    form.value.telefono = Formato('celular', n.telefono)
}, { deep: true })

const validar = () => completado.value
const obtenerDatos = () => form.value

defineExpose({ validar, obtenerDatos, limpiar, asignarCliente })
</script>
<style scoped>
.resultados-buscador {
    position: absolute;
    background: #fff;
    width: 500px;
    border-radius: 0rem 0rem 0.5rem .5rem;
    border: 1px solid #ededed;
}

.resultados-buscador .resultado {
    padding: .5rem 1rem;
    display: flex;
    justify-content: space-between;
    cursor: pointer
}

.resultados-buscador .resultado:hover,
.resultados-buscador .resultado.activo {
    background: #ededed;
    font-weight: 600;
}
</style>