<template>
    <div class="login-page-wrapper">
        <video class="video-fondo" autoplay muted loop>
            <source :src="$getSrc('/images/bg-6.mp4')" type="video/mp4">
        </video>
        <div class="container">
            <div class="authentication-wrapper authentication-basic container-p-y">
                <div class="authentication-inner">
                    <div class="card">
                        <div class="card-body">
                            <router-link class="btn btn-dark position-absolute end-015" :to="{ name: 'Auth' }">
                                <i class="far fa-arrow-left"></i> 
                            </router-link> 
                            <div class="app-brand justify-content-center">
                                <a class="app-brand-link gap-2">
                                    <span class="app-brand-logo demo">
                                        <img :src="$getSrc('/images/logo.png')" width="150">
                                    </span>
                                </a>
                            </div>

                            <form class="mb-3" @submit="resetPassword">
                                <div class="mb-3">
                                    <label class="form-label">Tipo de documento</label>
                                    <div class="input-group">
                                        <select v-model="formulario.tipo_documentos_id" class="form-select w-50" required>
                                            <option value="" disabled>Seleccionar</option>
                                            <option value="1">DNI</option>
                                            <option value="2">RUC</option>
                                            <option value="3">Pasaporte</option>
                                            <option value="4">Carné de Extranjería</option>
                                        </select>  
                                        <input v-model.trim="formulario.documento" type="text" required
                                            :class="(errores.documento) ? 'form-control is-invalid w-75': 'form-control w-50'" />
                                    </div>
                                    <small v-if="errores.documento" class="text-danger">{{ errores.documento[0]  }}</small>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">{{(formulario.tipo_documentos_id == 2) ? 'Razón Social':'Nombre Completo'}}</label>
                                    <input v-model.trim="formulario.nombre_completo" type="text" 
                                        :class="(errores.nombre_completo) ? 'form-control is-invalid': 'form-control'"
                                        :disabled="cargando" required>  
                                    <small v-if="errores.nombre_completo" class="text-danger">{{ errores.nombre_completo[0]  }}</small>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Correo</label>
                                    <input v-model.trim="formulario.correo" type="email" 
                                        :class="(errores.correo) ? 'form-control is-invalid': 'form-control'"
                                        :disabled="cargando" required>  
                                    <small v-if="errores.correo" class="text-danger">{{ errores.correo[0]  }}</small>
                                </div>
                                <div class="mb-2 form-password-toggle">
                                    <label>Nueva Contraseña</label>
                                    <div class="input-group input-group-merge">
                                        <input v-model.trim="formulario.contrasena" type="password" required
                                        :class="(errores.contrasena) ? 'form-control is-invalid': 'form-control'" 
                                        placeholder="*************" />
                                    </div>
                                    <small v-if="errores.contrasena" class="text-danger">{{ errores.contrasena[0] }}</small>
                                </div>
                                <div class="mb-2 form-password-toggle">
                                    <label>Confirmar Nueva Contraseña</label>
                                    <div class="input-group input-group-merge">
                                        <input v-model.trim="formulario.recontrasena" type="password" required
                                        :class="(errores.recontrasena) ? 'form-control is-invalid': 'form-control'" 
                                        placeholder="*************" />
                                    </div>
                                    <small v-if="errores.recontrasena" class="text-danger">{{ errores.recontrasena[0] }}</small>
                                </div>
                                <div class="mt-3">
                                    <button :disabled="cargando" class="btn btn-dark d-grid w-100" type="submit">
                                        {{ (cargando) ? 'Procesando...' : 'Crear cuenta' }}
                                    </button>
                                </div>
                            </form>
                        </div>
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
    const formulario = ref({
        tipo_usuarios_id: 1,
        tipo_documentos_id: 1,
        documento: '',
        nombre_completo: '',
        correo: '',
        contrasena: '',
        recontrasena: ''
    })
    let cargando = ref(false)
    let errores = ref([])

    const resetPassword = (e) => {
        e.preventDefault()
        Util.load(true)
        ac.post('auth/registrar', formulario.value)
            .then(({ data }) => {
                Swal.fire({ icon: 'success', title: 'Te damos la Bienvenida a nuestro Sistema!' })
                setTimeout(() => {
                    router.push({ name: 'Login' })
                }, 1000)
                Util.load(false)
            }).catch((err) => {  
                Util.load(false)
                errores.value = (err.response.status == 422) ? err.response.data.errores : []
            })
    }
</script>

<style>
    .card {
        background: #ffffffed;
        border-radius: 1rem;
    }
/* Estilo para el video de fondo */
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

</style>
