<template>
    <transition name="fade">
      <div class="slide-content-wrapper" v-show="menuVisible && settingVisible === 3">
        <transition name="slide-right">
          <div class="content" v-if="settingVisible === 3">
            <div class="content-page-wrapper" v-if="bookAvailable">
              <div class="content-page">
                <component :is="currentTab === 1 ? catalog : bookmark"></component>
              </div>
              <div class="content-page-tab">
                <div class="content-page-tab-item"
                     :class="{'selected': currentTab === 1}"
                     @click="selectTab(1)">目录
                </div>
                <div class="content-page-tab-item"
                     :class="{'selected': currentTab === 2}"
                     @click="selectTab(2)">书签
                </div>
              </div>
            </div>
            <div class="content-empty" v-else>加载中...</div>
          </div>
        </transition>
          <div class="content-bg" @click="hideTitleAndMenu()"></div>
      </div>
    </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import ebookSlideContent from './ebookSlideContent'
  import ebookSlideBookmark from './ebookSlideBookmark'
  export default {
    name: 'ebookSlide',
    mixins: [ebookMixin],
    data() {
      return {
        currentTab: 1,
        catalog: ebookSlideContent,
        bookmark: ebookSlideBookmark
      }
    },
    methods: {
      selectTab(tab) {
        this.currentTab = tab
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .slide-content-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 300;
    display: flex;
    width: 100%;
    height: 100%;
    .content{
      flex: 0 0 85%;
      width: 85%;
      height: 100%;
      .content-page-wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .content-page{
          flex: 1;
          width: 100%;
          overflow: hidden;
        }
        .content-page-tab{
          display: flex;
          flex: 0 0 px2rem(48);
          width: 100%;
          height: px2rem(48);
          .content-page-tab-item{
            flex: 1;
            font-size: px2rem(14);
            @include center
          }
        }
      }
      .content-empty{
        width: 100%;
        height: 100%;
        @include center;
        font-size: px2rem(25);
      }
    }
    .content-bg{
      flex: 0 0 15%;
      width: 15%;
      height: 100%;
    }
  }
</style>
