<template>
  <div class="ebook-slide-bookmark">
    <div class="slide-bookmark-title">
      <div class="slide-bookmark">
        <span>书签 · {{bookmark ? bookmark.length : 0}}</span>
      </div>
<!--      <div class="delete-bookmark">-->
<!--        <span @click="isDeleteBookmark()">删除</span>-->
<!--      </div>-->
    </div>
    <scroll class="slide-bookmark-list" :top="48" :bottom="48">
      <div class="slide-bookmark-item" v-for="(item, index) in bookmark" :key="index"
           @click="displayBookmark(item.cfi)">
        <div class="slide-bookmark-item-icon">
          <div class="icon-bookmark"></div>
        </div>
        <span class="slide-bookmark-item-text">{{item.text}}</span>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import scroll from '../common/scroll'
  import { getBookmark } from '../../utils/LocalStorage'
  import { ebookMixin, userMixin } from '../../utils/mixin'

  export default {
    mixins: [ebookMixin, userMixin],
    components: {
      scroll
    },
    data() {
      return {
        bookmark: null
      }
    },
    methods: {
      // 跳转书签
      displayBookmark(target) {
        this.myDisplay(target, () => {
          this.hideTitleAndMenu()
        })
      }
    },
    mounted() {
      this.bookmark = getBookmark(this.userStorage)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-slide-bookmark {
    width: 100%;
    .slide-bookmark-title {
      display: flex;
      @include left;
      width: 100%;
      height: px2rem(48);
      font-size: px2rem(14);
      font-weight: bold;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      slide-bookmark{
      }
      .delete-bookmark{
         flex: 1;
         display: flex;
         justify-content: flex-end;
       }
    }
    .slide-bookmark-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-bookmark-item {
        display: flex;
        padding: px2rem(15) 0;
        box-sizing: border-box;
        .slide-bookmark-item-icon {
          flex: 0 0 px2rem(29);
          @include left;
          .icon-bookmark {
            width: px2rem(20);
            height: px2rem(20);
            font-size: px2rem(12);
            border-radius: 50%;
            background: #bbb;
            @include center;
          }
        }
        .slide-bookmark-item-text {
          font-size: px2rem(14);
          line-height: px2rem(15);
          max-height: px2rem(45);
          @include ellipsis2(3);
        }
        .icon-close {
          font-size: px2rem(22);
          padding-left: px2rem(5);
          @include center
        }
      }
    }
  }
</style>
