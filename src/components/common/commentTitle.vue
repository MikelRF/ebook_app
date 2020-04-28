<template>
  <div class="comment-title-wrapper"  :class="{'hide-shadow': ifHideShadow}">
    <div class="comment-title-back-wrapper">
      <div class="icon-back" @click="back"></div>
    </div>
    <div class="comment-title-text-wrapper">
      <span class="comment-title-text">书评</span>
    </div>
  </div>
</template>

<script>
  import { backToUpLevel } from '../../utils/store'

  export default {
    name: 'commentTitle',
    data() {
      return {
        ifHideShadow: true
      }
    },
    methods: {
      back () {
        backToUpLevel(this)
      },
      showShadow() {
        this.ifHideShadow = false
      },
      hideShadow() {
        this.ifHideShadow = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .comment-title-wrapper {
    z-index: 2000;
    position: relative;
    display: flex;
    width: 100%;
    height: px2rem(42);
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    color: #666;
    &.hide-shadow {
      box-shadow: none;
    }
    .comment-title-back-wrapper {
      z-index: 600;
      flex: 1;
      position: relative;
      font-size: px2rem(20);
      margin-left: px2rem(15);
      @include left;
    }

    .comment-title-text-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: px2rem(42);
      font-size: px2rem(16);
      color: #333;
      @include center;
    }
  }
</style>
