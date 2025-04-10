import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import storeOption from './options'

const store = createStore ({
    plugins: [ createPersistedState({}) ],
    state: {
        usuario: {
            data: {},
            token: sessionStorage.getItem('TOKEN')
        },
    },
    getters: {
        getToken(state) {
            return state.usuario.token
        },
        getUsuario(state) {
            return state.usuario.data
        },
        getAP(state) {
            let separedAP = state.usuario.data.accesos
            if(separedAP) {
                return [
                    Util.indexToOne(separedAP.split('-')[1].split('')), // Menu
                    Util.indexToOne(separedAP.split('-')[2].split('')), // SubMenu
                    Util.indexToOne((state.usuario.data.permisos) ? state.usuario.data.permisos.split('') : []) // Permisos
                ]
            } else {
                return [0,0,0,0]
            }            
        },
    },
    actions: {
        register({ commit }, user) {
            return new Promise((resolve, reject) => {
                ac.post('/auth/register', user)
                    .then(({data}) => {
                        resolve(data)
                    }).catch((err) => {
                        reject(err.response)
                    })
            })
        },
        login({ commit }, usuario) {
            return new Promise((resolve, reject) => {
                ac.post('/auth/iniciar-sesion', usuario)
                    .then(({ data }) => {
                        commit('setUser', data)
                        resolve(data)
                    }).catch((err) => {
                        reject(err.response)
                    })
            })
        },
        logout({ commit }) {
            return new Promise((resolve, reject) => {
                ac.get('/auth/cerrar-sesion')
                    .then(() => {
                        storeOption.dispatch('limpiar')
                        commit('logout')
                        resolve()
                    }).catch((err) => {
                        reject(err.response)
                    })
            })
        },
    },
    mutations: {
        setUser: (state, datos) => {
            if (datos) {
                state.usuario.token = datos.data.token
                state.usuario.data = datos.data.usuario
                sessionStorage.setItem('TOKEN', datos.data.token)
            }
        },  
        logout: (state) => {
            state.usuario.data = {}
            state.usuario.token = null
            sessionStorage.clear()
            localStorage.clear()
            window.location.reload()
        },
    },
    modules: {

    }
})

export default store