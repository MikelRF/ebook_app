<!--滚动条-->
<template>
  <div class="scroll-wrapper" :class="{'no-scroll': ifNoScroll}"
                              @scroll.passive="handleScroll"
                              ref="scrollWrapper">
    <slot></slot>
  </div>
</template>

<script>
  import { realpx } from '../../utils/book'
  export default {
    name: 'scroll',
    props: {
      top: {
        type: Number,
        default: 0
      },
      bottom: {
        type: Number,
        default: 0
      },
      ifNoScroll: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleScroll(e) {
        const offsetY = e.target.scrollTop || window.pageYOffset || document.body.scrollTop
        this.$emit('onScroll', offsetY)
      },
      scrollTo(x, y) {
        this.$refs.scrollWrapper.scrollTo(x, y)
      },
      refresh() {
        if (this.$refs.scrollWrapper) {
          this.$refs.scrollWrapper.style.height = window.innerHeight - realpx(this.top) - realpx(this.bottom) + 'px'
          this.$refs.scrollWrapper.addEventListener('scroll', this.handleScroll)
        }
      }
    },
    mounted () {
      this.refresh()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .scroll-wrapper{
    position: relative;
    z-index: 100;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch; // 防移动段滑动卡顿
   &::-webkit-scrollbar{
     display: none;
   }
   &.no-scroll {
     overflow: hidden;
   }
  }
</style>
