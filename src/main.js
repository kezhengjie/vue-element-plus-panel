import { createApp } from 'vue'
import { ElAside, ElButton, ElCalendar, ElCol, ElContainer, ElHeader, ElIcon, ElInput, ElMenu, ElRow, ElSubMenu, ElSwitch, ElTable, ElText, ElUpload } from 'element-plus'
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
    ElText,
    ElUpload,
    ElSwitch,
    ElRow,
    ElCol,
]

for (const el of elements) {
    app.use(el)
}

app.use(router)

router.isReady().then(()=>{
    app.mount('#app')
    router.push("/"+( localStorage.getItem('lastVisited') || 'fix-seq' ))
    router.afterEach((to) => {
        document.title = to.name ? `工具箱 - ${to.name}` : '工具箱'
        localStorage.setItem('lastVisited', to.name)
        console.log(`Navigated to ${to.fullPath}`)
    })
})