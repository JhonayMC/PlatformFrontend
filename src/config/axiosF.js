import axios from 'axios'
import store from '@/config/store'

const baseURL = (import.meta.env.PRODUCTION) ? `${import.meta.env.VITE_API_URL}api/v1`: `${import.meta.env.VITE_API_URL}/api/v1`

const acf = axios.create({
    baseURL: baseURL,
    headers: {
        'X-Requested-With' : 'XMLHttpRequest'
    },
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
});

acf.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${store.state.usuario.token}`
    return config
})

acf.interceptors.response.use(response => {
    return response
    }, error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    return Util.logoutExpired()
                case 429:
                    return Util.againBlock()
                case 403:
                    return Util.forbidden()
                default:
                    break;
            }
        } else {
            return Util.errorServer()
        }
        return Promise.reject(error)
})

acf.defaults.headers.post['Content-Type'] = 'multipart/form-data'

export default acf