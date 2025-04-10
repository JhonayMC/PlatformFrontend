<template>
    <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="left" title="Notificaciones">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
            <div>
                <span class="nofity-count" v-if="count > 0">{{ count }}</span>
                <i class="far fa-bell" :class="(count > 0) ? 'active-notify':''"></i>
            </div>
        </a>
        <ul class="dropdown-menu dropdown-menu-end container-notification">
            <li class="d-flex justify-content-between px-3">
                <p class="pb-2"><b>Notificaciones</b></p>
                <a class="cursor-pointer" @click="readMore"><small>Ver más</small></a>
            </li>
            <li v-for="(d,i) in notify.getters.getNotifications" :key="i" :data-notify="d.id">
                <div v-if="!d.leido_en" class="notification no-read" @click="read(d)">
                    <a class="dropdown-item">
                        <div class="row">
                            <div class="col-md-2 d-center" :title="d.tipo">
                                <span class="icon border"> <i :class="`${d.icono} ${(!d.leido_en) ? 'fw-bold':''}`"></i> </span>
                            </div>
                            <div class="col-md-10 content">
                                <span class="message" v-html="d.mensaje"></span><br>
                                <small class="date">{{ $filters.message(d.creado_en) }}</small>
                            </div>
                        </div>
                    </a>
                </div>
                <div v-else class="notification read">
                    <a class="dropdown-item">
                        <div class="row">
                            <div class="col-md-2 d-center" :title="d.tipo">
                                <span class="icon border"> <i :class="`${d.icono} ${(!d.leido_en) ? 'fw-bold':''}`"></i> </span>
                            </div>
                            <div class="col-md-10 content">
                                <span class="message" v-html="d.mensaje"></span><br>
                                <small class="date">{{ $filters.message(d.creado_en) }}</small>
                            </div>
                        </div>
                    </a>
                </div>                
            </li>
        </ul>
    </li>
</template>

<script setup>
    import store from '@/config/store'
    import notify from '@/config/store/notify'
    import { onMounted, ref, computed } from 'vue'
    import echo from '@/config/pusher.js'

    let count = ref(0)
    let top = ref(5)

    const readMore = async () => {
        top.value +=5
        await notify.dispatch('getNotifications', { id: store.getters.getUsuario.id, top: top.value })      
    }

    const read = async (n) => {   
        await notify.dispatch('readNotification', n)    
    }
    
    const wsNotification = () => {
        echo.private(`notify-user.${store.getters.getUsuario.id}`).listen('PrivNotifyUser', (data) => {            
            notify.dispatch('addNotification', data)
                .then(() => {
                    Util.notify(data.mensaje)
                })
        })
        echo.channel(`notify-type-account.${store.getters.getUsuario.tipo_usuarios_id}`).listen('PrivNotifyTypeAccount', (data) => {            
            notify.dispatch('addNotification', data)
                .then(() => {
                    Util.notify(data.mensaje)
                })
        })
    }

    onMounted(() => {
        if (notify.getters.getNotifications.length <= 0) notify.dispatch('getNotifications', { id: store.getters.getUsuario.id, top: top.value })
        wsNotification()
    })

</script>
<style scoped>
    .nav-link {
        color: white !important;
    }
    .nav-link:hover {
        color: black !important;
    }
    .dropdown-menu {
        right: 10px;
        min-width: 400px;
        max-height: 400px;
        overflow: auto;
    }
    .dropdown-toggle::after {
        display: none;
    }
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