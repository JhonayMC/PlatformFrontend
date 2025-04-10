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

                            <div class="mb-3">
                                <div class="mb-3">
                                    <label class="form-label">Correo</label>
                                    <div class="input-group">
                                        <input v-model.trim="formulario.correo" type="text" placeholder="cliente@gmail.com" 
                                        :class="(errores.correo) ? 'is-invalid form-control':'form-control'" :disabled="cargando">
                                        <button class="btn btn-dark" @click="obtenerCodigo" 
                                            :disabled="cargando == true || correoValido == false">Enviar Código
                                        </button>
                                    </div>
                                    <small v-if="errores.correo" class="text-danger">{{ errores.correo[0] }}</small>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Código de Recuperación</label>
                                    <input v-model.trim="formulario.codigo" type="text" placeholder="Ejemplo: X654asfd"
                                        :class="(errores.codigo) ? 'form-control is-invalid': 'form-control'">
                                    <small v-if="errores.codigo" class="text-danger">{{ errores.codigo[0] }}</small>
                                </div>
                                <div class="mb-3 form-password-toggle">
                                    <label>Nueva Contraseña</label>
                                    <div class="input-group input-group-merge">
                                        <input v-model.trim="formulario.contrasena" type="password" :disabled="cargando"
                                            :class="(errores.contrasena) ? 'form-control is-invalid': 'form-control'"
                                        placeholder="*************"/>
                                    </div>
                                    <small v-if="errores.contrasena" class="text-danger">{{ errores.contrasena[0] }}</small>
                                </div>
                                <div class="mb-3 form-password-toggle">
                                    <label>Confirmar Nueva Contraseña</label>
                                    <div class="input-group input-group-merge">
                                        <input v-model.trim="formulario.recontrasena" type="password" :disabled="cargando"
                                            :class="(errores.recontrasena) ? 'form-control is-invalid': 'form-control'"
                                        placeholder="*************"/>
                                    </div>
                                    <small v-if="errores.recontrasena" class="text-danger">{{ errores.recontrasena[0] }}</small>
                                </div>
                                <div>
                                    <b>Nota:</b> <br>
                                    <p>
                                        El correo debe pertenecer a la cuenta registrada.
                                    </p>
                                </div>
                                <div class="mt-3">
                                    <button :disabled="cargando" class="btn btn-dark d-grid w-100" @click="resetPassword">
                                        {{ (cargando) ? 'Procesando...' : 'Actualizar Contraseña' }}
                                    </button>
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
    import { ref,watch,computed } from 'vue'
    import { useRouter } from 'vue-router'
    import store from '@/config/store'
    import Formato from '@/config/formato.js'


    const router = useRouter()

    const formulario = ref({ correo:'', codigo:'', contrasena:'', recontrasena:''})
    let cargando = ref(false)
    let errores = ref([])

    const resetPassword = (e) => {
        e.preventDefault()
        Util.load(true)
        ac.post('auth/recuperar-contrasena', formulario.value)
            .then(({ data }) => {
                router.push({ name: 'Login' })
                Swal.fire({ icon: 'success', title: 'Se ha actualizado su información!.' })
                Util.load(false)
            }).catch((err) => {  
                Util.load(false)                
                errores.value = (err.response.status == 422) ? err.response.data.errores : []
                if (err.response.status != 422) {
                    Swal.fire({ icon : 'error', title:  'Oops ha ocurrido un problema inesperado.'})
                }
            })
    }

    const obtenerCodigo = () => {
        Util.load(true)
        ac.post('auth/obtener-codigo', {correo: formulario.value.correo })
            .then(({data}) => {
                Util.load(false)
                Swal.fire({ icon : 'success', title:  'Código enviado. Por favor recibe su bandeja de correo.'})
            }).catch((err) => {                  
                Util.load(false)
                if (err.response.status != 422) {
                    Swal.fire({ icon : 'error', title:  'Oops ha ocurrido un problema inesperado.'})
                }
                errores.value = (err.response.status == 422) ? err.response.data.errores : []
            })
    }

    const correoValido = computed(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(formulario.value.correo)
    })

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
