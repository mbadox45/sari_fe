import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
// import AppLayout2 from '@/layout/layout_sso/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            redirect:'/home',
            children: [
                // SARI
                // Administrator
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('@/views/sari/home/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        distributor:true,
                    }
                },
                {
                    path: '/my-request',
                    name: 'my-request',
                    component: () => import('@/views/sari/request/MyRequest.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        distributor:true,
                    }
                },
                {
                    path: '/form-request',
                    name: 'form-request',
                    component: () => import('@/views/sari/request/FormRequest.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        distributor:true,
                    }
                },
                {
                    path: '/action-request',
                    name: 'action-request',
                    component: () => import('@/views/sari/request/ActionRequest.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        distributor:true,
                    }
                },
                {
                    path: '/request',
                    name: 'request',
                    component: () => import('@/views/sari/request/IncomingRequest.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        distributor:true,
                    }
                },
                {
                    path: '/approve-request',
                    name: 'approve-request',
                    component: () => import('@/views/sari/request/ApproveRequest.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        distributor:true,
                    }
                },
                {
                    path: '/my-problem',
                    name: 'my-problem',
                    component: () => import('@/views/sari/problem/MyProblem.vue'),
                    meta:{
                        requiresAuth: true,
                        distributor:true,
                    }
                },
                {
                    path: '/problem',
                    name: 'problem',
                    component: () => import('@/views/sari/problem/AllProblem.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },


// ====================================================================================================================================
                
            ]
        },
        {
            path: '/print/:id',
            name: 'print',
            component: () => import('@/views/sari/request/PrintsRequest.vue'),
            meta:{
                requiresAuth: true,
                admin:true,
                distributor:true,
            }
        },
        {
            path: '/sign-out',
            name: 'signout',
            component: () => import('@/views/sari/signin/SignOut.vue'),
            meta:{
                requiresAuth: true,
                distributor:true,
                // admin:true,
            }
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login2.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/verify/:id',
            name: 'verify',
            component: () => import('@/views/sari/signin/Verify.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/sari/signin/NotFound.vue')
        },
    ]
});

router.beforeEach((to, from, next) => {
    const tokens = localStorage.getItem('usertoken') != null;
    const roles = localStorage.getItem('roles');
    // console.log(roles);

    if (to.matched.some((route) => route.meta.requiresAuth)) {
        if (tokens) {
            if (roles == 'admin') {
                if (to.matched.some((route) => route.meta.admin)) {
                    next();
                } else {
                    next('/home');
                }
            } else {
                if (to.matched.some((route) => route.meta.distributor)) {
                    next();
                } else {
                    next('/home');
                }
            }
        } else {
            next('/auth/login');
        }
    } else if (to.matched.some((route) => route.meta.guestOnly)) {
        if (tokens) {
            if (roles == 'admin') {
                next('/home');
            } else {
                next('/home');
            }
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;
