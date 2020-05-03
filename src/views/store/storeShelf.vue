<template>
  <div class="store-shelf">
    <router-view></router-view>
    <shelf-title :title="'书架'" :parentName="'storeShelf'"></shelf-title>
    <scroll class="store-shelf-scroll-wrapper"
            :bottom="scrollBottom"
            @onScroll="onScroll"
            ref="scroll">
      <shelf-list :data="shelfList"></shelf-list>
    </scroll>
    <transition name="slide-up">
      <div class="exit-wrapper" @click="exit" v-show="!isEditMode">
        <div class="exit">注销</div>
      </div>
    </transition>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
  import shelfTitle from '../../components/shelf/shelfTitle'
  import Scroll from '../../components/common/scroll'
  import { shelfMixin } from '../../utils/mixin'
  import ShelfFooter from '../../components/shelf/shelfFooter'
  import ShelfList from '../../components/shelf/shelfList'

  export default {
    name: 'storeShelf',
    mixins: [shelfMixin],
    components: {
      ShelfFooter,
      ShelfList,
      Scroll,
      shelfTitle
    },
    watch: {
      // 监听编辑模式，编辑模式下滚动条距底部需要产生48像素的距离
      isEditMode (isEditMode) {
        // $nextTick 等待界面变化完成后刷新滚动条
        this.scrollBottom = isEditMode ? 50 : 40
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    },
    data () {
      return {
        scrollBottom: 40
      }
    },
    methods: {
      // 滚动页面的监听事件，ShelfTitle和ShelfSearch组件会进行监听
      onScroll (offsetY) {
        this.setOffsetY(offsetY)
      },
      exit () {
        sessionStorage.setItem('userName', '')
        sessionStorage.setItem('isLogin', '')
        this.$router.push({
          path: '/login'
        })
      }
    },
    mounted () {
      // 获取书架列表数据
      this.getShelfList()
      // 初始化书架分类数据
      this.setShelfCategory([])
      // 设置vuex的currentType为1，表示当前位于书架，影响ShelfTitle状态
      this.setCurrentType(1)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .store-shelf {
    position: relative;
    z-index: 100;
    height: 100%;
    width: 100%;
    background: white;

    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
    }

    .exit-wrapper {
      position: absolute;
      bottom: 0;
      z-index: 102;
      background: indianred;
      width: 100%;
      height: px2rem(40);
      @include center;

      .exit {
        font-size: px2rem(18);
        color: white;
      }
    }
  }
</style>
