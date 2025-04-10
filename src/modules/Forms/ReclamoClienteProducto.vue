<template>
    <div class="container">
        <StepNavigation ref="stepView" :steps="pasos" :activeStep="pasoActivo" @update:activeStep="setPasoActivo" />

        <div class="card shadow-none bg-white mt-4 border">
            <div class="card-body rounded-lg">
                <div v-show="pasoActivo == 1">
                    <BuscarDocumento ref="step1" @documentoBuscado="asignarDatos" />
                </div>
                <div v-show="pasoActivo == 2">
                    <DatosCliente ref="step2" />
                </div>
                <div v-show="pasoActivo == 3">
                    <SeleccionarProducto ref="step3" />
                </div>
                <div v-show="pasoActivo == 4">
                    <DatosVehiculo ref="step4" />
                </div>
                <div v-show="pasoActivo == 5">
                    <DetalleAdjunto ref="step5" />
                </div>
                <div class="row">
                    <div class="col-lg-12 mt-5 text-end">
                        <button v-if="pasoActivo > 1" @click="atras" class="btn btn-secondary px-4 me-3">Atras</button>
                        <button v-if="pasoActivo != pasos.length" :disabled="!activarSiguiente" @click="siguiente"
                            class="btn btn-primary px-4">Siguiente</button>
                        <button v-if="pasoActivo == pasos.length" :disabled="!activarSiguiente" @click="confirmar"
                            class="btn btn-primary px-4">
                            Registrar Reclamo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref, defineComponent, computed, toRaw } from 'vue'
    import acf from '@/config/axiosF'
    import store from '@/config/store'
    import StepNavigation from '@/components/utilitarios/StepNavigation.vue'
    import BuscarDocumento from '@/modules/Forms/layouts/BuscarDocumento.vue'
    import DatosCliente from '@/modules/Forms/layouts/DatosCliente.vue'
    import SeleccionarProducto from '@/modules/Forms/layouts/SeleccionarProducto.vue'
    import DatosVehiculo from '@/modules/Forms/layouts/DatosVehiculo.vue'
    import DetalleAdjunto from '@/modules/Forms/layouts/DetalleAdjunto.vue'

    const emit = defineEmits(['regresar', 'irSeguimiento'])
    const props = defineProps({
        canvasoff: {
            type: Object
        }
    })

    let stepView = ref(null)

    defineComponent({
        BuscarDocumento,
        DatosCliente,
        SeleccionarProducto,
        DatosVehiculo,
        DetalleAdjunto,
        StepNavigation
    })

    let step1 = ref(null)
    let step2 = ref(null)
    let step3 = ref(null)
    let step4 = ref(null)
    let step5 = ref(null)
    let pasoActivo = ref(1)
    let pasos = ref([
        { id: 1, titulo: 'Buscar Documento', activo: true, enable: true },
        { id: 2, titulo: 'Datos del Cliente/Reclamante', activo: false, enable: false },
        { id: 3, titulo: 'Seleccionar Producto', activo: false, enable: false },
        { id: 4, titulo: 'Datos del Vehiculo', activo: false, enable: false },
        { id: 5, titulo: 'Detalle Adjunto', activo: false, enable: false }
    ])

    const asignarDatos = (data) => {
        let cliente_nombre = 'No disponible'
        cliente_nombre = (store.getters.getUsuario.tipo_usuarios_id == 1) ? data.cliente.nombre_completo : cliente_nombre
        cliente_nombre = (store.getters.getUsuario.tipo_usuarios_id != 1) ? `${data.cliente.documento}-${data.cliente.nombre_completo}` : cliente_nombre
        let productos = (data.productos) ? data.productos : []
        step2.value.asignarCliente({
            nombre: cliente_nombre,
            clasificacion_venta: data?.clasificacion_venta,
            potencial_venta: data?.potencial_venta
        })
        step3.value.asignarProductos(productos)
    }

    const activarSiguiente = computed(() => {
        if (pasoActivo.value == 1) return step1.value?.validar()
        if (pasoActivo.value == 2) return step2.value?.validar()
        if (pasoActivo.value == 3) return step3.value?.validar()
        if (pasoActivo.value == 4) return step4.value?.validar()
        if (pasoActivo.value == 5) return step5.value?.validar()
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

    const finalizar = () => {
        Util.cargando(1)
        let form2 = crearForm()
        acf.post('/registrar-reclamo', form2)
            .then(({ data }) => {
                registrado()
            }).catch((err) => {
                noRegistrado(err?.response?.data?.message)
            })
            .finally(() => Util.cargando(-1))
    }

    const crearForm = () => {
        let datos1 = step1.value.obtenerDatos()
        let datos2 = step2.value.obtenerDatos()
        let datos3 = step3.value.obtenerDatos()
        let datos4 = step4.value.obtenerDatos()
        let datos5 = step5.value.obtenerDatos()

        let formData = new FormData()
        Object.entries(datos1).forEach(([key, value]) => {
            formData.append('form_1_' + key, value)
        })
        Object.entries(datos2).forEach(([key, value]) => {
            formData.append('form_2_' + key, value)
        })
        formData.append('form_3_producto_id', datos3.producto?.codigo)
        formData.append('form_3_cantidad', datos3.producto?.cantidad)
        formData.append('form_3_en_tienda', datos3.en_tienda)
        Object.entries(datos4).forEach(([key, value]) => {
            formData.append('form_4_' + key, value)
        })
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
            icon: 'error',
            title: 'No se ha registrado',
            text: (mensaje != null) ? mensaje : 'Ha ocurrido algo inesperado.',
            confirmButtonText: 'Intentar de nuevo'
        }).then(() => { })
    }

    const registrado = () => {
        if (store.getters.getUsuario.tipo_usuarios_id == 1) {
            Swal.fire({
                icon: 'success',
                title: 'Reclamo generado',
                text: 'Para continuar con el proceso de reclamo e iniciar con la evaluación tiene un plazo de 24 horas para enviar el producto a la siguiente dirección:' +
                    ' \n Av. Nicolás Arriola 1723 - La Victoria',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                resetear()
            })    
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Reclamo generado',
                text: '',
                confirmButtonColor: '#002360',
                cancelButtonColor: '#002360',
                showCancelButton: true,
                cancelButtonText: 'Siguiente',
                confirmButtonText: 'Nuevo'
                }).then((result) => {
                    if (result.isConfirmed) {
                        resetear()
                    } else {
                        emit('irSeguimiento')
                    }
                })
        } 
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
        step1.value.limpiar()
        step2.value.limpiar()
        step3.value.limpiar()
        step4.value.limpiar()
        step5.value.limpiar()
    }

    const confirmar = () => {
        Swal.fire({
            title: '¿Estás seguro de registrar el reclamo?',
            text: "Una vez registrado no podrá modificar la información",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                finalizar()
            }
        })
    }

    const setPasoActivo = (nuevoPaso) => {
        pasoActivo.value = nuevoPaso
    }

    defineExpose({ resetear })

</script>
<style scoped>
.step {
    width: 20%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.step a {
    width: 100%;
}

.nav-link.active {
    border-radius: .8rem;
    background: var(--bs-theme-1);
}

.nav-link.enable {
    cursor: pointer;
}

.nav-link.disabled {
    cursor: not-allowed;
}

.form-check-input {
    width: 1.5em;
    height: 1.5em;
}

.form-check {
    display: flex;
    align-content: center;
    align-items: center;
    gap: .5rem;
}
</style>