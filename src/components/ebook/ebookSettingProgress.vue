<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper">
            <span class="icon-back" @click="prevSection()"></span>
          </div>
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 @input="onProgressInput($event.target.value)"
                 @change="onProgressChange($event.target.value)"
                 :value="progress"
                 :disabled="!bookAvailable"
                 ref="progress">
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span class="progress-text">({{bookAvailable ? progress + '%' : '加载中...'}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { saveProgress } from '../../utils/localStorage'
  export default {
    name: 'ebookSettingProgress',
    mixins: [ebookMixin],
    methods: {
      // 上一章
      prevSection() {
        if (this.section > 0 && this.bookAvailable) {
          this.setSection(this.section - 1).then(() => {
            this.displaySection(() => {
            })
          })
        }
      },
      // 下一章
      nextSection() {
        if (this.currentBook.spine.length - 1 > this.section && this.bookAvailable) {
          // this.isProgressLoading = true
          this.setSection(this.section + 1).then(() => {
            this.displaySection(() => {
              // this.isProgressLoading = false
            })
          })
        }
      },
      // 切换章节
      displaySection() {
        const sectionInfo = this.currentBook.section(this.section) // 获取当前章节的数据
        if (sectionInfo && sectionInfo.href) {
          // 渲染
          this.myDisplay(sectionInfo.href)
        }
      },
      // 拖动进度条的同时改变下方进度显示
      onProgressInput(progress) {
        this.setProgress(progress)
      },
      // 拖动进度条后渲染电子书
      onProgressChange(progress) {
        // 保存进度条
        this.setProgress(progress).then(() => {
          this.displayProgress() // 显示指定位置的文章内容
        })
        saveProgress(this.fileName, progress)
      },
      // 拖进度条显示指定位置
      displayProgress() {
        // 获取分页对象
        const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
        // 渲染
        this.myDisplay(cfi)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 190;
    width: 100%;
    height: px2rem(65);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .progress {
          flex: 1;
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          margin: 0 px2rem(10);
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: #ceced0;
            box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, .15);
            border: none;
          }
        }
        .progress-icon-wrapper {
          flex: 0 0 px2rem(22);
          font-size: px2rem(20);
          @include center;
        }
      }
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(5);
        width: 100%;
        font-size: px2rem(12);
        text-align: center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        @include center;
        .progress-section-text {
          line-height: px2rem(15);
          @include ellipsis;
        }
      }
    }
  }
</style>
