import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import EtlApplication from './etl-application'
import router from './router'


const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(EtlApplication)
app.mount('#app')

