<template>
  <div class="search-bar" :class="{'hide-title': !titleVisible, 'hide-shadow': shadowVisible}">
    <transition name="title-move">
      <div class="search-bar-title-wrapper" v-show="titleVisible">
        <div class="title-text-wrapper">
          <span class="title-text">书城</span>
        </div>
      </div>
    </transition>
    <div class="title-icon-back-wrapper" :class="{'hide-title': !titleVisible}" @click="back">
      <span class="icon-back"></span>
    </div>
    <div class="search-bar-input-wrapper" :class="{'hide-title': !titleVisible}">
      <div class="search-bar-blank" :class="{'hide-title': !titleVisible}"></div>
      <div class="search-bar-input">
        <div class="icon-search"></div>
        <input class="input"
               type="text" placeholder="计算机科学与软件工程"
               v-model="searchText"
               @click="search">
      </div>
    </div>
  </div>
</template>

<script>
  import { homeMixin } from '../../utils/mixin'

  export default {
    name: 'searchBar',
    mixins: [homeMixin],
    data () {
      return {
        searchText: '',
        titleVisible: true,
        shadowVisible: false
      }
    },
    watch: {
      offsetY (y) {
        if (y > 0) {
          this.hideShadow()
          this.hideTitle()
        } else {
          this.showTitle()
          this.showShadow()
        }
      }
    },
    methods: {
      hideTitle () {
        this.titleVisible = false
      },
      showTitle () {
        this.titleVisible = true
      },
      hideShadow () {
        this.shadowVisible = false
      },
      showShadow () {
        this.shadowVisible = true
      },
      search () {
        this.hideTitle()
      },
      back () {
        if (this.offsetY > 0) {
          this.hideTitle()
        } else {
          this.showTitle()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .search-bar {
    z-index: 150;
    position: relative;
    height: px2rem(94);
    width: 100%;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);

    &.hide-shadow {
      box-shadow: none;
    }

    &.hide-title {
      height: px2rem(52);
    }

    .search-bar-title-wrapper {
      position: absolute;
      width: 100%;
      height: px2rem(42);
      top: 0;
      left: 0;

      .title-text-wrapper {
        width: 100%;
        height: px2rem(42);
        @include center;

        .title-text {
          color: #666;
          font-size: px2rem(16);
        }
      }
    }

    .title-icon-back-wrapper {
      position: absolute;
      left: px2rem(15);
      top: 0;
      z-index: 200;
      height: px2rem(42);
      @include center;
      transition: height .2s linear;

      &.hide-title {
        height: px2rem(52);
      }

      .icon-back {
        color: #666;
        font-size: px2rem(16);
      }
    }

    .search-bar-input-wrapper {
      position: absolute;
      left: 0;
      display: flex;
      top: px2rem(42);
      width: 100%;
      height: px2rem(52);
      padding: px2rem(10);
      box-sizing: border-box;
      transition: top .2s linear;

      &.hide-title {
        top: 0;
      }

      .search-bar-blank {
        flex: 0 0 0;
        width: 0;
        transition: all .2s linear;

        &.hide-title {
          flex: 0 0 px2rem(31);
          width: px2rem(31);
        }
      }

      .search-bar-input {
        @include left;
        box-sizing: border-box;
        padding: px2rem(5) px2rem(15);
        width: 100%;
        background: #f4f4f4;
        border-radius: px2rem(20);
        border: px2rem(1) solid #eee;

        .icon-search {
          color: #999;
          font-size: px2rem(16);
        }

        .input {
          height: px2rem(22);
          width: 100%;
          background: transparent;
          border: none;
          margin-left: px2rem(10);
          font-size: px2rem(12);
          color: #666;

          &:focus {
            outline: none;
          }

          &::-webkit-input-placeholder {
            color: #ccc;
          }
        }
      }
    }
  }
</style>
