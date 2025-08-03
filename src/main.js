import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)
const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')