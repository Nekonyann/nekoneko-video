import Vue from 'vue'
import VueRouter from 'vue-router'

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
    component: WatchTogether
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

// router.beforeEach((to,from,next)=>{})

export default router
