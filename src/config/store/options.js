import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import store from '@/config/store'

const storeOption = createStore ({
    plugins: [ createPersistedState({ storage: sessionStorage }) ],
    state: {
        reports: [],
        apps: [],
        app: '',
        menu: [],
        clasificacion_menu: [],
        histories: [[], []],
        cargando: 0,

        tipoCorrelativos: [],
        tipoOperaciones: [],
        motivosProductos: [],
        motivosServicios: [],
        estados: [],
        origenes: [],
    },
    getters: {
        getTipoCorrelativos: state => state.tipoCorrelativos,
        getTipoOperaciones: state => state.tipoOperaciones,
        getMotivosProductos: state => state.motivosProductos,
        getMotivosServicios: state => state.motivosServicios,
        getEstados: state => state.estados,
        getDashboard: state => {
            const opciones = [
                { id: 1, titulo: 'Registrar Reclamo', subtitulo: 'Falla De Producto', icono: ['/icons/product-d.gif', '/icons/product-l.gif'], tipo_usuarios_id: [2, 1, 3] },
                { id: 2, titulo: 'Registrar Reclamo/Queja', subtitulo: 'Otro Motivo', icono: ['/icons/question-d.gif', '/icons/question-l.gif'], tipo_usuarios_id: [2,1, 3] },
                { id: 3, titulo: 'Consultar', subtitulo: 'Reclamo o Queja', icono: ['/icons/search-d.gif', '/icons/search-l.gif'], tipo_usuarios_id: [2,1] },
                { id: 4, titulo: 'Seguimiento', subtitulo: '', icono: ['/icons/trace-d.gif', '/icons/trace-l.gif'], tipo_usuarios_id: [2,3, 4] },
                { id: 5, titulo: 'Dashboard', subtitulo: '', icono: ['/icons/dash-d.gif', '/icons/dash-l.gif'], tipo_usuarios_id: [2,3, 4] },
                { id: 6, titulo: 'Reportes', subtitulo: '', icono: ['/icons/report-d.gif', '/icons/report-l.gif'], tipo_usuarios_id: [2,3, 4] },
                { id: 7, titulo: 'Mantenimiento', subtitulo: '', icono: ['/icons/service-d.gif', '/icons/service-l.gif'], tipo_usuarios_id: [2,3, 4] },
                { id: 8, titulo: 'Asistente Técnica', subtitulo: '', icono: ['/icons/report-d.gif', '/icons/report-l.gif'], tipo_usuarios_id: [2,4] }
            ]
            const tipoUsuario = store.getters.getUsuario.tipo_usuarios_id
            return opciones.filter(opcion => opcion.tipo_usuarios_id.includes(tipoUsuario))
        },

        getEstados: state => state.estados,
        getOrigenes: state => state.origenes,

        getReports: state => state.reports,
        getApps: state => state.apps,
        getMenu: state => state.menu,
        getApp: state => state.app,
        getCargando: state => state.cargando,
        getFilterLimit() {
            return [
                { label: '100', value: 100 }, 
                { label: '300', value: 300 }, 
                { label: '500', value: 500 }, 
                { label: '1000', value: 1000 }, 
                { label: '2500', value: 2500 }, 
                { label: '5000', value: 5000 }, 
                { label: '10000', value: 10000 },
                { label: '25000', value: 25000 },
                { label: '50000', value: 50000 }, 
                { label: 'Sin límite', value: 1000000 }
            ]
        },
        getHistory: (state) => (name) => {
            let fname = state.histories[0].findIndex(e => e == name)
            if (fname < 0) {
                return []
            } else {
                return state.histories[1][fname]
            }
        }     
    },
    actions: {
        getTipoCorrelativos({ commit }) {
            return new Promise((resolve, reject) => {
                ac.get('/tipo-correlativos')
                    .then(({data}) => {
                        commit('setTipoCorrelativos', data)
                        resolve()
                    }).catch((err) => {
                        reject(err.response)
                    })
            })
        },
        getTipoOperaciones({ commit }) {
            return new Promise((resolve, reject) => {
                ac.get('/tipo-operaciones')
                    .then(({data}) => {
                        commit('setTipoOperaciones', data)
                        resolve()
                    }).catch((err) => {
                        reject(err.response)
                    })
            })
        },
        getMotivosProductos({ commit }) {
            return new Promise((resolve, reject) => {
                ac.get('/motivos', { params: { tipo: 'producto' }})
                    .then(({ data }) => {
                        commit('setMotivosProductos', data)
                        resolve()
                    }).catch((err) => {
                        reject(err.response)
                    })
            })
        },
        getMotivosServicios({ commit }) {
            return new Promise((resolve, reject) => {
                ac.get('/motivos', { params: { tipo: 'servicio' }})
                    .then(({data}) => {
                        commit('setMotivosServicios', data)
                        resolve()
                    }).catch((err) => {
                        reject(err.response)
                    })
            })
        },
        getEstados({ commit }) {
            return new Promise((resolve, reject) => {
                ac.get('/estados')
                    .then(({data}) => {
                        commit('setEstados', data)
                        resolve()
                    }).catch((err) => {
                        reject(err.response)
                    })
            })
        },
        getOrigenes({ commit }) {
            return new Promise((resolve, reject) => {
                ac.get('/origenes')
                    .then(({data}) => {
                        commit('setOrigenes', data)
                        resolve()
                    }).catch((err) => {
                        reject(err.response)
                    })
            })
        },


        getDashborad({ commit }) {
            return new Promise((resolve, reject) => {
                ac.get('/dashboard')
                    .then(({data}) => {
                        commit('setSeparedApps', data)
                        resolve()
                    }).catch((err) => {
                        reject(err.response)
                    })
            })
        },
        getMenu({ commit }, appName) {
            return new Promise((resolve, reject) => {
                commit('setMenuApp', appName)
                resolve()
            })
        },
        limpiarApp({ commit }) {
            return new Promise((resolve, reject) => {
                commit('limpiarApp')
                resolve()
            })
        },
        cargando({ commit }, count) {
            commit('setCargando', count)
        },
        limpiarCarga({ commit }) {
            commit('limpiarCarga')
        },
        limpiar({ commit }) {
            commit('limpiar')
        },
    },
    mutations: {
        setTipoCorrelativos: (state, data) => state.tipoCorrelativos = data,
        setTipoOperaciones: (state, data) => state.tipoOperaciones = data,
        setMotivosProductos: (state, data) => state.motivosProductos = data,
        setMotivosServicios: (state, data) => state.motivosServicios = data,
        setEstados: (state, data) => state.estados = data,
        setOrigenes: (state, data) => state.origenes = data,


        setSeparedApps: (state, data) => {
            state.reports = data.apps.filter((a) => a.tipo == 2)
            state.apps = data.apps.filter((a) => a.tipo == 1)
            state.menu = []
            state.menu = data.clasificacion_menu
            state.clasificacion_menu = data.clasificacion_menu
        },
        setMenuApp: (state, appName) => {
            let app = state.apps.find(e => e.slug == appName)
            let report = state.reports.find(e => e.slug == appName)
            if (app) {
                state.app = app
                state.menu = state.clasificacion_menu
                state.menu.forEach(m => {                    
                    m.menus = app.menus.filter((e) => e.menu_id == m.id)
                })
            }  else  if(report) {
                state.app = report
                state.menu = state.clasificacion_menu
                state.menu.forEach(m => {                    
                    m.menus = report.menus.filter((e) => e.menu_id == m.id)                    
                })
            } else {
                state.app = {}
                state.menu = []
            }
        },
        setHistory: (state, data) => {
            let fname = state.histories[0].findIndex(e => e == data.name)
            if (fname < 0) {
                state.histories[0].push(data.name)
                state.histories[1].push([data.value])
            } else {
                let val = []
                val = state.histories[1][fname]
                val = val.filter(e => e != data.value)
                val.unshift(data.value)
                state.histories[1][fname] = val
            }
        },
        limpiarApp: (state) => {
            state.app = ''
            state.menu = []
            state.menu = state.clasificacion_menu
        },
        setCargando: (state, count) => {
            state.cargando+=count
        },
        limpiar: (state) => {
            state.tipoCorrelativos
            state.tipoOperaciones
            state.motivosProductos
            state.motivosServicios

            state.reports= []
            state.apps= []
            state.app= ''
            state.menu= []
            state.clasificacion_menu= []
            state.histories= [[], []]
            state.cargando= 0           
            sessionStorage.clear()
            localStorage.clear()            
        },
        limpiarCarga: (state) => {
            state.cargando = 0
        }
    },
    modules: {

    }
})

export default storeOption