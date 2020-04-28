<template>
  <div class="store-shelf">
    <shelf-title :title="shelfCategory.title" :parentName="'storeShelfCategory'"></shelf-title>
    <scroll class="store-shelf-scroll-wrapper"
            :top="0"
            :bottom="scrollBottom"
            @onScroll="onScroll"
            ref="scroll"
            v-if="ifShowList">
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
    </scroll>
    <div class="store-shelf-empty-view" v-else>
      <span>当前分类还没有图书</span>
    </div>
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
    name: 'storeShelfCategory',
    mixins: [shelfMixin],
    components: {
      ShelfFooter,
      ShelfList,
      Scroll,
      shelfTitle
    },
    computed: {
      ifShowList () {
        return this.shelfCategory.itemList &&
          this.shelfCategory.itemList.length > 0
      }
    },
    watch: {
      // 监听编辑模式，编辑模式下滚动条距底部需要产生48像素的距离
      isEditMode (isEditMode) {
        this.scrollBottom = isEditMode ? 48 : 0
        // $nextTick 等待界面变化完成后刷新滚动条
        if (this.ifShowList) {
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
          })
        }
      }
    },
    data () {
      return {
        scrollBottom: 0
      }
    },
    methods: {
      // 滚动页面的监听事件，ShelfTitle和ShelfSearch组件会进行监听
      onScroll (offsetY) {
        this.setOffsetY(offsetY)
      }
    },
    mounted () {
      // 获取分类列表数据
      this.getCategoryList(this.$route.query.title)
      // 标记currentType为2，对于不同的currentType，ShelfTitle将呈现不同状态
      this.setCurrentType(2)
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

    .store-shelf-empty-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: px2rem(16);
      color: #333;
      @include center;
    }
  }
</style>
