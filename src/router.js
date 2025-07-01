import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const routes = [
    { path: '', redirect: "fix-seq" },
    { path: '/', redirect: "fix-seq" },
    { path: '/index.html', redirect: "fix-seq" },
    { path: '/dist/index.html', redirect: "fix-seq" },
    { path: '/base64', component: () => import('@/components/Base64.vue'), name: "base64" },
    { path: '/fix-seq', component: () => import('@/components/FixSeq.vue'), name: "fix-seq" },
]

// function definePage(page) {
//     routes.push({ path: '/' + page.toLowerCase(), component: () => import(`./components/${page}.vue`), name: page.toLowerCase() },)
// }

// definePage('Table')

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
