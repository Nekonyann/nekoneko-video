import type { RouteRecordRaw } from 'vue-router'

import homeRoutes from './modules/home'
import platformRoutes from './modules/platform'

import Index from '@/layout/Index.vue'
const NotFound = () => import('@/views/fallback/NotFound.vue')

/** 全局404页面 */
const fallbackNotFoundRoute: RouteRecordRaw = {
  component: NotFound,
  meta: {
    title: '404'
  },
  name: 'FallbackNotFound',
  path: '/:pathMatch(.*)*'
}

const coreRoutes: RouteRecordRaw[] = [
  {
    meta: {
      title: 'Root'
    },
    component: Index,
    name: 'Root',
    path: '/',
    children: [...homeRoutes, ...platformRoutes]
  }
]

export { coreRoutes, fallbackNotFoundRoute }
