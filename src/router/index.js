import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/store'
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
        component: () => import('../views/store/storeDetail')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
