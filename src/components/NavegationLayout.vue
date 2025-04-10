<template>
    <nav class="navbar navbar-expand-lg bg-theme shadow-sm fixed-top">

        <div class="d-lg-block d-lg-flex container-fluid">
            <button v-if="$route.name == 'AppMenu'" class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebar" 
            aria-controls="offcanvasExample">
                <span class="navbar-toggler-icon" data-bs-target="#sidebar"></span>
            </button>
            <router-link :to="{ name: 'Dashboard' }" class="navbar-brand" title="Click para regresar al menú principal">
                <img :src="$getSrc('/images/logo-2.png')" width="55" class="img-fluid">
            </router-link>
            
            <div class="d-flex align-items-end gap-3">
                <span class="text-white h3 p-0 m-0">Atención de Quejas y Reclamos</span>
                <span class="text-white">Siempre listos para ayudarte</span>
                <span v-if="$storeOption.getters.getUsuario?.tipo_usuarios_id != 1" class="bagde text-primary">{{ $storeOption.getters.getUsuario?.tipo_usuario }}</span>
            </div>            

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topNavBarMobile"
                aria-controls="topNavBarMobile" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-user"><i class="fas fa-user"></i></span>
            </button>
            <div class="collapse navbar-collapse" id="topNavBar">
                <slot name="navleft"></slot>
                <ul class="ms-auto navbar-nav">
                    <Notifications />
                    
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle ms-2 d-flex align-items-center py-0 cursor-pointer" @click="$refs.perfil.mostrar"
                            :title="store.getters.getUsuario.nombre_completo">
                            <div class="icon-username">{{ store.getters.getUsuario.nombre_completo }}</div>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end text-end">
                            <li v-if="store.getters.getUsuario.tipo_usuarios_id == 2">
                                <router-link :to="{ name: 'AppMenu', params: { name: 'configuracion'} }" class="dropdown-item">Panel de Administración</router-link>
                            </li>
                            <li>
                                <router-link class="dropdown-item" :to="{ name: 'ChangePassword' }">Cambiar contraseña</router-link>
                            </li>
                            <li>
                                <a class="dropdown-item cursor-pointer" @click="logout">Cerrar Sesión</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            
            <div class="d-md-none d-lg-none d-xl-none w-100 text-end">
                <div class="collapse navbar-collapse pt-3" id="topNavBarMobile">
                    <ul class="list-group list-group-flush">
                        <li v-if="store.getters.getUsuario.tipo_usuarios_id == 2" class="list-group-item">
                            <router-link :to="{ name: 'AppMenu', params: { name: 'configuracion'} }" class="text-decoration-none text-dark">Panel de Administración</router-link>
                        </li>
                        <li class="list-group-item">
                            <router-link class="text-decoration-none text-dark" :to="{ name: 'ChangePassword' }">Cambiar contraseña</router-link>
                        </li>
                        <li class="list-group-item">
                            <a class="text-decoration-none cursor-pointer text-dark" @click="logout">Cerrar Sesión</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <MenuPerfilComponent ref="perfil" />
</template>

<script setup>
    import MenuPerfilComponent from '@/components/MenuPerfilComponent.vue'
    import Notifications from '@/components/Notifications.vue'
    import { defineComponent } from 'vue'
    import { useRouter } from 'vue-router'
    import store from '@/config/store'

    defineComponent({
        components: {
            // Notifications,
            MenuPerfilComponent,
        }
    })

    const router = useRouter()

    const logout = () => {
        store.dispatch('logout')
            .then(() => {
                router.push({ name: 'Login'})
            }).catch((err) => {                
            })
    }

</script>

<style scoped>
    .icon-username {      
        text-transform: uppercase;  
        min-width: 40px;
        min-height: 35px;
        background: rgb(74, 44, 117);
        border-radius: .5rem;
        padding: 0.5rem .7rem;
        color: white;
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #topNavBar .navbar-nav .nav-item {
        border-radius: 0.5rem;
        padding: 0.05rem;
        margin: 0 .1rem;
    }

    #topNavBar .navbar-nav .nav-item:hover {
        background: #e7e7e7;
        font-weight: 600;
    }
</style>