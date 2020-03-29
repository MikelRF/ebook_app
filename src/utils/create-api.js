import CreateAPI from 'vue-create-api'
import Vue from 'vue'
import toast from '../components/common/toast'
import popUp from '../components/common/popUp'

// CreateAPI加载到vue中
Vue.use(CreateAPI)
Vue.createAPI(toast, true)
Vue.createAPI(popUp, true)

Vue.mixin({
  methods: {
    toast(settings) {
      return this.$createToast({
        $props: settings
      })
    },
    // toast 二次封装
    simpleToast(text) {
      this.toast({
        text: text
      }).show()
    },
    popup(settings) {
      return this.$createPopup({
        $props: settings
      })
    }
  }
})
