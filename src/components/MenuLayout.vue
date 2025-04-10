<template>
    <div class="collapse show position-fixed sidebar-nav bg-white border-0 shadow-sm" tabindex="-1" id="sidebardesktop">
        <div class="offcanvas-body pt-4">
            <nav class="navbar-light">
                <ul class="navbar-nav">

                    <li v-for="d,i in storeOption.getters.getMenu" :key="i">
                        <div class="my-2">
                            <hr class="dropdown-divider bg-light" />
                        </div>
                        <div class="text-muted small fw-bold text-uppercase px-3 mb-3">
                            {{ d.nombre }}
                        </div>                        
                        <div v-if="d.menus.length">
                            <div v-for="m,ii in d.menus" :key="ii">
                                <div v-if="m.sub_menus.length">
                                    <div v-if="store.getters.getAP[1][m.id] == 1">
                                        <a :class="(m.slug == route.params.menu) ? 'nav-link px-3 sidebar-link active': 'nav-link px-3 sidebar-link'" 
                                            data-bs-toggle="collapse" :href="`#sm-${m.id}-${m.slug}`">
                                            <span class="me-2"><i :class="m.icono"></i></span>
                                            <span class="m-name" :data-id="m.id">{{ m.nombre }}</span>
                                            <span class="ms-auto"><span class="right-icon"><i class="fas fa-chevron-down"></i></span></span>
                                        </a>
                                        <div class="collapse" :class="(m.slug == route.params.menu) ? 'show': ''" :id="`sm-${m.id}-${m.slug}`">
                                            <ul class="navbar-nav ps-3">
                                                <li v-for="sm,iii in m.sub_menus" :key="iii">
                                                    <div v-if="store.getters.getAP[2][sm.id] == 1">
                                                        <router-link :to="{ name: 'AppMenu', params: { menu: m.slug, submenu: sm.slug } }" 
                                                        :class="(sm.slug == route.params.submenu) ? 'nav-link px-3 active mt-1': 'nav-link px-3 mt-1'">
                                                            <span class="sm-name" :data-id="sm.id">{{ sm.nombre }}</span>
                                                        </router-link>
                                                    </div>                                                    
                                                </li>
                                            </ul>
                                        </div>
                                    </div>                                    
                                </div>
                                <div v-else>
                                    <div v-if="store.getters.getAP[1][m.id] == 1">
                                        <router-link :to="{ name: 'AppMenu', params: { menu: m.slug } }"
                                        :class="(m.slug == route.params.menu) ? 'nav-link px-3 active': 'nav-link px-3'">
                                            <span class="me-2"><i :class="m.icono"></i></span>
                                            <span class="m-name" :data-id="m.id">{{ m.nombre }}</span>
                                        </router-link>
                                    </div>                                    
                                </div>
                            </div>
                        </div>
                    </li>               
                </ul>
            </nav>
        </div>
    </div>

    <div class="offcanvas offcanvas-start sidebar-nav bg-white border-0 shadow-sm" tabindex="-1" id="sidebar" style="visibility: visible;">
        <div class="offcanvas-body pt-4">
            <nav class="navbar-light">
                <ul class="navbar-nav">

                    <li v-for="d,i in storeOption.getters.getMenu" :key="i">
                        <div class="my-2">
                            <hr class="dropdown-divider bg-light" />
                        </div>
                        <div class="text-muted small fw-bold text-uppercase px-3 mb-3">
                            {{ d.nombre }}
                        </div>                        
                        <div v-if="d.menus.length">
                            <div v-for="m,ii in d.menus" :key="ii">
                                <div v-if="m.sub_menus.length">
                                    <div v-if="store.getters.getAP[1][m.id] == 1">
                                        <a :class="(m.slug == route.params.menu) ? 'nav-link px-3 sidebar-link active': 'nav-link px-3 sidebar-link'" 
                                            data-bs-toggle="collapse" :href="`#sm-${m.id}-${m.slug}`">
                                            <span class="me-2"><i :class="m.icono"></i></span>
                                            <span class="m-name" :data-id="m.id">{{ m.nombre }}</span>
                                            <span class="ms-auto"><span class="right-icon"><i class="fas fa-chevron-down"></i></span></span>
                                        </a>
                                        <div class="collapse" :class="(m.slug == route.params.menu) ? 'show': ''" :id="`sm-${m.id}-${m.slug}`">
                                            <ul class="navbar-nav ps-3">
                                                <li v-for="sm,iii in m.sub_menus" :key="iii">
                                                    <div v-if="store.getters.getAP[2][sm.id] == 1">
                                                        <router-link :to="{ name: 'AppMenu', params: { menu: m.slug, submenu: sm.slug } }" 
                                                        :class="(sm.slug == route.params.submenu) ? 'nav-link px-3 active': 'nav-link px-3'">
                                                            <span class="sm-name" :data-id="sm.id">{{ sm.nombre }}</span>
                                                        </router-link>
                                                    </div>                                                    
                                                </li>
                                            </ul>
                                        </div>
                                    </div>                                    
                                </div>
                                <div v-else>
                                    <div v-if="store.getters.getAP[1][m.id] == 1">
                                        <router-link :to="{ name: 'AppMenu', params: { menu: m.slug } }"
                                        :class="(m.slug == route.params.menu) ? 'nav-link px-3 active': 'nav-link px-3'">
                                            <span class="me-2"><i :class="m.icono"></i></span>
                                            <span class="m-name" :data-id="m.id">{{ m.nombre }}</span>
                                        </router-link>
                                    </div>                                    
                                </div>
                            </div>
                        </div>
                    </li>               
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
    import storeOption from '@/config/store/options'
    import store from '@/config/store'
    import { useRoute } from 'vue-router'

    const route = useRoute()
</script>

<style scoped>
.offcanvas-body .navbar-nav .nav-link .sm-name {
    font-size: 13.5px;
}
.offcanvas-body .navbar-nav .m-name {
    font-size: 14.5px;
}
</style>