import type { RouteRecordRaw } from 'vue-router'
import { coreRoutes, fallbackNotFoundRoute } from './core'

const routes: RouteRecordRaw[] = [...coreRoutes, fallbackNotFoundRoute]

export { routes }
