<template>
    <div>
        <div>
            <p>{{ titulo }}</p>
        </div>
        <div class="d-flex px-lg-5 flex-wrap justify-content-between gap-4">
            <div v-for="(opcion, i) in opciones" :key="i" class=" my-2">
                <div class="form-check d-flex align-items-center">
                    <input 
                        class="form-check-input me-2" 
                        type="radio" 
                        name="opciones" 
                        :id="`opcion-${opcion.id}`" 
                        :value="opcion.id"
                        v-model="seleccionado"
                    >
                    <label class="form-check-label" :for="`opcion-${opcion.id}`">
                        {{ opcion.nombre }}
                    </label>
                </div>
            </div>

            <div class="col my-2">
                <div class="form-check d-flex align-items-center">
                    <input class="form-check-input me-2" type="radio" name="opciones" 
                        id="opcion-otro" value="otro" v-model="seleccionado">
                    <label class="form-check-label" for="opcion-otro">
                        Otro
                    </label>
                </div>
            </div>
        </div>
        <div class="col-6 px-lg-5">
            <input v-if="seleccionado === 'otro'" type="text" class="form-control mt-2" placeholder="Ingrese motivo"
                v-model.trim="motivoOtro" @input="actualizarValor">
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Formato from "@/config/formato.js"

const props = defineProps({
    titulo: String,
    opciones: Array,
    modelValue: [String, Number]
})

const emit = defineEmits(['update:modelValue'])

const seleccionado = ref(props.modelValue)
const motivoOtro = ref('')

watch(seleccionado, (nuevoValor) => {
    if (nuevoValor !== 'otro') {
        emit('update:modelValue', nuevoValor)
        motivoOtro.value = ''
    }
})

watch(() => props.modelValue, (nuevoValor) => {
    if (nuevoValor === '') {
        seleccionado.value = ''
        motivoOtro.value = '' 
    } else {
        seleccionado.value = nuevoValor
    }
})

const actualizarValor = () => {
    motivoOtro.value = Formato('nombre', motivoOtro.value).toString().substr(0, 30)
    emit('update:modelValue', motivoOtro.value)
}
</script>

<style scoped>

.form-check-input {
    width: 1.5em;
    height: 1.5em;
}
</style>
