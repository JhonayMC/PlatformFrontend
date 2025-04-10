import { createRouter, createWebHistory } from "vue-router"
import store from '../store'
import storeOption from '@/config/store/options'
import '@/config/utils'

import DefaultLayout from '@/components/DefaultLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import moment from 'moment'

let day = moment().format('YYYY-MM-DDThh:mm:ss')
let expired_password = moment(store.getters.getUsuario.expira_en).format('YYYY-MM-DDThh:mm:ss')

const routes = [
    {
        path: '/',
        redirect: '/login',
        name: 'Index',
        meta: { isGuest: true, title: 'Inicio de Sesión' },
    },
    {
        path: '/auth',
        redirect: '/login',
        name: 'Auth',
        component: AuthLayout,
        meta: { isGuest: true },
        children: [
            { 
                path: "/login", 
                name: "Login", 
                meta: { 
                    title: 'Inicio de Sesión'
                }, 
                component: () => import('@/views/LoginView.vue')
            },
            {
                path: "/recuperar-contrasena", 
                name: "RecuperarContrasena", 
                meta: { 
                    title: 'Recuperar Contraseña'
                },
                component: () => import('@/views/RecuperarCotrasena.vue')
            },
            {
                path: "/registrar-cliente",
                name: 'RegistrarCliente',
                component: () => import('@/views/RegistrarCliente.vue'),
                meta: {
                    requiresAuth: false,
                    title: 'Registrar Cliente'
                },
            }
        ]
    },
    {
        path: "/reset-password",
        name: 'ResetPassword',
        component: () => import('@/views/ResetPassword.vue'),
        meta: {
            requiresAuth: true,
            title: 'Resetear contraseña'
        },
        beforeEnter: (to, from, next) => {
            if (store.getters.getUsuario.tipo_usuarios_id == 1 || store.getters.getUsuario.estado == 3 || expired_password <= day) {
                if (to.name != 'ResetPassword') {
                    next({ name: 'ResetPassword' })
                }
                next()
            }
        }
    },
    {
        path: "/change-password",
        name: 'ChangePassword',
        component: () => import('@/views/ResetPassword.vue'),
        meta: {
            requiresAuth: true,
            title: 'Cambiar Contraseña'
        },
    },
    {
        path: "/dashboard",
        redirect: "dashboard",
        component: DefaultLayout,
        meta: {
            requiresAuth: true,
            title: 'Menú Principal'
        },
        children: [
            { path: "", name: "Dashboard", component: () => import('@/views/DashboardView.vue'), },
        ],
    },
    {
        path: "/app",
        redirect: "app",
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: ":name/:menu?/:submenu?",
                name: 'AppMenu',
                component: () => import('@/views/AppView.vue'),
                beforeEnter: (to, from, next) => {
                    if (to.params.menu == '' && to.params.submenu == '') {
                        if (store.getters.getAP[0][storeOption.getters.getApp.id] == 0 ||
                            (storeOption.getters.getApp.estado == 2 && store.getters.getUsuario.tipo_usuarios_id != 2)) next({ name: 'Dashboard' })
                    } else if (to.params.submenu == '') {
                        const menu = storeOption.getters.getMenu
                        menu.forEach(e => {
                            if (e.menus) {
                                const foundMenu = e.menus.find(ee => ee.slug == to.params.menu)
                                if (foundMenu) if (store.getters.getAP[1][foundMenu.id] == 0) next({ name: 'Dashboard' })
                            }
                        })
                    } else {
                        const menu = storeOption.getters.getMenu
                        menu.forEach(e => {
                            if (e.menus) {
                                e.menus.forEach(m => {
                                    if (m.sub_menus.length) {
                                        const foundSubMenu = m.sub_menus.find(sm => sm.slug == to.params.submenu)
                                        if (foundSubMenu) if (store.getters.getAP[2][foundSubMenu.id] == 0) next({ name: 'Dashboard' })
                                    }
                                })
                            }
                        })
                    }
                    next()
                }
            },
        ],
    },
    // {
    //     path: "/report",
    //     redirect: "report",
    //     meta: {
    //         requiresAuth: true
    //     },
    //     children: [
    //         {
    //             path: ":name",
    //             name: 'AppReport',
    //             component: () => import('@/views/ReportView.vue'),
    //             beforeEnter: (to, from, next) => {
    //                 if (store.getters.getAP[0][storeOption.getters.getApp.id] == 0 ||
    //                     (storeOption.getters.getApp.estado == 2 && store.getters.getUsuario.tipo_usuarios_id != 2)) next({ name: 'Dashboard' })
    //                 next()
    //             }
    //         },
    //     ],
    // },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/errors/404View.vue')
    },
    {
        path: '/:catchAll(.*)',
        name: '404',
        component: () => import('@/views/errors/404View.vue')
    },

];


const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.state.usuario.token) {
        next({ name: 'Login' })
    } else if (store.state.usuario.token && (to.meta.isGuest) && (store.state.usuario.data.estado != 3)) {
        next({ name: 'Dashboard' })
    } else if(store.state.usuario.data.estado == 3) {
        if (to.name != 'ResetPassword') {
            next({ name: 'ResetPassword' })
        } else {
            next()
        }
    } else {
        next()
    }
    Util.startTooltip()

    document.title = 'Sistema | ' + (to.meta.title ?? '')
})


export default router