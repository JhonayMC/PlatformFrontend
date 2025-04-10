<template>
    <navegation-layout>
        <template #navleft>
            <div class="nav-left collapse navbar-collapse">
                <div class="mx-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Mostrar/Ocultar Menu">
                    <button @click="toggle" id="btnsbdesktop" class="btn border" data-bs-toggle="collapse" data-bs-target="#sidebardesktop">
                        <i class="far fa-bars-sort"></i>
                    </button>
                </div>
                <div class="mx-1">
                    <button class="btn border" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#CollapselistApps" aria-controls="CollapselistApps" aria-expanded="false">
                        <i class="far fa-grid-2"></i> Apps
                    </button>
                    <div class="collapse position-absolute" id="CollapselistApps"> 
                        <div class="card border">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-3 my-2 cursor-pointer" v-for="(d,i) in storeOption.getters.getApps" :key="i">
                                        <router-link v-if="$store.getters.getAP[0][d.id] == 1" :to="{ name: 'AppMenu', params: { name: d.slug } }"
                                        class="text-decoration-none">
                                            <div class="card" :style="`border-bottom: 5px solid ${d.fondo}`"
                                                data-bs-toggle="tooltip" data-bs-placement="top" :title="d.descripcion">
                                                <div class="card-body text-center">
                                                    <i :class="`${d.icono} icon-app`"></i>
                                                    <div style="font-size:10px;">{{ d.nombre }}</div>
                                                </div>
                                            </div>
                                        </router-link>
                                        <a class="card cursor-pointer not-ap" data-bs-toggle="tooltip" data-bs-placement="top" :title="d.nombre" 
                                            v-else>
                                            <div class="card-body text-center" :style="`border-bottom: 5px solid ${d.fondo}`">                                                
                                                <i :class="`${d.icono} icon-app`"></i>                                                   
                                            </div>
                                        </a>
                                    </div>                                        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mx-1">
                    <button class="btn border" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#CollapselistReports" aria-controls="CollapselistReports" aria-expanded="false">
                        <i class="far fa-list"></i> Reportes
                    </button>
                    <div class="collapse position-absolute" id="CollapselistReports"> 
                        <div class="card border">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4 my-2 cursor-pointer" v-for="(d,i) in storeOption.getters.getReports" :key="i">
                                        <router-link v-if="$store.getters.getAP[0][d.id] == 1" :to="{ name: 'AppReport', params: { name: d.slug } }"
                                        class="text-decoration-none">
                                            <div class="card" data-bs-toggle="tooltip" data-bs-placement="top" :title="d.descripcion">
                                                <div class="card-body text-center">
                                                    <i :class="`${d.icono} icon-app`"></i>   
                                                    <div style="font-size: 10px;">{{ d.nombre }}</div>
                                                </div>
                                            </div>
                                        </router-link>
                                        <a class="card cursor-pointer not-ap" data-bs-toggle="tooltip" data-bs-placement="top" :title="d.nombre" 
                                            v-else>
                                            <div class="card-body text-center">
                                                <i :class="`${d.icono} icon-app`"></i>
                                            </div>
                                        </a>
                                    </div>                                        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </navegation-layout>

    <menu-layout v-if="menuActive"></menu-layout>

    <main id="page-module" class="my-5 pt-4">
        <div class="container-fluid px-3">
            <div class="container-dashboard">

                <div class="page-breadcrumb">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item" :class="(!moduleName && !subModuleName) ? 'active': ''">{{ appName }}</li>
                            <li v-if="moduleName != ''" class="breadcrumb-item" :class="(!subModuleName) ? 'active': ''" aria-current="page">{{ moduleName }}</li>
                            <li v-if="subModuleName != ''" class="breadcrumb-item" :class="(subModuleName) ? 'active': ''" aria-current="page">{{ subModuleName }}</li>
                        </ol>
                    </nav>
                </div>

                <component v-if="component != ''" :is="component"></component>
            </div>
        </div>
    </main>

    <FooterComponent :menu="menuActive"/>
    
</template>

<script setup>
    import NavegationLayout from '@/components/NavegationLayout.vue'
    import MenuLayout from '@/components/MenuLayout.vue'
    import FooterComponent from '@/components/FooterComponent.vue'

    import { useRoute } from 'vue-router'
    import { ref, watch, defineAsyncComponent, shallowRef, computed, onMounted, watchEffect } from 'vue'
    import storeOption from '@/config/store/options'    

    import ErrorModule from '@/modules/ErrorModule.vue'

    const route = useRoute()
    
    let component = shallowRef('')
    let appName = ref('')
    let moduleName = ref('')
    let subModuleName = ref('')
    
    watch(() => route.params, (n) => {
        
        if (route.params.name && !route.params.menu && !route.params.submenu) {
            Util.load(true)
            storeOption.dispatch('getMenu', route.params.name)
                .then(() => {
                    appName.value = storeOption.getters.getApp.nombre
                    moduleName.value = ''
                    subModuleName.value = ''
                    component.value = defineAsyncComponent({
                        loader: () => import(`@/modules/apps/${storeOption.getters.getApp.componente}.vue`),
                        errorComponent: ErrorModule
                    })
                    Util.load(false)
                }).catch((err) => {
                    Util.load(false)
                })
        } else if (route.params.name && route.params.menu && !route.params.submenu) {
            const menu = storeOption.getters.getMenu
            menu.forEach(e => {
                if (e.menus.length) {
                    const foundMenu = e.menus.find(ee => ee.slug === route.params.menu)
                    if (foundMenu) {        
                        appName.value = storeOption.getters.getApp.nombre
                        moduleName.value = foundMenu.nombre     
                        subModuleName.value = ''           
                        component.value = defineAsyncComponent({
                            loader: () => import(`@/modules/apps/modules/${foundMenu.componente}.vue`),
                            errorComponent: ErrorModule
                        })
                    }
                }
            })
        } else if (route.params.name && route.params.menu && route.params.submenu) {
            const menu = storeOption.getters.getMenu
            menu.forEach(e => {
                if (e.menus.length) {
                    e.menus.forEach(m => {
                        if (m.sub_menus.length) {                            
                            const foundSubMenu = m.sub_menus.find(sm => sm.slug === route.params.submenu)
                            if (foundSubMenu) {                                
                                appName.value = storeOption.getters.getApp.nombre
                                moduleName.value = m.nombre
                                subModuleName.value = foundSubMenu.nombre
                                component.value = defineAsyncComponent({
                                    loader: () => import(`@/modules/apps/submodules/${foundSubMenu.componente}.vue`),
                                    errorComponent: ErrorModule
                                })   
                            }
                        }
                    })
                }
            }) 
        }   
        document.title = 'Sistema | ' + storeOption.getters.getApp.nombre || ''   
    }, { immediate: true })

    const menuActive = computed(() => {        
        let active = false 
        storeOption.getters.getMenu.forEach(e => {
            if (e.menus.length) active = true
        })
        return active
    })

    onMounted(() => {
        if (!menuActive.value) toggle()
    })

    const toggle = () => {
        $('#page-module').toggleClass('m-0')
    }

</script>
<style scoped>

</style>