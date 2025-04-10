import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const storeNotify = createStore ({
    plugins: [ createPersistedState({ storage: sessionStorage }) ],
    state: {
        notifications: [],
    },
    getters: {
        getNotifications(state) {
            return state.notifications
        },
    },
    actions: {
        getNotifications({ commit }, data) {
            return new Promise((resolve, reject) => {
                ac.get('/usuario-notificaciones', { params: { usuario_id: data.id, top: data.top } })
                    .then(({data}) => {
                        commit('setNotifications', data.data)
                        resolve()
                    }).catch((err) => {
                        reject(err.response)
                    })
            })
        },
        readNotification({ commit }, read) {
            return new Promise((resolve, reject) => {
                ac.post('/leido-notificacion', read)
                    .then(({data}) => {                        
                        commit('readNotification', read)
                        resolve()
                    }).catch((err) => {                        
                        reject(err.response)
                    })
            })
        },
        addNotification({commit}, notify) {
            commit('addNotification', notify)
        },
    },
    mutations: {
        setNotifications: (state, data) => {
            state.notifications = data
        },
        readNotification: (state, data) => {
            let find = state.notifications.find(e => e.id == data.id )
            if(find) find.leido_en = moment().format('YYYY-MM-DD hh:mm:ss')
        },
        addNotification: (state, data) => {
            let find = state.notifications.find(e => e.id == data.id )
            if (!find) state.notifications.unshift(data)
        }
    },
    modules: {

    }
})

export default storeNotify