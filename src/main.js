import './assets/css/bootstrap.min.css'
import './assets/css/all.css'
import './assets/css/dataTables.bootstrap5.min.css'
import './assets/css/buttons.dataTables.min.css'
import './assets/css/style.css'
import './assets/css/vue-multiselect.css'
import 'intro.js/introjs.css'
import './assets/css/dropzone.css'

import $ from 'jquery'
window.$ = $
window.jQuery = $

import './config/axios'
import './config/alerts'
import './config/utils'

import filters from './config/filters'
import { createApp } from 'vue'

import App from './App.vue'

import store from './config/store'
import storeOption from './config/store/options'
import router from './config/router'

const app = createApp(App).use(store).use(router)

app.config.globalProperties.$filters = filters
app.config.globalProperties.$Util = Util
app.config.globalProperties.$storeOption = storeOption
app.config.globalProperties.$getSrc = (src) => `${import.meta.env.VITE_SRC_URL}${src}`

app.mount('#app')
