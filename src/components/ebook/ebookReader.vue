<!--图书界面-->
<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import {
    getTheme,
    saveTheme,
    // saveMetadata,
    // getLocation,
    getFontFamily,
    saveFontFamily,
    getFontSize,
    saveFontSize
  } from '../../utils/localStorage'
  import Epub from 'epubjs'
  global.epub = Epub
  export default {
    name: 'ebookReader',
    mixins: [ebookMixin],
    methods: {
      // 上一页
      prevPage () {
        if (this.rendition) { // 书籍对象是否存在
          this.rendition.prev()
          this.hideTitleAndMenu()
        }
      },
      // 下一页
      nextPage () {
        if (this.rendition) { // 书籍对象是否存在
          this.rendition.next() // 下一页
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
      // 隐藏标题,菜单
      hideTitleAndMenu () {
        // this.$store.dispatch('setMenuVisible', false)
        this.setMenuVisible(false)
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      },
      // 初始缓存字号
      initFontSize() {
        let fontSize = getFontSize(this.fileName)
        // 无缓存
        if (!fontSize) {
          fontSize = 16
          saveFontSize(this.fileName, fontSize)
        } else {
          this.rendition.themes.fontSize(fontSize)
          this.setDefaultFontSize(fontSize)
        }
        return fontSize
      },
      // 初始缓存字体
      initFontFamily() {
        let font = getFontFamily(this.fileName)
        if (!font) {
          font = 'Default'
          saveFontFamily(this.fileName, font)
        } else {
          this.rendition.themes.font(font)
          this.setDefaultFontFamily(font)
        }
        return font
      },
      // 初始缓存主题
      initTheme() {
        let defaultTheme = getTheme(this.fileName)
        // 无缓存
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name // 取默认样式
          this.setDefaultTheme(defaultTheme)
          saveTheme(this.fileName, defaultTheme) // 缓存
        }
        this.themeList.forEach(theme => { // 注册所有主题样式
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme) // 渲染主题
      },
      // 初始化电子书
      initEpub () {
        const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub'
        this.book = new Epub(url)
        this.setCurrentBook(this.book)
        // 渲染电子书
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default' // 与微信兼容
        })
        this.rendition.display().then(() => {
          this.initGlobalTheme() // 初始化缓存中当前电子书全局主题
          this.initTheme() // 初始化缓存中当前电子书主题
          this.initFontSize() // 初始化缓存中当前电子书字号
          this.initFontFamily() // 初始化缓存中当前电子书字号
        })
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
          // event.preventDefault()
          // event.stopPropagation()
        })
        // 初始电子书加载字体
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`)
          ]).then(() => {
            console.log('字体加载完毕')
          })
        })
      }
    },
    mounted () {
      const fileName = this.$route.params.fileName.split('|').join('/')
      this.setFileName(fileName).then(() => {
        this.initEpub()
      })
    }
  }
</script>

<style scoped>

</style>
