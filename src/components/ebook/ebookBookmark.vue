<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <book-mark :color="color" :width="15" :height="35"></book-mark>
    </div>
  </div>
</template>

<script>
  import { realpx } from '../../utils/book'
  import bookMark from '../common/bookMark'
  import { ebookMixin, userMixin } from '../../utils/mixin'
  import { getBookmark, saveBookmark } from '../../utils/LocalStorage'

  const BLUE = '#346cbc'
  const WHITE = '#fff'
  export default {
    mixins: [ebookMixin, userMixin],
    components: {
      bookMark
    },
    computed: {
      height() {
        return realpx(35)
      },
      threshold() {
        return realpx(55)
      },
      fixedStyle() {
        return {
          position: 'fixed',
          top: 0,
          right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
        }
      }
    },
    watch: {
      offsetY(v) {
        // 书籍为加载成功，菜单弹出时， 设置选项弹出时不做操作
        if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
          return
        }
        // height = 35px  threshold = 55px
        if (v >= this.height && v < this.threshold) {
          this.beforeThreshold(v)
        } else if (v >= this.threshold) {
          this.afterThreshold(v)
        } else if (v > 0 && v < this.height) {
          this.beforeHeight()
        } else if (v === 0) {
          this.restore()
        }
      },
      isBookmark(isBookmark) {
        this.isFixed = isBookmark
        if (isBookmark) {
          this.color = BLUE
        } else {
          this.color = WHITE
        }
      }
    },
    data() {
      return {
        text: '',
        color: WHITE,
        isFixed: false
      }
    },
    methods: {
      // 添加书签
      addBookmark() {
        // 获取缓存中的书签
        this.bookmark = getBookmark(this.userStorage)
        if (!this.bookmark) {
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
        const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfirange = `${cfibase}!,${cfistart},${cfiend})`
        this.currentBook.getRange(cfirange).then(range => {
          // 清理格式
          const text = range.toString().replace(/\s\s/g, '')
          this.bookmark.push({
            cfi: currentLocation.start.cfi,
            text: text
          })
          saveBookmark(this.userStorage, this.bookmark) // 缓存
        })
      },
      // 删除书签
      removeBookmark() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        this.bookmark = getBookmark(this.userStorage)
        if (this.bookmark) {
          saveBookmark(this.userStorage, this.bookmark.filter(item => item.cfi !== cfi))
          this.setIsBookmark(false)
        }
      },
      restore() {
        // 状态4：归位
        setTimeout(() => {
          this.$refs.bookmark.style.top = `${-this.height}px`
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
        }, 200)
        if (this.isFixed) {
          this.setIsBookmark(true)
          this.addBookmark()
        } else {
          this.setIsBookmark(false)
          this.removeBookmark()
        }
      },
      beforeHeight() {
        // 状态1：未超过书签的高度
        if (this.isBookmark) {
          this.text = '下拉删除书签'
          this.color = BLUE
          this.isFixed = true
        } else {
          this.text = '下拉添加书签'
          this.color = WHITE
          this.isFixed = false
        }
      },
      beforeThreshold(v) {
        // 状态2：未到达零界状态
        this.$refs.bookmark.style.top = `${-v}px`
        this.beforeHeight()
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = 'rotate(0deg)'
        }
      },
      afterThreshold(v) {
        // 状态3：超越零界状态
        this.$refs.bookmark.style.top = `${-v}px`
        if (this.isBookmark) {
          this.text = '释放删除书签'
          this.color = WHITE
          this.isFixed = false
        } else {
          this.text = '释放添加书签'
          this.color = BLUE
          this.isFixed = true
        }
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === '' ||
          iconDown.style.transform === 'rotate(0deg)') {
          iconDown.style.transform = 'rotate(180deg)'
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>
