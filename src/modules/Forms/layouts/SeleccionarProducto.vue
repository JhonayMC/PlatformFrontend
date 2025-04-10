<template>
    <div class="row">
        <div class="col-lg-12 d-flex justify-content-between">
            <div>
                <h6>Especificar Producto en Reclamo:</h6>
            </div>
            <div v-if="store.getters.getUsuario.tipo_usuarios_id != 1" class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="swtichPT" @click="form.en_tienda = !form.en_tienda" :checked="form.en_tienda">
                <label class="form-check-label" for="swtichPT">Productos en Tienda</label>
            </div>
        </div>
        <div class="table-responsive" style="max-height: 400px;">
            <table :id="tblid" class="table table-hovered align-middle">
                <thead>
                    <tr class="text-center">
                        <th>Item</th>
                        <th>Lin</th>
                        <th>Org</th>
                        <th>Marca</th>
                        <th>Descp. Marc</th>
                        <th>Fábrica</th>
                        <th>Artículo</th>
                        <th>Descripción</th>
                        <th v-if="store.getters.getUsuario.tipo_usuarios_id != 1">Precio</th>
                        <th class="text-center">Cantidad</th>
                        <th>Und. Reclamo</th>
                        <th>Seleccionar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(d, i) in lista" :key="i" :class="form.producto && form.producto.codigo == d.codigo ? 'bg-primary text-white':''">
                        <td class="text-center">{{ i + 1 }}</td>
                        <td>{{ d.linea }}</td>
                        <td>{{ d.organizacion }}</td>
                        <td>{{ d.marca }}</td>
                        <td>{{ d.marca_desc }}</td>
                        <td>{{ d.fabrica }}</td>
                        <td>{{ d.articulo }}</td>
                        <td>{{ d.nombre }}</td>
                        <td v-if="store.getters.getUsuario.tipo_usuarios_id != 1">{{ d.precio_venta }}</td>
                        <td class="text-center">{{ d.cantidad }}</td>
                        <td>
                            <input :id="`cant-${i}`" type="text" class="form-control mx-auto text-center" style="width: 75px;" placeholder="0" :disabled="form.producto">
                        </td>
                        <td class="text-center">
                            <button v-if="!form.producto" @click="seleccionar(d, i)" class="btn btn-primary btn-sm">Seleccionar</button>
                            <button v-if="form.producto && form.producto.codigo == d.codigo" @click="deseleccionar" class="btn btn-danger btn-sm">Quitar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup>
    import { ref, computed } from 'vue'
    import store from '@/config/store'

    let tblid = Util.uuid()
    let form = ref({
        producto: null,
        cantidad: 0,
        en_tienda: false,
    })
    let lista = ref([])
    let errores = ref([])

    const seleccionar = (producto, pos) => {
        let cnt = document.getElementById(`cant-${pos}`).value
        if (producto.cantidad >= cnt && cnt >= 1) {
            form.value.producto = producto
            form.value.cantidad = cnt
        } else {
            Toast.fire({ icon: 'error', title: 'La cantidad debe ser menor o igual a lo comprado.' })
        }
    }

    const deseleccionar = () => {
        form.value.producto = null
        form.value.cantidad = 0
    }

    const asignarProductos = (productos) => {
        lista.value = productos
    }
    
    const limpiar = () => {
        form.value.producto = null
        lista.value = []
        errores.value = []
    }

    const completado = computed(() => {
        return form.value.producto != null && form.value.cantidad > 0
    })
    
    const validar = () => completado.value
    const obtenerDatos = () => form.value

    defineExpose({ validar, obtenerDatos, limpiar, asignarProductos })
    
</script>
<style scoped>
    
</style>