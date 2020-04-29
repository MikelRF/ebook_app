<!--图书界面-->
<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="mask"
         @click="onMaskClick"
         @touchmove="moveStart"
         @touchend="moveEnd"
         @mousedown.left="onMouseEnter"
         @mousemove.left="onMouseMove"
         @mouseup.left="onMouseEnd"></div>
  </div>
</template>

<script>
  import { ebookMixin, userMixin } from '../../utils/mixin'
  import { flatten } from '../../utils/book'
  import {
    getTheme,
    saveTheme,
    // saveMetadata,
    getLocation,
    getFontFamily,
    saveFontFamily,
    getFontSize,
    saveFontSize
  } from '../../utils/LocalStorage'
  import Epub from 'epubjs'
  import { getLocalForage } from '../../utils/localForage'

  global.epub = Epub
  export default {
    name: 'ebookReader',
    mixins: [ebookMixin, userMixin],
    methods: {
      // 1 - 鼠标进入
      // 2 - 鼠标进入后的移动
      // 3 - 鼠标从移动状态松手
      // 4 - 鼠标还原
      // 鼠标结束
      onMouseEnd (e) {
        if (this.mouseState === 2) { // 鼠标移动后结束，完成下拉操作
          this.setOffsetY(0) // 还原偏移量
          this.firstOffsetY = null
          this.mouseState = 3 // 状态3
        } else {
          this.mouseState = 4 // 鼠标只点击，没有移动跳到状态4
        }
        const time = e.timeStamp - this.mouseStartTime
        if (time < 100) {
          this.mouseState = 4 // 只有短暂移动不算
        }
        e.preventDefault()
        e.stopPropagation()
      },
      // 鼠标移动， 只要移动就会触发
      onMouseMove (e) {
        if (this.mouseState === 1) { // 进入状态1后才开始记录偏移量
          this.mouseState = 2
        } else if (this.mouseState === 2) {
          let offsetY = 0
          if (this.firstOffsetY) {
            offsetY = e.clientY - this.firstOffsetY
            this.setOffsetY(offsetY)
          } else {
            this.firstOffsetY = e.clientY
          }
        }
        e.preventDefault()
        e.stopPropagation()
      },
      // 鼠标点击
      onMouseEnter (e) {
        this.mouseState = 1 // 状态1
        this.mouseStartTime = e.timeStamp
        e.preventDefault()
        e.stopPropagation()
      },
      // 点击屏幕切换页面
      onMaskClick (e) {
        // 鼠标移动操作时不触发翻页时间，除非为状态4
        if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
          return
        }
        const offsetX = e.offsetX
        const width = window.innerWidth
        if (offsetX > 0 && offsetX < width * 0.3) {
          this.prevPage()
        } else if (offsetX > 0 && offsetX > width * 0.7) {
          this.nextPage()
        } else {
          this.showTitleAndMenu()
        }
      },
      // 触屏
      moveStart (e) {
        let offsetY = 0 // 下拉偏移量
        if (this.firstOffsetY) {
          // 拖动终点
          offsetY = e.changedTouches[0].clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          // 拖动起点
          this.firstOffsetY = e.changedTouches[0].clientY
        }
        e.preventDefault() // 浏览器不要执行与事件关联的默认动作
        e.stopPropagation() // 组织传播
      },
      // 脱手
      moveEnd (e) {
        this.firstOffsetY = null
        this.setOffsetY(0)
      },
      // 上一页
      prevPage () {
        if (this.rendition) {
          this.rendition.prev().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      // 下一页
      nextPage () {
        if (this.rendition) {
          this.rendition.next().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      // 显示标题,菜单
      showTitleAndMenu () {
        // this.$store.dispatch('setMenuVisible', !this.menuVisible)
        this.setMenuVisible(!this.menuVisible)
        if (!this.MenuVisible) { // 不显示菜单栏，把字号设置隐藏
          this.setSettingVisible(-1)
          this.setFontFamilyVisible(false)
        }
      },
      // 初始缓存字号
      initFontSize () {
        let fontSize = getFontSize(this.userStorage)
        // 无缓存
        if (!fontSize) {
          fontSize = 16
          saveFontSize(this.userStorage, fontSize)
        } else {
          this.rendition.themes.fontSize(fontSize)
          this.setDefaultFontSize(fontSize)
        }
        return fontSize
      },
      // 初始缓存字体
      initFontFamily () {
        let font = getFontFamily(this.userStorage)
        if (!font) {
          font = 'Default'
          saveFontFamily(this.userStorage, font)
        } else {
          this.rendition.themes.font(font)
          this.setDefaultFontFamily(font)
        }
        return font
      },
      // 初始缓存主题
      initTheme () {
        let defaultTheme = getTheme(this.userStorage)
        // 无缓存
        if (defaultTheme == null) {
          defaultTheme = this.themeList[0].name // 取默认样式
          saveTheme(this.userStorage, defaultTheme) // 缓存
        }
        this.setDefaultTheme(defaultTheme)
        this.themeList.forEach(theme => { // 注册所有主题样式
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme) // 渲染主题
        this.initGlobalTheme() // 初始化缓存中当前电子书全局主题
      },
      // 初始化渲染电子书
      initRendition () {
        // 渲染位置
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default' // 与微信兼容
        })
        // 初始电子书加载字体
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`)
          ])
        })
        const location = getLocation(this.userStorage) // 获取阅读进度
        // 异步显示电子书
        this.myDisplay(location, () => {
          this.initTheme() // 初始化缓存中当前电子书主题
          this.initFontSize() // 初始化缓存中当前电子书字号
          this.initFontFamily() // 初始化缓存中当前电子书字号
        })
      },
      // 手势操作
      initGesture () {
        // 点击前
        this.rendition.on('touchstart', event => {
          this.touchStartX = event.changedTouches[0].clientX
          this.touchStartTime = event.timeStamp
        })
        // 点击后
        this.rendition.on('touchend', event => {
          const offsetX = event.changedTouches[0].clientX - this.touchStartX
          const time = event.timeStamp - this.touchStartTime
          if (time < 500 && offsetX > 40) {
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            this.nextPage()
          } else {
            this.showTitleAndMenu()
          }
          event.preventDefault()
          event.stopPropagation()
        })
      },
      // 获取图书封面，作者等
      parseBook () {
        this.book.loaded.cover.then(cover => {
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url)
          })
        })
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
        })
        this.book.loaded.navigation.then(nav => {
          const navItem = flatten(nav.toc) // 拆分为一维数组
          // 设置层级
          function setLevel (item, level = 0) {
            return !item.parent ? level : setLevel(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
          }

          navItem.forEach(item => {
            item.level = setLevel(item)
          })
          this.setNavigation(navItem)
          // console.log(navItem)
        })
      },
      // 初始化电子书
      initEpub (url) {
        this.book = new Epub(url)
        console.log(this.book)
        this.setCurrentBook(this.book)
        this.initRendition() // 渲染电子书
        // this.initGesture() // 手势操作
        this.parseBook() // 获取图书封面，作者等
        // 电子书全部加载完毕后电子书按字数分页，基值为每页750字， 受屏幕大小，字体大小因素进行分页
        this.book.ready.then(() => {
          // 一页基准750 * 屏幕比例 * 以16为基准的文字比例
          return this.book.locations.generate(750 * (window.innerWidth / 375) *
            (getFontSize(this.userStorage) / 16)).then(() => {
            this.refreshLocation() // 刷新页面
            this.setBookAvailable(true) // 状态设置
          })
        })
      },
      // 详情页点击目录，跳转指定目录
      jumpToNav() {
        this.item = this.$route.query.item
        if (this.item && this.item.href && this.item.label) {
          this.myDisplay(this.item.href)
        }
      }
    },
    mounted () {
      const fileName = this.$route.params.fileName.split('|').join('/')
      this.setFileName(fileName)
      // const fileName = books[1]
      // this.setUserName(sessionStorage.getItem('userName'))
      const book = this.$route.params.fileName.split('|')[1]
      this.setUserStorage(sessionStorage.getItem('userName') + '/' + book)
      // 先从本地数据库中找是否有缓存数据
      // console.log(this.userStorage)
      getLocalForage(this.userStorage, (err, blob) => {
        if (!err && blob) {
          // 找到离线缓存电子书
            this.initEpub(blob)
            this.jumpToNav()
        } else {
          // 通过网络访问
          const url = process.env.VUE_APP_RES_EPUB_URL + '/' + this.fileName + '.epub'
            this.initEpub(url)
            this.jumpToNav()
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .mask {
      width: 100%;
      height: 100%;
      z-index: 150;
      top: 0;
      left: 0;
      position: absolute;
    }
  }
</style>
