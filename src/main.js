import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/icomoon/icon.css'
import './assets/styles/global.scss'
import './utils/boost'
import './utils/create-api'
import VueLazyLoad from 'vue-lazyload'

Vue.use(VueLazyLoad, {
  loading: require('./assets/timg.jpg')
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
