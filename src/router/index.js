import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { Message } from 'element-ui';

const Home = () => import('@/views/Home.vue')
const PageNotFound = () => import('@/views/404.vue')
//user
const Login = () => import('@/views/user/Login.vue')
const Register = () => import('@/views/user/Register.vue')
const UserHome = () => import ('@/views/user/UserHome.vue')
//user account
const Account =() => import('@/views/user/Account.vue')

//video
const Video = () => import('@/views/videopages/Video.vue')
const WatchTogether = () => import('@/views/WatchTogether.vue')
const CheckFile = () => import('@/components/platform/Main.vue')

//search
const Search = () => import('@/views/search/Main.vue')

//platform
const VideoUpload = () => import('@/views/videopages/VideoUpload.vue')
const PlatformHome = () => import('@/components/platform/Home.vue')
const AudienceSubtitle = () => import('@/components/platform/AudienceSubtitle.vue')
const Article = () => import('@/components/platform/Article.vue')
const UploadPage = () => import('@/components/platform/UploadPage.vue')
const ExtractSubtitles = () => import('@/components/platform/ExtractSubtitles.vue')

//电子书
const BookDock = () => import('@/views/ebook/BookDock.vue')

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
  {
    path:'/account',
    name:'account',
    component:Account,
    children:[],
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
        name:'home',
        path:'home',
        component: PlatformHome
      },
      {
        name:'main',
        path:'main',
        component: CheckFile,
      },
      {
        name:'uploadpage',
        path:'uploadpage',
        component: UploadPage
      },
      {
        name:'extract-subtitles',
        path:'extract-subtitles',
        component:ExtractSubtitles
      },
      {
        path:'upload-manager',
        component:{render(h) {
          return h('router-view')
        },},
        redirect:'article',
        children:[
          {
            name:'article',
            path:'article',
            component:Article
          },{
            name:'audience-subtitles',
            path:'audience-subtitles',
            component:AudienceSubtitle
          }
        ]
      },
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
  {
    path:'/ebook',
    name:'ebook',
    component: BookDock
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
