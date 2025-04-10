<template>
    <div class="container">
        <video class="video-fondo" autoplay muted loop>
        <source :src="$getSrc('/images/bg-6.mp4')" type="video/mp4" />
        </video>

        <div class="authentication-wrapper authentication-basic container-p-y">
            <div class="authentication-inner">
                <div class="card">
                    <div class="card-body">
                        <router-link class="btn btn-dark position-absolute end-015" :to="{ name: 'Dashboard' }">
                            <i class="far fa-arrow-left"></i> 
                        </router-link> 

                        <div class="app-brand justify-content-center">
                            <a class="app-brand-link gap-2">
                                <span class="app-brand-logo demo">
                                    <img :src="$getSrc('/images/logo.png')" width="250">
                                </span>
                            </a>
                        </div>

                        <form class="mb-3" @submit="resetPassword">
                            <div class="mb-3 form-password-toggle">
                                <label>Contraseña Actual</label>
                                <div class="input-group input-group-merge">
                                    <input v-model.trim="usuario.contrasena" type="password" :class="(errors.contrasena) ? 'form-control is-invalid': 'form-control'" 
                                    placeholder="*************" aria-describedby="password" />
                                </div>
                                <small v-if="errors.contrasena" class="text-danger">{{ errors.contrasena[0] }}</small>
                            </div>
                            <div class="mb-3 form-password-toggle">
                                <label>Nueva Contraseña</label>
                                <div class="input-group input-group-merge">
                                    <input v-model.trim="usuario.recontrasena" type="password" :class="(errors.recontrasena) ? 'form-control is-invalid': 'form-control'" 
                                    placeholder="*************" aria-describedby="password" />
                                </div>
                                <small v-if="errors.recontrasena" class="text-danger">{{ errors.recontrasena[0] }}</small>
                            </div>
                            <div>
                                <b>Se recomienda:</b> <br>
                                <p>* Tener al menos 1 letra Mayúscula.</p>
                                <p>* Tener letras y números.</p>
                                <p>* Tener al menos 1 carácter especial.</p>
                                <p>* Tener como mínimo 8 caracteres.</p>
                                <p>* Tener como máximo 16 caracteres.</p>
                            </div>
                            <div class="mt-3">
                                <button :disabled="load" class="btn btn-dark d-grid w-100" type="submit">
                                    {{ (load) ? 'Procesando...' : 'Actualizar Contraseña' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import store from '@/config/store'

const router = useRouter()

const usuario = ref({ contrasena: '', recontrasena: '' })
let load = ref(false)
let errors = ref([])

const resetPassword = (e) => {
    e.preventDefault()
    Util.load(true)
    ac.post('auth/cambiar-contrasena', usuario.value)
        .then(({data}) => {
            Util.load(false)
            logout()
        }).catch((err) => {  
            Util.load(false)
            errors.value = (err.response.status == 422) ? err.response.data.errors : []
        })
}

const logout = () => {
    store.dispatch('logout')
        .then(() => {
            router.push({ name: 'Login' })
        })
}

</script>

<style>
.video-fondo {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  transform: translate(-50%, -50%);
  background-size: cover;
}

.container .container-login {
  display: flex;
  align-items: center;
  flex-basis: 100%;
  min-height: 100vh;
  width: 100%;
  padding: 5rem;
}

.container .container-login .content {
  position: relative;
  top: -35px;
  width: 100%;
  height: 30em;
}

.container .container-login .login {
  background: #ffffffed;
  border-radius: 1rem;
}

.container .container-login .bgs {
  padding: 0;
}

.container .container-login .bgs img {
  border-radius: 0 1rem 1rem 0;
}

.container .container-login .panel {
  text-align: center;
  padding: 1rem 0;
  cursor: pointer;
  border-bottom: 1px solid #d3d3d3;
}

.container .container-login .panel:nth-child(1).active {
  border-radius: 1rem 0rem 0rem 0rem;
}

.container .container-login .panel:nth-child(2).active {
  border-radius: 0rem 1rem 0rem 0rem;
}

.container .container-login .panel.active {
  background: var(--bs-dark);
  color: #fff;
  font-weight: 500;
}

</style>
