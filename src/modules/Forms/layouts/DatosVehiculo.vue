<template>
    <div class="row justify-content-between mt-2">
        <div class="col-lg-4">
            <label>N° Placa</label>
            <div class="d-flex gap-5">
                <input v-model="form.nroplaca" type="text"
                    :class="(errores.nroplaca) ? 'is-invalid form-control' : 'form-control'">
                <button :disabled="form.nroplaca == ''" @click="buscar" class="btn btn-primary">Buscar</button>
            </div>
        </div>
        <div class="col-lg-2"></div>
        <div class="col-lg-6">
            <div class="row">
                <div class="col-lg-5">
                    <label>Marca</label>
                    <input v-model.trim="form.marca" type="text"  
                        :class="(errores.marca) ? 'is-invalid form-control' : 'form-control'" :disabled="!noEncontrado">
                    <small v-if="errores.marca" class="text-danger">{{ errores.marca[0] }}</small>
                </div>
                <div class="col-lg-6">
                    <label>Modelo del Vehículo</label>
                    <input v-model.trim="form.modelo" type="text"  
                        :class="(errores.modelo) ? 'is-invalid form-control' : 'form-control'" :disabled="!noEncontrado">
                    <small v-if="errores.modelo" class="text-danger">{{ errores.modelo[0] }}</small>
                </div>
                <div class="col-lg-4">
                    <label>Año</label>
                    <input v-model.trim="form.anio" type="text" 
                        :class="(errores.anio) ? 'is-invalid form-control' : 'form-control'" :disabled="!noEncontrado">
                    <small v-if="errores.anio" class="text-danger">{{ errores.anio[0] }}</small>
                </div>
                <div class="col-lg-1"></div>
                <div class="col-lg-6">
                    <label>Modelo del Motor</label>
                    <input v-model.trim="form.motor" type="text" 
                        :class="(errores.motor) ? 'is-invalid form-control' : 'form-control'" :disabled="!noEncontrado">
                    <small v-if="errores.motor" class="text-danger">{{ errores.motor[0] }}</small>
                </div>
            </div>
        </div>
    </div>
    <MultipleRadioButton :titulo="'Tipo de Operación:'" :opciones="$storeOption.getters.getTipoOperaciones" v-model="form.tipoOperacion" />
    <div>
        <div>
            <p>Instalación:</p>
        </div>
        <div class="row">
            <div class="col-lg-3">
                <label>Fecha de Instalación del Producto</label>
                <input v-model.trim="form.fechaInstalacion" type="date"  
                    :class="(errores.fechaInstalacion) ? 'is-invalid form-control' : 'form-control'">
                <small v-if="errores.fechaInstalacion" class="text-danger">{{ errores.fechaInstalacion[0] }}</small>
            </div>
            <div class="col-lg-4">
                <label>Hora de uso del producto en reclamo <small class="text-muted">(En horas)</small></label>
                <input v-model.trim="form.horaUso" type="text"  
                    :class="(errores.horaUso) ? 'is-invalid form-control' : 'form-control'">
                <small v-if="errores.horaUso" class="text-danger">{{ errores.horaUso[0] }}</small>
            </div>
            <div class="clearfix"></div>
            <div class="col-lg-4">
                <label>Kilometraje en la instalación <small class="text-muted">(km)</small></label>
                <input v-model.trim="form.kmInstalacion" type="text"  
                    :class="(errores.kmInstalacion) ? 'is-invalid form-control' : 'form-control'">
                <small v-if="errores.kmInstalacion" class="text-danger">{{ errores.kmInstalacion[0] }}</small>
            </div>
            <div class="col-lg-2">
                <label>Kilometraje actual <small class="text-muted">(km)</small></label>
                <input v-model.trim="form.kmActual" type="text"  
                    :class="(errores.kmActual) ? 'is-invalid form-control' : 'form-control'">
                <small v-if="errores.kmActual" class="text-danger">{{ errores.kmActual[0] }}</small>
            </div>
            <div class="col-lg-2">
                <label>Kilometros Recorridos <small class="text-muted">(km)</small></label>
                <input type="text" :value="kmRecorridos" class="form-control" readonly>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref, computed, defineComponent, watch } from 'vue'
    import MultipleRadioButton from '@/components/utilitarios/MultipleRadioButton.vue'
    import Formato from "@/config/formato.js"

    defineComponent({
        MultipleRadioButton
    })

    let form = ref({        
        nroplaca: '',
        marca: '',
        modelo: '',
        anio: '',
        motor: '',
        tipoOperacion: '',
        fechaInstalacion: '',
        horaUso: '',
        kmInstalacion: '',
        kmActual: ''
    })
    let noEncontrado = ref(false)
    let errores = ref([])

    const buscar = () => {
        Util.cargando(1)
        ac.get(`/buscar-placa/${form.value.nroplaca}`)
            .then(({ data }) => {
            noEncontrado.value = false
            form.value.marca = data?.data?.marca
            form.value.modelo = data?.data?.modelo
            form.value.anio = data?.data?.anio
            form.value.motor = data?.data?.motor
            errores.value = []
            Swal.fire({ icon: 'success', title: 'Placa Encontrada', text: 'Datos cargados correctamente' })            
        }).catch((err) => {
            noEncontrado.value = true
            errores.value = (err.response.status == 422) ? err.response.data.errores : []
            Swal.fire({ icon: 'error', title: 'Error al buscar la placa', text: err.response.data.message })
        }).finally(() => Util.cargando(-1))
    }

    const kmRecorridos = computed(() => {
        let kmActual = parseFloat(form.value.kmActual) || 0
        let kmInstalacion = parseFloat(form.value.kmInstalacion) || 0
        let recorrido = kmActual - kmInstalacion
        return recorrido < 0 ? 0 : recorrido.toFixed(2)
    });

    const completado = computed(() => {
        return form.nroplaca != ''
            && form.marca != ''
            && form.modelo != ''
            && form.anio != ''
            && form.motor != ''
            && form.tipoOperacion != ''
            && form.fechaInstalacion != ''
            && form.horaUso != ''
            && form.kmInstalacion != ''
            && form.kmActual != ''
    })

    const limpiar = () => {
        form.value.nroplaca = ''
        form.value.marca = ''
        form.value.modelo = ''
        form.value.anio = ''
        form.value.motor = ''
        form.value.tipoOperacion = ''
        form.value.fechaInstalacion = ''
        form.value.horaUso = ''
        form.value.kmInstalacion = ''
        form.value.kmActual = ''
        noEncontrado.value = false    
    }

    const validar = () => {
        return form.value.nroplaca != ''
            && form.value.marca != ''
            && form.value.modelo != ''
            && form.value.anio != ''
            && form.value.motor != ''
            && form.value.tipoOperacion != ''
            && form.value.fechaInstalacion != ''
            && form.value.horaUso != ''
            && form.value.kmInstalacion != ''
            && form.value.kmActual != ''    
    }

    watch(form.value, (n) => {
        form.value.kmInstalacion = Formato('decimales', n.kmInstalacion).toString().substring(0, 10)
        form.value.kmActual = Formato('decimales', n.kmActual).toString().substring(0, 10)
        form.value.horaUso = Formato('digitos', n.horaUso).toString().substring(0, 10)
    }, { deep: true })

    const obtenerDatos = () => form.value

    defineExpose({ validar, obtenerDatos, limpiar })
</script>
<style scoped>
    
</style>