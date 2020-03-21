<template>
    <div class="ebook" ref="ebook">
      <ebook-title></ebook-title>
      <ebook-header></ebook-header>
      <ebook-reader></ebook-reader>
      <ebook-menu></ebook-menu>
      <ebook-bookmark></ebook-bookmark>
      <ebook-footer></ebook-footer>
    </div>
</template>

<script>
  import ebookReader from '../../components/ebook/ebookReader'
  import ebookTitle from '../../components/ebook/ebookTitle'
  import ebookMenu from '../../components/ebook/ebookMenu'
  import ebookBookmark from '../../components/ebook/ebookBookmark'
  import ebookHeader from '../../components/ebook/ebookHeader'
  import ebookFooter from '../../components/ebook/ebookFooter'
  import { ebookMixin } from '../../utils/mixin'
  export default {
    name: 'index.vue',
    mixins: [ebookMixin],
    components: {
      ebookReader,
      ebookTitle,
      ebookMenu,
      ebookBookmark,
      ebookHeader,
      ebookFooter
    },
    watch: {
      offsetY(v) {
        // 菜单出现时不能下拉
        if (!this.menuVisible && this.bookAvailable) {
          if (v > 0) {
            this.move(v)
          } else if (v === 0) {
            this.restore()
          }
        }
      }
    },
    methods: {
      // 结束下拉，返回顶部
      restore() {
        this.$refs.ebook.style.top = 0
        this.$refs.ebook.style.transition = 'all .2s linear'
        setTimeout(() => {
          // 清除动画，防止卡顿
          this.$refs.ebook.style.transition = ''
        }, 200)
      },
      // 下拉
      move(v) {
        this.$refs.ebook.style.top = v + 'px'
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .ebook {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
</style>
