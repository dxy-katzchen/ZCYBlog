import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Router from './routers'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import ImportGlobalComponent from './ImportGlobalComponent'

const app = createApp(App)
app.use(Router)


const Pinia = createPinia()
Pinia.use(piniaPluginPersist)
app.use(Pinia)

ImportGlobalComponent(app)

app.mount('#app')
