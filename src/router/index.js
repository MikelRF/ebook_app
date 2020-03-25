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
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
