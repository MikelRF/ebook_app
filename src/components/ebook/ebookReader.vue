<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Epub from 'epubjs'
  global.epub = Epub
  export default {
    name: 'ebookReader',
    computed: {
      ...mapGetters(['fileName'])
    },
    methods: {
      prevPage () {
        if (this.rendition) { // 书籍对象是否存在
          this.rendition.prev() // 上一页
        }
      },
      nextPage () {
        if (this.rendition) { // 书籍对象是否存在
          this.rendition.next() // 下一页
        }
      },
      showTitleAndMenu () {
      },
      // 初始化电子书
      initEpub () {
        const url = 'http://localhost:81/epub/' + this.fileName + '.epub'
        this.book = new Epub(url)
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default' // 与微信兼容
        })
        this.rendition.display()
        this.rendition.on('touchstart', event => {
          this.touchStartX = event.changedTouches[0].clientX
          this.touchStartTime = event.timeStamp
        }, { passive: false }
        )
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
        }, { passive: false })
      }
    },
    mounted () {
      const fileName = this.$route.params.fileName.split('|').join('/')
      this.$store.dispatch('setFileName', fileName).then(() => {
        this.initEpub()
      })
    }
  }
</script>

<style scoped>

</style>
