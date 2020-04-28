import CreateAPI from 'vue-create-api'
import Vue from 'vue'
import toast from '../components/common/toast'
import popUp from '../components/common/popUp'
import GroupDialog from '../components/shelf/shelfGroupDialog'

// CreateAPI加载到vue中
Vue.use(CreateAPI)
Vue.createAPI(toast, true)
Vue.createAPI(popUp, true)
Vue.createAPI(GroupDialog, true)

Vue.mixin({
  methods: {
    toast (settings) {
      return this.$createToast({
        $props: settings
      })
    },
    // toast 二次封装
    simpleToast (text) {
      const toast = this.toast({
        text: text
      })
      toast.show()
      toast.updateText(text)
    },
    popup (settings) {
      return this.$createPopup({
        $props: settings
      })
    },
    dialog (settings) {
      return this.$createGroupDialog({
        $props: settings
      })
    }
  }
})
