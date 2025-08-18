import type { RouteRecordRaw } from 'vue-router'

import FrontLayout from '@/layout/front/FrontLayout.vue'

const homeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: FrontLayout,
    children: [
      {
        meta: {
          title: '首页',
          icon: 'home'
        },
        path: '/',
        name: 'index',
        component: () => import('@/views/front/Home.vue')
      }
    ]
  }
]

export default homeRoutes
