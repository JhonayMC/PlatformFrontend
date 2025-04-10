<template>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="menu-perfil" aria-labelledby="offcanvasRightLabel">        
        <div class="offcanvas-header ps-2">            
            <div>
                <h5 id="offcanvasRightLabel">Hola, <br> {{ store.getters.getUsuario.nombre_completo }}.</h5>
                <span @click="menu(4)" class="badge bg-primary me-2 cursor-pointer">VER DATOS</span>
                <span class="badge bg-light2 text-muted">{{ store.getters.getUsuario.tipo?.nombre }}</span>
            </div>            
            <button class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" title="Cerrar"></button>
        </div>
        <div class="offcanvas-body">
            <ul class="list-group list-group-flush">
                <!-- <li class="list-group-item p-0" v-if="store.getters.getUsuario.tipo_usuarios_id == 2">
                    <router-link @click="menu(9)" :to="{ name: 'AppMenu', params: { name: 'configuracion'} }" 
                        class="dropdown-item p-2 fw-bold">
                        <i class="fal fa-external-link me-2 fw-bold"></i> Ir a Panel de Administración
                    </router-link>
                </li> -->
                <li class="list-group-item p-0">
                    <router-link class="dropdown-item p-2" :to="{ name: 'ChangePassword' }">
                        <i class="fal fa-lock me-2"></i> Cambiar Contraseña
                    </router-link>
                </li>
                <!-- <li class="list-group-item p-0">
                    <a class="dropdown-item p-2 cursor-pointer"  @click="menu(2)">
                        <i class="fal fa-folder me-2"></i> Mis Requerimientos
                    </a>
                </li> -->
                <!-- <li class="list-group-item p-0">
                    <a class="dropdown-item p-2 cursor-pointer">
                        <i class="fal fa-folder me-2"></i> Mis Incidencias
                    </a>
                </li> -->
                <!-- <li class="list-group-item p-0">
                    <a class="dropdown-item p-2 cursor-pointer">
                        <i class="fal fa-file-pdf me-2"></i> Manuales
                    </a>
                </li> -->
                <li class="list-group-item p-0">
                    <a class="dropdown-item p-2 cursor-pointer">
                        <i class="fal fa-circle-info me-2"></i> Acerca del sistema
                    </a>
                </li>
                <li class="list-group-item p-0">
                    <a class="dropdown-item p-2 cursor-pointer">
                        <i class="fal fa-comment me-2"></i> Enviar Comentarios
                    </a>
                </li>
                <li class="list-group-item p-0">
                    <a class="dropdown-item p-2 cursor-pointer fw-bold" @click="logout">
                        <i class="far fa-power-off me-2 fw-bold"></i> Cerrar Sesión
                    </a>
                </li>
            </ul>

            <div class="card my-3 border cursor-pointer" @click="menu(3)">
                <div class="card-body">
                    <h5><i class="far fa-robot"></i> Guía Inteligente <span>(AI)</span>.</h5>
                    <small>Conoce el módulo actual con la inteligencia articial.</small>
                </div>
            </div>
        </div>
    </div>

    <PerfilComponent ref="perfil" />

</template>
<script setup>
    import { ref, defineComponent } from 'vue'
    import { useRouter } from 'vue-router'
    import PerfilComponent from '@/components/PerfilComponent.vue'
    import store from '@/config/store'

    const ls = ref(null)
    const req = ref(null)
    const guide = ref(null)
    const perfil = ref(null)

    const router = useRouter()

    const mostrar = () => {
        $("#menu-perfil").offcanvas("toggle")
    }

    const menu = (opcion) => {
        $("#menu-perfil").offcanvas("toggle")        
        switch (opcion) {
            case 1:
                break; 
            case 2:
                break;        
            case 3:
                break;
            case 4:
                perfil.value.show()
                break;
            default:
                break;
        }
    }    

    const logout = () => {
        store.dispatch('logout')
            .then(() => {
                router.push({ name: 'Login'})
            }).catch((err) => {                
            })
    }

    defineExpose({ mostrar })

</script>
<style scpoped>
    .container-notification {
        max-width: 100px;
    }
    .container-notification .notification {
        cursor: pointer;
    }
    .container-notification .notification.no-read {
        background: #e7e7e7;
    }
    .container-notification .notification .icon {
        background: #e7e7e7;
        line-height: 30px;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 50%;
    }
    .container-notification .notification .message {
        font-size: 12.5px;
        white-space: normal;
        width: 100%;
    }
    .container-notification .notification .date {
        float: right;
        font-size: 10.5px;
    }
    .active-notify {
        animation: wiggleNotify 1.5s linear infinite;
    }

    @keyframes wiggleNotify {
        0%, 7% {
            transform: rotateZ(0);
        }
        15% {
            transform: rotateZ(-15deg);
        }
        20% {
            transform: rotateZ(10deg);
        }
        25% {
            transform: rotateZ(-10deg);
        }
        30% {
            transform: rotateZ(6deg);
        }
        35% {
            transform: rotateZ(-4deg);
        }
        40%, 100% {
            transform: rotateZ(0);
        }
    }
</style>