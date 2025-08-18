import type { RouteRecordRaw } from 'vue-router'

const platformRoutes: RouteRecordRaw[] = [
  {
    path: '/platform',
    name: 'platform',
    redirect: '/platform/home',
    component: () => import('@/layout/platform/PlatformLayout.vue'),
    children: [
      {
        meta: {
          title: '首页',
          icon: 'home'
        },
        path: '/platform/home',
        name: 'platformHome',
        component: () => import('@/views/platform/Home.vue')
      }
    ]
  }
]

export default platformRoutes
