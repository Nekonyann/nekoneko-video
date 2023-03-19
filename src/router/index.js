import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { Message } from 'element-ui';

// 路由懒加载
const Home = () => import('@/views/Home.vue')
const PageNotFound = () => import('@/views/404.vue')
//user
const Login = () => import('@/views/user/Login.vue')
const Register = () => import('@/views/user/Register.vue')
const UserHome = () => import ('@/views/user/UserHome.vue')

//video
const Video = () => import('@/views/videopages/Video.vue')
const VideoUpload = () => import('@/views/videopages/VideoUpload.vue')
const WatchTogether = () => import('@/views/WatchTogether.vue')
const UploadPage = () => import('@/components/platform/UploadPage.vue')
const CheckFile = () => import('@/components/platform/Main.vue')

//search
const Search = () => import('@/views/search/Main.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path:'/home',
    redirect:'/'
  },
  // user
  {
    path:'/login',
    name:'login',
    component: Login
  },
  {
    path:'/register',
    name:'register',
    component: Register
  },
  {
    path:'/user/:uid(\\d+)',
    name:'userhome',
    component: UserHome,
  },
  //video
  {
    path:'/video/nya:nid(\\d+)',
    name:'video',
    component: Video,
  },
  {
    path:'/videoupload',
    component: VideoUpload,
    redirect:'/videoupload/main',
    meta: {
      requiresAuth: true // 需要登录才能访问
    },
    children:[
      {
        name:'main',
        path:'/videoupload/main',
        component: CheckFile,
      },
      {
        name:'uploadpage',
        path:'uploadpage',
        component: UploadPage
      }
    ]
  },
  {
    path:'/video/nya:nid(\\d+)/watchtog',
    name:'watchtog',
    component: WatchTogether,
    meta: {
      requiresAuth: true
    }
  },
  {
    path:'/search/video',
    name:'search',
    component: Search
  },
  //404重定向
  {
    path:'*',
    redirect:'/404'
  },
  {
    path:'/404',
    component:PageNotFound,
    name:'404'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  if (to.meta.requiresAuth) {  // 判断该路由是否需要登录权限
    console.log(store.state)
    if (localStorage.getItem("authorization")&&store.state.isLogin) {  // 获取当前的token是否存在
      next();
    } else {
      Message.error("请先登录")
      next(false)
    }
  }
  else { // 如果不需要权限校验，直接进入路由界面
    next();
  }
})

export default router
