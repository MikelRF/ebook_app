<!--书本菜单栏-->
<template>
  <div>
    <transition name="slide-up">
      <div class="menu-wrapper" v-show="menuVisible" :class="{'hide-box-shadow': !menuVisible || settingVisible >= 0}">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
  </div>
</template>

<script>
  import ebookSettingFont from './ebookSettingFont'
  import ebookSettingFontPopup from './ebookSettingFontPopup'
  import ebookSettingTheme from './ebookSettingTheme'
  import ebookSettingProgress from './ebookSettingProgress'
  import { ebookMixin } from '../../utils/mixin'
  export default {
    name: 'ebookMenu',
    mixins: [ebookMixin],
    components: {
      ebookSettingFont,
      ebookSettingFontPopup,
      ebookSettingTheme,
      ebookSettingProgress
    },
    methods: {
      showSetting (key) {
        this.setSettingVisible(key)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .menu-wrapper{
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 200;  /* 最上层 */
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8)  rgba(0, 0, 0, .15);
    font-size: px2rem(25);
    &.hide-box-shadow {
      box-shadow: none;
      height: px2rem(49);
    }
    .icon-wrapper{
      flex: 1;
      @include center;
      .icon-bright, .icon-A{
        font-size: px2rem(20);
      }
    }
  }
</style>
