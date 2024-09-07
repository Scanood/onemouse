import './index.css';
import 'primeicons/primeicons.css'
import Aura from '@primevue/themes/aura';
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia'
import router from './router';
import PrimeVue from "primevue/config";
import Ripple from 'primevue/ripple';
import ToastService from 'primevue/toastservice';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
app.use(router)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(PrimeVue, {
    ripple: true,
    theme: {
        preset: Aura
    }
})
app.use(ToastService);
app.directive('ripple', Ripple)
app.mount('#app')

