<template>
  <div class="store-shelf">
    <shelf-title></shelf-title>
    <scroll class="store-shelf-scroll-wrapper"
            :top="0"
            :bottom="scrollBottom"
            @onScroll="onScroll"
            ref="scroll">
      <shelf-search></shelf-search>
      <shelf-list></shelf-list>
    </scroll>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
  import shelfTitle from '../../components/shelf/shelfTitle'
  import Scroll from '../../components/common/scroll'
  import ShelfSearch from '../../components/shelf/shelfSearch'
  import { shelfMixin } from '../../utils/mixin'
  import { shelf } from '../../api/store'
  import ShelfList from '../../components/shelf/shelfList'
  import { appendAddToShelf } from '../../utils/store'
  import ShelfFooter from '../../components/shelf/shelfFooter'

  export default {
    name: 'storeShelf',
    mixins: [shelfMixin],
    components: {
      ShelfFooter,
      ShelfList,
      ShelfSearch,
      Scroll,
      shelfTitle
    },
    watch: {
      // 监听编辑模式，编辑模式下滚动条距底部需要产生48像素的距离
      isEditMode (isEditMode) {
        this.scrollBottom = isEditMode ? 48 : 0
        // $nextTick 等待界面变化完成后刷新滚动条
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
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
      },
      getShelfList () {
        shelf().then(response => {
          if (response.status === 200 && response.data && response.data.bookList) {
            const bookList = response.data.bookList // 获取所有书架图书
            this.setShelfList(appendAddToShelf(bookList)) // 在所有搜藏书架中最后一个加入“添加图书”
          }
        })
      }
    },
    mounted () {
      // 获取书架列表数据
      this.getShelfList()
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
  }
</style>
