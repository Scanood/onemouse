import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '../pages/index.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: '首页',
            component: Index,
            meta: {
                title: 'One Mouse | 首页'
            }
        },
        {
            path: '/setting',
            name: '设置',
            component: () => import('../pages/setting.vue'),
            meta: {
                title: 'One Mouse | 设置'
            }
        },
        {
            path: '/control',
            name: '控制',
            component: () => import('../pages/control.vue'),
            meta: {
                title: '控制面板'
            }
        }
    ]
})

export default router