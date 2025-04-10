<template>
  <div class="login-page-wrapper">
    <video class="video-fondo" autoplay muted loop>
      <source :src="$getSrc('/images/bg-6.mp4')" type="video/mp4" />
    </video>
    <div class="container">
      <div class="container-login">
        <div class="content">
          <div class="row justify-content-center w-100 h-100">
            <div class="col-lg-6 login">
              <div class="row">
                <div class="col-12">
                  <div class="row justify-content-center">
                    <div @click="setPanel(1)" class="col-6 panel" :class="panel == 1 ? 'active' : ''">
                      <span>Soy Cliente</span>
                    </div>
                    <div @click="setPanel(2)" class="col-6 panel" :class="panel == 2 ? 'active' : ''">
                      <span>Soy Trabajador</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row justify-content-center mt-4">
                <div class="col-lg-8">
                  <div class="app-brand justify-content-center">
                    <a class="app-brand-link gap-2">
                      <span class="app-brand-logo demo">
                        <img :src="$getSrc('/images/logo.png')" width="150" />
                      </span>
                    </a>
                  </div>
                  <form class="mb-3" @submit="login">
                    <div class="mb-3">
                      <label class="form-label text-muted">Usuario</label>
                      <input v-model.trim="formulario.usuario" type="text" :placeholder="(panel == 1) ? 'RUC o DNI': 'Usuario'"
                        :class="errores.usuario ? 'form-control is-invalid' : 'form-control' " :disabled="cargando" />
                      <small v-if="errores.usuario" class="text-danger">{{ errores.usuario[0] }}</small>
                    </div>
                    <div class="form-password-toggle">
                      <div class="d-flex justify-content-between">
                        <label class="form-label text-muted">Contraseña</label>
                        <router-link v-if="panel == 1" class="text-muted text-decoration-none"
                          :to="{ name: 'RecuperarContrasena' }">
                          <small>¿Has olvidado tu contraseña?</small>
                        </router-link>
                      </div>
                      <div class="input-group input-group-merge">
                        <input v-model.trim="formulario.contrasena" id="password" type="password" 
                          :class="errores.contrasena ? 'form-control is-invalid' : 'form-control'" 
                          placeholder="*************" aria-describedby="password" :disabled="cargando" />
                        <span class="btn btn-light border" @click="mostrar = !mostrar">
                          <i v-if="!mostrar" class="far fa-eye" title="Ocular"></i>
                          <i v-else class="far fa-eye-slash" title="Mostrar"></i>
                        </span>
                      </div>
                      <small v-if="errores.contrasena" class="text-danger">{{ errores.contrasena[0] }}</small>
                    </div>
                    <div v-if="panel == 2">
                      <label class="form-label text-muted">Empresa</label>
                      <select v-model="formulario.empresa_id" :class="errores.empresa_id ? 'form-select is-invalid' : 'form-select' " 
                        :disabled="cargando">
                        <option value="" disabled>Seleccionar</option>
                        <option v-for="(d, i) in empresas" :key="d.id" :value="d.id">
                          {{ d.nombre }}
                        </option>
                      </select>
                      <small v-if="errores.empresa_id" class="text-danger">{{ errores.empresa_id[0] }}</small>
                    </div>
                    <div class="my-3">
                      <button :disabled="cargando" class="btn btn-dark w-100" type="submit">
                        {{ cargando ? "Validando credenciales..." : "Iniciar sesión" }}
                      </button>
                    </div>
                    <div v-if="panel == 1" class="text-center">
                      <router-link v-if="panel == 1" class="text-muted text-decoration-none"
                        :to="{ name: 'RegistrarCliente' }">
                        <small class="text-muted cursor-pointer">
                          ¿Eres Nuevo?, Clic aquí para
                          <strong>Crear Nueva Cuenta</strong>.
                        </small>
                      </router-link>
                    </div>
                    <div v-if="panel == 2" class="text-center">
                      <small class="text-muted cursor-pointer">
                        Módulo solo para trabajadores.
                      </small>
                    </div>
                  </form>
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
    import { ref, watch } from "vue"
    import { useRouter } from "vue-router"
    import store from "@/config/store"
    import Formato from "@/config/formato.js"
  
    const router = useRouter()
    const formulario = ref({
      usuario: "",
      contrasena: "",
      empresa_id: "",
    })
    let panel = ref(1)
    let empresas = ref([
      { id: 30, nombre: "ANADI" },
      { id: 10, nombre: "M&M REPUESTOS Y SERVICIOS S.A" },
    ])  
    let cargando = ref(false)
    let errores = ref([])
    let mostrar = ref(false)
  
    const login = (e) => {
        e.preventDefault()
        cargando.value = !cargando.value
        if(panel.value == 1) delete formulario.value.empresa_id
        store.dispatch("login", formulario.value)
            .then((data) => {
              router.push({ name: 'Dashboard' })
              window.location.reload()
            })
          .catch((err) => {
              errores.value = err.status == 422 ? err.data.errores : []
            })
            .finally(() => {
              cargando.value = !cargando.value;
            })
    }
    
    const setPanel = (set) => {
      panel.value = set
      formulario.value.usuario = "";
      formulario.value.contrasena = ""
      formulario.value.empresa_id = ""
      errores.value = []
}
    
    watch( formulario.value, (n) => {
      formulario.value.contrasena = Formato("otros", n.contrasena).toString().substr(0, 25)
      if (panel.value == 1) {
        formulario.value.usuario = Formato("digitos", n.usuario).substr(0, 11)
      }
    }, { deep: true })
    
    watch(mostrar, (n) => {
        if (mostrar.value) {
            $("#password").attr("type", "text")
        } else {
            $("#password").attr("type", "password")
        }
    })
</script>

<style scoped>
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
