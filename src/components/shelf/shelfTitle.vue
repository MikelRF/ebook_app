<template>
  <transition name="fade">
    <div class="shelf-title" :class="{'hide-shadow': ifHideShadow}" v-show="shelfTitleVisible">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">书城</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left">
        <span class="shelf-title-btn-text" @click="clearCache">清空缓存</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-right">
        <span class="shelf-title-btn-text"
              @click="onEditClick">{{isEditMode ? '取消' : '编辑'}}</span>
      </div>
      <!--      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showBack">-->
      <!--        <span class="icon-back" @click="back"></span>-->
      <!--      </div>-->
      <!--      <div class="shelf-title-btn-wrapper"-->
      <!--           :class="{'shelf-title-left': changeGroupLeft, 'shelf-title-right': changeGroupRight}" @click="changeGroup"-->
      <!--           v-if="showChangeGroup">-->
      <!--        <span class="shelf-title-btn-text">修改分组</span>-->
      <!--      </div>-->
    </div>
  </transition>
</template>

<script>
  import { shelfMixin } from '../../utils/mixin'

  export default {
    name: 'shelfTitle',
    mixins: [shelfMixin],
    props: {
      title: String
    },
    watch: {
      offsetY (offsetY) {
        if (offsetY > 0) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    data () {
      return {
        ifHideShadow: true
      }
    },
    methods: {
      onEditClick () {
        if (!this.isEditMode) { // 非编辑模式
          this.setShelfSelected([]) // 清空选中图书及状态
          this.shelfList.forEach(item => {
            item.selected = false
          })
        }
        this.setIsEditMode(!this.isEditMode)
      },
      clearCache () {
        console.log('clearCache')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-title {
    position: relative;
    z-index: 130;
    width: 100%;
    height: px2rem(42);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);

    &.hide-shadow {
      box-shadow: none;
    }

    .shelf-title-text-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;

      .shelf-title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }
    }

    .shelf-title-btn-wrapper {
      position: absolute;
      top: 0;
      box-sizing: border-box;
      height: 100%;
      @include center;

      .shelf-title-btn-text {
        font-size: px2rem(14);
        color: #666;
      }

      .icon-back {
        font-size: px2rem(20);
        color: #666;
      }

      &.shelf-title-left {
        left: 0;
        padding-left: px2rem(15);
      }

      &.shelf-title-right {
        right: 0;
        padding-right: px2rem(15);
      }
    }
  }
</style>
