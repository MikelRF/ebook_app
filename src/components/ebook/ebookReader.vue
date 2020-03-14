<!--图书界面-->
<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Epub from 'epubjs'
  global.epub = Epub
  export default {
    name: 'ebookReader',
    mixins: [ebookMixin],
    methods: {
      prevPage () {
        if (this.rendition) { // 书籍对象是否存在
          this.rendition.prev() // 上一页
          this.hideTitleAndMenu()
        }
      },
      nextPage () {
        if (this.rendition) { // 书籍对象是否存在
          this.rendition.next() // 下一页
          this.hideTitleAndMenu()
        }
      },
      showTitleAndMenu () {
        // this.$store.dispatch('setMenuVisible', !this.menuVisible)
        this.setMenuVisible(!this.menuVisible)
        if (!this.MenuVisible) { // 不显示菜单栏，把字号设置隐藏
          this.setSettingVisible(-1)
          this.setFontFamilyVisible(false)
        }
      },
      hideTitleAndMenu () {
        // this.$store.dispatch('setMenuVisible', false)
        this.setMenuVisible(false)
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      },
      // 初始化电子书
      initEpub () {
        const url = 'http://localhost:81/epub/' + this.fileName + '.epub'
        this.book = new Epub(url)
        this.setCurrentBook(this.book)
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default' // 与微信兼容
        })
        this.rendition.display()
        this.rendition.on('touchstart', event => {
          this.touchStartX = event.changedTouches[0].clientX
          this.touchStartTime = event.timeStamp
        })
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
        // this.rendition.hooks.content.register(contents => {
        //     contents.addStylesheet('http://192.168.3.2:81/fonts/daysOne.css')
        //     contents.addStylesheet('http://192.168.3.2:81/fonts/cabin.css')
        //     contents.addStylesheet('http://192.168.3.2:81/fonts/tangerine.css')
        //     contents.addStylesheet('http://192.168.3.2:81/fonts/montserrat.css')
        // })
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
      // this.$store.dispatch('setFileName', fileName).then(() => {
      //   this.initEpub()
      // })
      this.setFileName(fileName).then(() => {
        this.initEpub()
      })
    }
  }
</script>

<style scoped>

</style>
