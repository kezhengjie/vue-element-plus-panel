import { createRouter, createMemoryHistory, createWebHashHistory, createWebHistory } from 'vue-router'

const routes = [
    { path: '', redirect: "fix-seq", name: 'index' },
    { path: '/', redirect: "fix-seq", name: 'index' },
    { path: '/base64', component: () => import('@/components/Base64.vue'), name: "base64" },
    { path: '/fix-seq', component: () => import('@/components/FixSeq.vue'), name: "fix-seq" },
    { path: '/sql-process', component: () => import('@/components/SQLProcess.vue'), name: "sql-process" },
]

// function definePage(page) {
//     routes.push({ path: '/' + page.toLowerCase(), component: () => import(`./components/${page}.vue`), name: page.toLowerCase() },)
// }

// definePage('Table')

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router
