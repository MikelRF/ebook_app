import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../views/home/login')
  },
  {
    path: '/setPassWord',
    component: () => import('../views/home/setPassWord')
  },
  {
    path: '/register',
    component: () => import('../views/home/register')
  },
  {
    path: '/ebook',
    component: () => import('../views/ebook/index.vue'),
    children: [
      {
        path: ':fileName',
        component: () => import('../components/ebook/ebookReader')
      }
    ]
  },
  {
    path: '/store',
    redirect: '/store/home',
    component: () => import('../views/store/index'),
    children: [
      {
        path: 'home',
        component: () => import('../views/store/storeHome')
      },
      {
        path: 'list',
        component: () => import('../views/store/storeList')
      },
      {
        path: 'detail',
        component: () => import('../views/store/storeDetail'),
        children: [
          {
            path: 'commentWrite',
            component: () => import('../views/store/commentWrite')
          },
          {
            path: 'commentList',
            component: () => import('../views/store/commentList'),
            children: [
              {
                path: 'commentDetail',
                component: () => import('../views/store/commentDetail')
              }
            ]
          }
        ]
      },
      {
        path: 'shelf',
        component: () => import('../views/store/storeShelf')
      },
      {
        path: 'category',
        component: () => import('../views/store/storeShelfCategory')
      },
      {
        path: 'speaking',
        component: () => import('../views/store/storeSpeaking')
      }
    ]
  }
]
const whiteList = [
  '/login',
  '/register',
  '/setPassWord',
  '/store/home',
  '/store/detail',
  '/store/detail/commentList',
  '/store/list'
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 确定用户是否已登录
  const isLogin = sessionStorage.getItem('isLogin')
  // 登录
  if (isLogin) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/store/home' })
      return
    }
    next()
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      next()
    } else {
      next('/login')
    }
  }
})

export default router
