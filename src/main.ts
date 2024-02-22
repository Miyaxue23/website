import './assets/css/index.scss'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import FloatingVue from 'floating-vue'
import {
  // Directives
  vTooltip,
  vClosePopper,
  // Components
  Dropdown,
  Tooltip,
  Menu
} from 'floating-vue'
import 'floating-vue/dist/style.css'
import '@/utils/utils'
import App from './App.vue'
import router from './router'
import store from './store'
const app = createApp(App)
app.use(FloatingVue)
app.use(router)
app.use(ElementPlus)
app.use(store)
app.mount('#app')
app.directive('tooltip', vTooltip)
app.directive('close-popper', vClosePopper)

app.component('VDropdown', Dropdown)
app.component('VTooltip', Tooltip)
app.component('VMenu', Menu)
