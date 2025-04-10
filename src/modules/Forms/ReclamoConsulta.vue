<template>
    <div class="container">
        <div class="row justify-content-center">
            <div :class="(seleccionado == '') ? 'col-lg-10':'col-lg-6'">
                <div class="card">
                    <div class="card-header bg-white text-center">
                        <h5>Lista de Reclamos/Quejas</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-6">
                                <input type="text" v-model.trim="filtros.buscar" class="form-control"
                                    placeholder="Buscar reclamo/queja">
                            </div>
                            <div class="col-lg-2">
                                <button @click="obtenerDatos(1)" class="btn btn-primary">Buscar</button>
                            </div>
                        </div>
                        <div class="row mt-4">
                            <div class="table-responsive"  style="max-height: 30em;overflow: auto;">
                                <div v-for="(d,i) in lista" :key="i" class="card shadow-none border my-2 btn btn-light p-0"
                                    @click="seleccionado = d" :class="(seleccionado == d) ? 'bg-primary text-white':''">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <div class="d-flex justify-content-between flex-wrap">
                                                    <div>{{ d.id }}</div>
                                                    <div>{{ d.tipo }}</div>
                                                    <div>{{ d.fecha }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <nav class="flex-center">
                                        <ul class="pagination mx-auto">
                                            <li class="page-item" :class="{ disabled: !paginacion.has_prev }">
                                                <a class="page-link" @click="cambiarPagina(paginacion.page - 1)" aria-label="Previous">
                                                    <span aria-hidden="true">&laquo;</span>
                                                </a>
                                            </li>
                                            <li v-for="p in paginacion.total_pages" :key="p" class="page-item cursor-pointer" :class="{ active: p === paginacion.page }">
                                                <a class="page-link" @click="cambiarPagina(p)">{{ p }}</a>
                                            </li>
                                            <li class="page-item" :class="{ disabled: !paginacion.has_next }">
                                                <a class="page-link" @click="cambiarPagina(paginacion.page + 1)" aria-label="Next">
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
            <div v-if="seleccionado !== ''" class="col-lg-6">
                <div class="card">
                    <div class="card-header bg-white text-center">
                        <h5>Trazabilidad</h5>
                    </div>
                    <div class="card-body">
                        <div class="timeline" style="max-height: 40em;overflow: auto;">
                            <div v-for="(dd, i) in seleccionado.trazabilidad" :key="i" class="timeline-item">
                                <div class="timeline-badge"></div>
                                <div class="card timeline-card border shadow-none">
                                    <div class="card-body">
                                        <div>
                                            <div class="d-flex justify-content-between">
                                                <h6 class="card-title">{{ dd.estado }}</h6>
                                                <small class="text-muted">{{ dd.fecha }}</small>
                                            </div>
                                            <div><small class="card-text">{{ dd.titulo }}</small></div>
                                        </div>
                                        <div v-if="dd.archivo != ''" title="Clic aquí para descargar el archivo">
                                            <a :href="dd.archivo.enlace" download>
                                                <i class="icon far fa-file-pdf"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref } from 'vue'

    let filtros = ref({
        buscar: ''
    })
    let lista = ref([])
    let paginacion = ref({
        page : 1,
        items_per_page : 10,
        total_pages : 1,
        has_next : false,
        has_prev : false
    })
    let seleccionado = ref('')

    
    const obtenerDatos = (pagina = 1) => {
        seleccionado.value = ''    
        Util.cargando(1)    
        ac.get('/consultar-reclamo-queja', {
            params: {
                page: pagina,
                buscar: filtros.value.buscar
            }})
            .then(({ data }) => {
                lista.value = data.data
                paginacion.value.page = data.pagination.page
                paginacion.value.items_per_page = data.pagination.items_per_page
                paginacion.value.total_pages = data.pagination.total_pages
                paginacion.value.has_next = data.pagination.has_next
                paginacion.value.has_prev = data.pagination.has_prev
                if (pagina == 1) Toast.fire({ icon: 'success', title : 'Sus consultas han sido cargadas.' })                
            }).catch((err) => {
                Toast.fire({ icon: 'error', title: 'Oops ha ocurrido algo inesperado.' })
            }).finally(() => Util.cargando(-1))
    }

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= paginacion.value.total_pages) {
            obtenerDatos(nuevaPagina)
        }
    }

    defineExpose({ obtenerDatos })

</script>
<style scoped>
 .timeline {
            position: relative;
            padding: 20px 0;
        }
        .timeline::before {
            content: "";
            position: absolute;
            top: 0;
            left: 50%;
            width: 1px;
            height: 100%;
            background: var(--bs-theme-1);
            transform: translateX(-50%);
        }
        .timeline-item {
            position: relative;
            width: 50%;
            padding: 10px 20px;
        }
        .timeline-item:nth-child(odd) {
            /* left: 0; */
            /* text-align: right; */
        }
        .timeline-item:nth-child(even) {
            left: 50%;
        }
        .timeline-badge {
            position: absolute;
            top: 15px;
            left: calc(50% - 10px);
            background: #007bff;
            width: 20px;
            height: 20px;
            border-radius: 50%;
        }
        .timeline-card {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border: none;
        }

        .timeline-card .icon {
            font-size: 45px;
            color: var(--bs-theme-1);
        }
</style>