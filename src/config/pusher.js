import Echo from 'laravel-echo'
import Pusher from 'pusher-js/with-encryption'
import store from '@/config/store'

const echo = new Echo({
    broadcaster: 'pusher',
    cluster: import.meta.env.VITE_MIX_PUSHER_APP_CLUSTER,
    key: import.meta.env.VITE_MIX_PUSHER_APP_KEY,
    wsHost: window.location.hostname,
    wsPort: import.meta.env.VITE_MIX_PUSHER_APP_PORT,
    encrypted: true,
    forceTLS: false,
    disableStats: true,
    authEndpoint: `${import.meta.env.VITE_API_URL}/api/broadcasting/auth`,
    auth: {
        headers: {
            Authorization: `Bearer ${store.getters.getToken}`,
        }
    },
    enabledTransports: ['ws', 'wss'],
})

export default echo