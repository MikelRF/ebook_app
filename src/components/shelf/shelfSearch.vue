<template>
  <div class="shelf-search-wrapper" :class="{'search-top': isInputClick, 'hide-shadow': ifHideShadow}">
    <div class="shelf-search" :class="{'search-top': isInputClick}">
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <div class="icon-search icon"></div>
        </div>
        <div class="search-input-wrapper">
          <input class="search-input"
                 type="text"
                 placeholder="搜索"
                 @click="onSearchClick"
                 @keyup.enter="search"
                 v-model="searchText">
        </div>
        <div class="icon-clear-wrapper"
             @click="clearSearchText"
             v-show="searchText.length > 0">
          <span class="icon-close-circle-fill"></span>
        </div>
      </div>
      <div class="icon-blank-wrapper" v-if="!isInputClick"></div>
      <div class="cancel-btn-wrapper"
           @click="onCancelClick" v-else>
        <span class="cancel-text">取消</span>
      </div>
    </div>
    <transition name="shelf-tab-slide-up">
      <div class="shelf-search-tab-wrapper" v-if="isInputClick">
        <div class="shelf-search-tab-item" v-for="item in tabs" :key="item.id" @click="onTabClick(item.id)">
          <span class="shelf-search-tab-text" :class="{'is-selected': item.id === selectedTab}">{{item.text}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { shelfMixin } from '../../utils/mixin'

  export default {
    mixins: [shelfMixin],
    name: 'shelfSearch',
    computed: {
      tabs () {
        return [
          {
            id: 1,
            text: '默认'
          },
          {
            id: 2,
            text: '按进度'
          },
          {
            id: 3,
            text: '按购买'
          }
        ]
      }
    },
    watch: {
      offsetY (offsetY) {
        if (offsetY > 0 && this.isInputClick) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    data () {
      return {
        isInputClick: false,
        ifHideShadow: true,
        searchText: '',
        selectedTab: 1
      }
    },
    methods: {
      search() {
      },
      clearSearchText () {
        this.searchText = ''
      },
      onSearchClick () {
        this.isInputClick = true
        this.setShelfTitleVisible(false)
      },
      onCancelClick () {
        this.isInputClick = false
        this.setShelfTitleVisible(true)
      },
      onTabClick (id) {
        this.selectedTab = id
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .shelf-search-wrapper {
    position: relative;
    z-index: 105;
    width: 100%;
    height: px2rem(64);
    font-size: px2rem(16);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);

    &.hide-shadow {
      box-shadow: none;
    }

    &.search-top {
      position: fixed;
      left: 0;
      top: 0;
    }

    .shelf-search {
      position: absolute;
      top: px2rem(42);
      left: 0;
      z-index: 105;
      width: 100%;
      height: px2rem(52);
      display: flex;
      transition: top .15s linear;

      &.search-top {
        top: 0;
      }

      .search-wrapper {
        flex: 1;
        display: flex;
        margin: px2rem(8) 0 px2rem(8) px2rem(10);
        border: px2rem(1) solid #ccc;
        border-radius: px2rem(3);

        .icon-search-wrapper {
          flex: 0 0 px2rem(22);
          @include right.icon-search {
            font-size: px2rem(12);
          }
        }

        .search-input-wrapper {
          @include center;
          flex: 1;
          padding: 0 px2rem(10);
          box-sizing: border-box;

          .search-input {
            width: 100%;
            font-size: px2rem(14);
            border: none;
            color: #333;

            &:focus {
              outline: none;
            }

            &::-webkit-input-placeholder {
              font-size: px2rem(14);
              color: #ccc;
            }
          }
        }

        .icon-clear-wrapper {
          flex: 0 0 px2rem(24);
          @include left;

          .icon-close-circle-fill {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }

      .icon-blank-wrapper {
        flex: 0 0 px2rem(10);
      }

      .cancel-btn-wrapper {
        flex: 0 0 px2rem(50);
        @include center;

        .cancel-text {
          font-size: px2rem(14);
          color: $color-blue;
        }
      }
    }

    .shelf-search-tab-wrapper {
      position: absolute;
      top: px2rem(52);
      left: 0;
      z-index: 105;
      display: flex;
      width: 100%;
      height: px2rem(42);

      .shelf-search-tab-item {
        flex: 1;
        @include center;

        .shelf-search-tab-text {
          font-size: px2rem(12);
          color: #999;

          &.is-selected {
            color: $color-blue;
          }
        }
      }
    }
  }
</style>
