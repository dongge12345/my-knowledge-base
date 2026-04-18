import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserInfoStore } from '@/store/userInfo'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            component: () => import('@/components/Login.vue'),
            meta: {
                noAuth: true
            }
        },
        {
            name: 'home',
            path: '/home',
            component: () => import('@/components/Home.vue'),
            children: [
                {
                    name: 'taskList',
                    path: '/task-list',
                    component: () => import('@/components/TaskList.vue')
                },
                {
                    name: 'taskDetail',
                    path: '/task-list/:id',
                    component: () => import('@/components/TaskDetail.vue')
                },
                {
                    name: 'taskEdit',
                    path: '/task-list/:id/edit',
                    component: () => import('@/components/TaskEdit.vue')
                },
                {
                    name: 'about',
                    path: '/about',
                    component: () => import('@/components/About.vue'),
                    meta: {
                        noAuth: true
                    }
                }
            ]
        },
        {
            name: 'error',
            path: '/:pathMatch(.*)*',
            component: () => import('@/components/Error.vue'),
            meta: {
                noAuth: true
            }
        }
    ]
})

router.beforeEach((to) => {
    const userInfoStore = useUserInfoStore()

    if (to.meta.noAuth) {
        return true
    }

    if (!userInfoStore.isLoggedIn) {
        return {
            path: '/login',
            query: {
                redirect: to.fullPath
            }
        }
    }

    return true
})

export default router
