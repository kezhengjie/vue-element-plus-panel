import { createApp } from 'vue'
import { ElAside, ElButton, ElCalendar, ElContainer, ElHeader, ElIcon, ElInput, ElMenu, ElSubMenu, ElTable } from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const elements = [
    ElMenu,
    ElButton,
    ElCalendar,
    ElHeader,
    ElAside,
    ElIcon,
    ElContainer,
    ElTable,
    ElInput,
]

for (const el of elements) {
    app.use(el)
}

app.use(router)

router.isReady().then(()=>{
    app.mount('#app')
})