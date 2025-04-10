<template>
    <div class="row justify-content-center">
        <div class="col-lg-12">
            <p>Tipo de Documento:</p>
        </div>
        <div class="col-lg-12 d-flex justify-content-center gap-5">
            <div v-for="(d, i) in $storeOption.getters.getTipoCorrelativos" :key="i" class="form-check">
                <input v-model="form.tipocorrelativo_id" type="radio" name="rr" :id="`rr${d.id}`" :value="d.id" :checked="form.tipocorrelativo_id == d.id" class="form-check-input">
                <label class="form-check-label" :for="`rr${d.id}`">
                    {{ d.nombre }}
                </label>
            </div>
        </div>
        <div class="col-lg-8 mt-3">
            <div class="row w-100 justify-content-center">
                <label for="staticEmail" class="col-sm-4 col-form-label text-end">Ingrese número de documento:</label>
                <div class="col-sm-7 d-flex gap-3">
                    <input v-if="form.tipocorrelativo_id != 3" v-model.trim="form.serie" type="text" class="form-control w-25"
                    :class="(errores.serie) ? 'is-invalid':''" :placeholder="(form.tipocorrelativo_id == 2) ? 'F001':'B001'">
                    <input v-model="form.correlativo" type="text" class="form-control w-75" 
                    :class="(errores.correlativo) ? 'is-invalid':''" 
                    :placeholder="(form.tipocorrelativo_id != 3 ? '00000001':'0000001')">
                    <button class="btn btn-primary" @click="buscar" :disabled="activarBuscar">Buscar</button>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
    <div class="row">
        <div class="col-lg-6">
            <div class="row">
                <div v-if="store.getters.getUsuario.tipo_usuarios_id !== 1" :class="(form.fechaventa != '') ? 'col-lg-10':'col-lg-6'">
                    <label>Fecha de Venta</label>
                    <div class="row">
                        <div class="col"><input v-model.trim="form.fechaventa" type="text" class="form-control" readonly></div>
                        <div v-if="form.fechaventa" class="col d-flex align-items-center">
                            <small class="text-primary">Tiempo transcurrido: {{ tiempoTranscurrido }}</small>
                        </div>
                    </div>
                </div>
                <div v-if="store.getters.getUsuario.tipo_usuarios_id == 1" class="col-lg-6">
                    <label>Fecha de Venta</label>
                    <input v-model.trim="form.fechaventa" type="text" class="form-control" readonly>
                </div>
                <div class="clearfix"></div>
                <div class="col-lg-6">
                    <label>N° Interno</label>
                    <input v-model.trim="form.nrointerno" type="text" class="form-control" readonly>
                </div>
                <div class="col-lg-6">
                    <label>Guía de Remisión</label>
                    <input v-model.trim="form.guiaremision" type="text" class="form-control" readonly>
                </div>
                <div class="col-lg-6">
                    <label>Condición de Pago</label>
                    <input v-model.trim="form.condicionpago" type="text" class="form-control" readonly>
                </div>
                <div class="col-lg-6">
                    <label>Vendedor</label>
                    <input v-model.trim="form.vendedor" type="text" class="form-control" readonly>
                </div>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="row">
                <div class="col-lg-9">
                    <label>Departamento</label>
                    <input v-model="form.departamento" type="text" class="form-control" readonly>
                </div>
                <div class="clearfix"></div>
                <div class="col-lg-6">
                    <label>Sucursal</label>
                    <input v-model="form.sucursal" type="text" class="form-control" readonly>
                </div>
                <div class="col-lg-6">
                    <label>Almacén</label>
                    <input v-model="form.almacen" type="text" class="form-control" readonly>
                </div>
                <div class="col-lg-6">
                    <label>Transportista</label>
                    <input v-model="form.transportista" type="text" class="form-control" readonly>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref, watch, computed } from 'vue'
    import store from '@/config/store'
    import Formato from "@/config/formato.js"

    let form = ref({
        tipocorrelativo_id: 1,
        serie: '',
        correlativo: '',
        fechaventa: '',
        nrointerno: '',
        guiaremision: '',
        condicionpago: '',
        vendedor: '',
        departamento: '',
        sucursal: '',
        almacen: '',
        transportista: ''
    })
    let completado = ref(false)
    let errores = ref([])

    const emit = defineEmits(['documentoBuscado'])

    const activarBuscar = computed(() => {
        if (form.tipocorrelativo_id != 3) {
            return form.value.serie == '' && form.value.correlativo == ''        
        } else {
            return form.value.correlativo == ''
        }    
    })

    const buscar = () => {
        formatearCorrelativo()
        Util.cargando(1)
        ac.get('/buscar-documento', {
            params: { 
                tipo_documento: form.value.tipocorrelativo_id,
                serie: form.value.serie,
                correlativo: form.value.correlativo
        }})
            .then(({ data }) => {
            emit('documentoBuscado', data.data)
            Object.assign(form.value, {
                fechaventa: data.data.fechaventa,
                nrointerno: data.data.nrointerno,
                guiaremision: data.data.guiaremision,
                condicionpago: data.data.condicionpago,
                vendedor: data.data.vendedor,
                departamento: data.data.departamento,
                sucursal: data.data.sucursal,
                almacen: data.data.almacen,
                transportista: data.data.transportista
            })        
            errores.value = []
            completado.value = true
            Swal.fire({ icon: 'success', title: 'Documento encontrado', text: 'Datos cargados correctamente' })            
        }).catch((err) => {
            completado.value = false
            errores.value = (err.response.status == 422) ? err.response.data.errores : []
            Swal.fire({ icon: 'error', title: 'Error al buscar documento', text: err.response.data.message })
        }).finally(() => Util.cargando(-1))
    }

    const formatearCorrelativo = () => {
        form.value.serie = (form.value.tipocorrelativo_id == 3) ? '' : form.value.serie
        const length = (form.value.tipocorrelativo_id == 3) ? 7 : 8;
        const correlativo = form.value.correlativo.toString()
        const fmt = '0'.repeat(length - correlativo.length)
        form.value.correlativo = fmt + correlativo
    }

    const limpiar = () => {
        form.value.tipocorrelativo_id = 1
        form.value.serie = ''
        form.value.correlativo = ''
        form.value.fechaventa = ''
        form.value.nrointerno = ''
        form.value.guiaremision = ''
        form.value.condicionpago = ''
        form.value.vendedor = ''
        form.value.departamento = ''
        form.value.sucursal = ''
        form.value.almacen = ''
        form.value.transportista = ''
        completado.value = false
        errores.value = []
    }

    watch(form.value, (n) => {
        form.value.serie = Formato('licencia', n.serie).substring(0, 4)
        form.value.correlativo = Formato('digitos', n.correlativo)
            .substring(0, ((form.value.tipocorrelativo_id == 3) ? 7 : 8))
    }, { deep: true })

    const validar = () => completado.value
    const obtenerDatos = () => form.value

    const tiempoTranscurrido = computed(() => {
        if (!form.value.fechaventa) return ''

        const inicio = new Date(form.value.fechaventa)
        const ahora = new Date()
        const diferenciaMs = ahora - inicio;
        const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24))
        const horas = Math.floor((diferenciaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

        return `${dias} día(s) y ${horas} hrs.`
    })
    
    defineExpose({ validar, obtenerDatos, limpiar })

</script>
<style scoped>
    
</style>