<template>
    <div class="container">
        <StepNavigation :steps="pasos" :activeStep="pasoActivo" @update:activeStep="setPasoActivo" />

        <div class="card shadow-none bg-white mt-4 border">
            <div class="card-body rounded-lg">
                <div v-show="pasoActivo == 1">
                    <MultipleRadioButton :titulo="'Seleccionar Motivo por Producto'" :opciones="$storeOption.getters.getMotivosProductos" v-model="form.motivo" />
                </div>
                <div v-show="pasoActivo == 2">
                    <BuscarDocumento ref="step2" @documentoBuscado="asignarDatos" />
                </div>
                <div v-show="pasoActivo == 3">
                    <DatosCliente ref="step3" />
                </div>
                <div v-show="pasoActivo == 4">
                    <SeleccionarProducto ref="step4" />
                </div>
                <div v-show="pasoActivo == 5">
                    <DetalleAdjunto ref="step5" />
                </div>

                <div class="row">
                    <div class="col-lg-12 mt-5 text-end">
                        <button v-if="pasoActivo > 1" @click="atras" class="btn btn-secondary px-4 me-3">Atras</button>
                        <button v-if="pasoActivo != pasos.length" :disabled="!activarSiguiente" @click="siguiente" class="btn btn-primary px-4">Siguiente</button>
                        <button v-if="pasoActivo == pasos.length" :disabled="!activarSiguiente" @click="confirmar" class="btn btn-primary px-4">
                            Registrar Reclamo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref, defineComponent, computed, watch, toRaw } from 'vue'
    import acf from '@/config/axiosF'
    import MultipleRadioButton from '@/components/utilitarios/MultipleRadioButton.vue'
    import StepNavigation from '@/components/utilitarios/StepNavigation.vue'
    import BuscarDocumento from '@/modules/Forms/layouts/BuscarDocumento.vue'
    import DatosCliente from '@/modules/Forms/layouts/DatosCliente.vue'
    import SeleccionarProducto from '@/modules/Forms/layouts/SeleccionarProducto.vue'
    import DetalleAdjunto from '@/modules/Forms/layouts/DetalleAdjunto.vue'
    import store from '@/config/store'

    const emit = defineEmits(['regresar'])

    defineComponent({    
        BuscarDocumento,
        DatosCliente,
        SeleccionarProducto,
        DetalleAdjunto,
        StepNavigation
    })

    let step2 = ref(null)
    let step3 = ref(null)
    let step4 = ref(null)
    let step5 = ref(null)

    let pasoActivo = ref(1)
    let pasos = ref([
        { id: 1, titulo: 'Motivo de Reclamo', activo: true, enable: true },
        { id: 2, titulo: 'Buscar Documento', activo: false, enable: false },
        { id: 3, titulo: 'Datos del Cliente/Reclamante', activo: false, enable: false },
        { id: 4, titulo: 'Seleccionar Producto', activo: false, enable: false },
        { id: 5, titulo: 'Detalle Adjunto', activo: false, enable: false }
    ])
    
    let form = ref({
        motivo: '',
    })

    const asignarDatos = (data) => {
        let productos = (data.productos) ? data.productos : []
        step3.value.asignarCliente({
            nombre: store.getters.getUsuario.documento,
            clasificacion_venta: data?.clasificacion_venta,
            potencial_venta: data?.potencial_venta
        })
        step4.value.asignarProductos(productos)
    }


    const activarSiguiente = computed(() => {
        if (pasoActivo.value == 1) return (form.value.motivo != '')
        if (pasoActivo.value == 2) return step2.value.validar()
        if (pasoActivo.value == 3) return step3.value.validar()
        if (pasoActivo.value == 4) return step4.value.validar()
        if (pasoActivo.value == 5) return step5.value.validar()
        return false
    })

    const siguiente = () => {
        if (pasoActivo.value < pasos.value.length) {
            pasos.value[pasoActivo.value - 1].activo = false
            pasos.value[pasoActivo.value - 1].enable = true
            pasoActivo.value++
            pasos.value[pasoActivo.value - 1].activo = true
            pasos.value[pasoActivo.value - 1].enable = true
        }
    }

    const atras = () => {
        if (pasoActivo.value > 1) {
            pasos.value[pasoActivo.value - 1].activo = false
            pasos.value[pasoActivo.value - 1].enable = true
            pasoActivo.value--
            pasos.value[pasoActivo.value - 1].activo = true
            pasos.value[pasoActivo.value - 1].enable = true
        } else {
            emit('regresar')
        }
    }

    const setPasoActivo = (nuevoPaso) => {
        pasoActivo.value = nuevoPaso
    }

    const finalizar = () => {
        Util.cargando(1)
        let form2 = crearForm()
        acf.post('/registrar-queja-producto', form2)
            .then(({data}) => {
                registrado()
            }).catch((err) => {
                noRegistrado(err?.response?.data?.message)
            })
            .finally(() => Util.cargando(-1))
    }

    const crearForm = () => {
        let datos2 = step2.value.obtenerDatos()
        let datos3 = step3.value.obtenerDatos()
        let datos4 = step4.value.obtenerDatos()
        let datos5 = step5.value.obtenerDatos()
        let formData = new FormData()
        formData.append('form_1_motivo', form.value.motivo)
        Object.entries(datos2).forEach(([key, value]) => {
            formData.append('form_2_' + key, value)
        })
        Object.entries(datos3).forEach(([key, value]) => {
            formData.append('form_3_' + key, value)
        })
        formData.append('form_4_producto_id', datos4.producto?.codigo)
        formData.append('form_4_cantidad', datos4.producto?.cantidad)
        Object.entries(toRaw(datos5)).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(item => {
                    if (item instanceof File) {
                        formData.append(`form_5_${key}`, item, item.name)
                    } else if (item && item.file && item.file instanceof File) {
                        formData.append(`form_5_${key}`, item.file, item.file.name)
                    }
                })
            } else if (typeof value === 'string') {
                formData.append(`form_5_${key}`, value)
            }
        })

        return formData
    }

    const noRegistrado = (mensaje = null) => {
        Swal.fire({
            icon: 'success',
            title: 'No se ha registrado',
            text: (mensaje != null) ? mensaje: 'Ha ocurrido algo inesperado.',
            confirmButtonText: 'Intentar de nuevo'
        }).then(() => {})        
    }

    const registrado = () => {
        Swal.fire({
            icon: 'success',
            title: 'Queja Registrada',
            text: '',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            resetear()
        })    
    }

    const resetear = () => {
        pasos.value.forEach(e => {
            if (e.id != 1) {
                e.activo = false 
                e.enable = false
            } else {
                e.activo = true 
                e.enable = true
            }
        })
        setPasoActivo(1)
        form.value.motivo = ''
        step2.value.limpiar()
        step3.value.limpiar()
        step4.value.limpiar()
        step5.value.limpiar()
    }

    const confirmar = () => {
        Swal.fire({
            title: '¿Estás seguro de registrar la queja?',
            text: "Una vez registrado no podrá modificar la información",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, registrar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                finalizar()
            }
        })
    }

    watch(() => pasoActivo.value, (n) => {
        if (pasoActivo.value == 3) step3.value.asignarCliente({
            nombre: store.getters.getUsuario.documento
        })
    })

    defineExpose({ resetear })
</script>
<style scoped>
    
</style>