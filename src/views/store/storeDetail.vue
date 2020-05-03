<template>
  <div class="book-detail">
    <router-view></router-view>
    <detail-title @back="back"
                  :showShelf="true"
                  ref="title"></detail-title>
    <scroll class="content-wrapper"
            :top="42"
            :bottom="52"
            @onScroll="onScroll"
            ref="scroll">
      <book-info :cover="cover"
                 :title="title"
                 :author="author"
                 :desc="desc"
                 :currentScore="currentScore"></book-info>
      <commentCard :commentData="commentData"
                   :title="title"></commentCard>
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">版权</div>
        <div class="book-detail-content-list-wrapper">
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">出版商</div>
            <div class="book-detail-content-text">{{publisher}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">分类</div>
            <div class="book-detail-content-text">{{categoryText}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">语言</div>
            <div class="book-detail-content-text">{{lang}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">ISBN</div>
            <div class="book-detail-content-text">{{isbn}}</div>
          </div>
        </div>
      </div>
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">目录</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.navigation">
            <span class="loading-text">加载中...</span>
          </div>
          <div class="book-detail-content-item-wrapper">
            <div class="book-detail-content-item" v-for="(item, index) in flatNavigation" :key="index"
                 @click="read(item)">
              <div class="book-detail-content-navigation-text"
                   :class="{'is-sub': item.deep> 1}"
                   :style="itemStyle(item)"
                   v-if="item.label">{{item.label}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">试读</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.displayed">
            <span class="loading-text">加载中...</span>
          </div>
        </div>
        <div id="preview" v-show="this.displayed" ref="preview"></div>
      </div>
    </scroll>
    <div class="bottom-wrapper">
      <div class="bottom-btn" @click.stop.prevent="readBook()">阅读</div>
      <div class="bottom-btn" @click.stop.prevent="commentWrite()">写评论</div>
      <div class="bottom-btn" @click.stop.prevent="addOrRemoveShelf()">
        <!--        <span class="icon-check" v-if="inBookShelf"></span>-->
        {{inBookShelf ? '移出书架' : '加入书架'}}
      </div>
    </div>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script>
  import detailTitle from '../../components/detail/detailTitle'
  import bookInfo from '../../components/detail/bookInfo'
  import scroll from '../../components/common/scroll'
  import toast from '../../components/common/toast'
  import { addBookToShelf, removeBookFromShelf, getBookShelf, commentText, detail, getScore } from '../../api/store'
  import { px2rem, realpx } from '../../utils/book'
  import { backToUpLevel, appendAddToShelf } from '../../utils/store'
  import Epub from 'epubjs'
  import { shelfMixin } from '../../utils/mixin'
  import { getLocalForage } from '../../utils/localForage'
  import commentCard from '../../components/detail/commentCard'

  global.ePub = Epub

  export default {
    components: {
      commentCard,
      detailTitle,
      bookInfo,
      scroll,
      toast
    },
    activated () {
      location.reload()
    },
    mixins: [shelfMixin],
    computed: {
      desc () {
        if (this.description) {
          return this.description.substring(0, 100)
        } else {
          return ''
        }
      },
      flatNavigation () {
        if (this.navigation) {
          return Array.prototype.concat.apply([], Array.prototype.concat.apply([], this.doFlatNavigation(this.navigation.toc)))
        } else {
          return []
        }
      },
      lang () {
        return this.metadata ? this.metadata.language : '-'
      },
      isbn () {
        return this.metadata ? this.metadata.identifier : '-'
      },
      publisher () {
        return this.metadata ? this.metadata.publisher : '-'
      },
      title () {
        return this.metadata ? this.metadata.title : ''
      },
      author () {
        return this.metadata ? this.metadata.creator : ''
      },
      inBookShelf () {
        this.getShelfList()
        if (this.bookItem && this.shelfList) {
          // 定义一个自执行函数，将书架转为一维数组结构，并且只保留type为1的数据（type=1的为电子书）
          const flatShelf = (function flatten (arr) {
            return [].concat(...arr.map(v => v.itemList ? [v, ...flatten(v.itemList)] : v))
          })(this.shelfList).filter(item => item.type === 1)
          // 查找当前电子书是否存在于书架
          const book = flatShelf.filter(item => item.fileName === this.bookItem.fileName)
          return book && book.length > 0
        } else {
          return false
        }
      }
    },
    data () {
      return {
        bookItem: null,
        book: null,
        metadata: null,
        trialRead: null,
        cover: null,
        navigation: null,
        displayed: false,
        audio: null,
        randomLocation: null,
        description: null,
        toastText: '',
        trialText: null,
        categoryText: null,
        opf: null,
        commentData: null, // 评论
        currentScore: 0
      }
    },
    methods: {
      addOrRemoveShelf () {
        if (sessionStorage.getItem('isLogin')) {
          // 如果电子书存在于书架，则从书架中移除电子书
          if (this.inBookShelf) {
            removeBookFromShelf(this.bookItem, sessionStorage.getItem('userName')).then(response => {
              // console.log('addOrRemoveShelf', response)
              if (response.data.error_code === 0) {
                this.removeSelectedBook(this.bookItem)
                getBookShelf(sessionStorage.getItem('userName')).then(response => {
                  if (response.data.error_code === 0) {
                    this.setShelfList(appendAddToShelf(response.data.data))
                  }
                })
                this.simpleToast('移出成功')
              } else {
                this.simpleToast('移出失败')
              }
            })
            // this.setShelfList(list)
            //   .then(() => {
            //     // 将书架数据保存到LocalStorage
            //     saveBookShelf(sessionStorage.getItem('userName'), this.shelfList)
            //     this.simpleToast('移出书架成功')
            //   })
          } else {
            // 如果电子书不存在于书架，则添加电子书到书架
            addBookToShelf(this.bookItem, sessionStorage.getItem('userName')).then(response => {
              const result = response.data
              if (result.error_code === 0) {
                getBookShelf(sessionStorage.getItem('userName')).then(response => {
                  if (response.data.error_code === 0) {
                    this.setShelfList(appendAddToShelf(response.data.data))
                  }
                })
                this.simpleToast('加入书架成功')
              } else {
                this.simpleToast('加入书架失败')
              }
            })
          }
        } else {
          this.$router.push('/login')
        }
      },
      readBook () {
        this.$router.push({
          path: `/ebook/${this.categoryText}|${this.fileName}`
        })
      },
      commentWrite () {
        this.$router.push({
          path: '/store/detail/commentWrite',
          query: {
            title: this.title,
            currentScore: this.currentScore
          }
        })
      },
      getCommentText (title) {
        commentText(title).then(response => {
          this.commentData = response.data.data
        })
      },
      trialListening () {
        getLocalForage(`${sessionStorage.getItem('userName')} / ${this.bookItem.fileName}}`
          , (err, value) => {
            // 离线
            if (!err && value && value instanceof Blob) {
              this.$router.push({
                path: '/store/speaking',
                query: {
                  fileName: this.bookItem.fileName
                }
              })
              // 在线
            } else {
              this.$router.push({
                path: '/store/speaking',
                query: {
                  fileName: this.bookItem.fileName,
                  opf: this.opf
                }
              })
            }
          })
      },
      read (item) {
        this.$router.push({
          path: `/ebook/${this.categoryText}|${this.fileName}`,
          query: {
            item: item
          }
        })
      },
      itemStyle (item) {
        return {
          marginLeft: (item.deep - 1) * px2rem(20) + 'rem'
        }
      },
      doFlatNavigation (content, deep = 1) {
        const arr = []
        content.forEach(item => {
          item.deep = deep
          arr.push(item)
          if (item.subitems && item.subitems.length > 0) {
            arr.push(this.doFlatNavigation(item.subitems, deep + 1))
          }
        })
        return arr
      },
      downloadBook () {
        const opf = `${process.env.VUE_APP_EPUB_URL}/${this.bookItem.categoryText}/${this.bookItem.fileName}/OEBPS/package.opf`
        this.parseBook(opf)
      },
      parseBook (url) {
        this.book = new Epub(url)
        this.book.loaded.metadata.then(metadata => {
          this.metadata = metadata
          this.getCommentText(this.metadata.title)
        })
        this.book.loaded.navigation.then(nav => {
          this.navigation = nav
          if (this.navigation.toc && this.navigation.toc.length > 1) {
            const candisplay = this.display(this.navigation.toc[1].href)
            if (candisplay) {
              candisplay.then(section => {
                if (this.$refs.scroll) {
                  this.$refs.scroll.refresh()
                }
                this.displayed = true
                const reg = new RegExp('<.+?>', 'g')
                const text = section.output.replace(reg, '').replace(/\s\s/g, '')
                this.description = text
              })
            }
          }
        })
      },
      init () {
        this.fileName = this.$route.query.fileName
        this.categoryText = this.$route.query.category
        if (this.fileName) {
          detail({
            fileName: this.fileName
          }).then(response => {
            if (response.status === 200 && response.data.error_code === 0 && response.data.data) {
              const data = response.data.data
              this.bookItem = data
              this.cover = this.bookItem.cover
              let rootFile = data.rootFile
              if (rootFile.startsWith('/')) {
                rootFile = rootFile.substring(1, rootFile.length)
              }
              this.opf = `${process.env.VUE_APP_EPUB_OPF_URL}/${this.fileName}/${rootFile}`
              this.parseBook(this.opf)
            } else {
              this.simpleToast(response.data.msg)
            }
          })
          // 获取评分
          getScore(this.fileName).then(response => {
            this.currentScore = response.data.data
          })
        }
      },
      back () {
        backToUpLevel(this)
      },
      display (location) {
        if (this.$refs.preview) {
          if (!this.rendition) {
            this.rendition = this.book.renderTo('preview', {
              width: window.innerWidth > 640 ? 640 : window.innerWidth,
              height: window.innerHeight,
              method: 'default'
            })
          }
          if (!location) {
            return this.rendition.display()
          } else {
            return this.rendition.display(location)
          }
        }
      },
      onScroll (offsetY) {
        if (offsetY > realpx(42)) {
          this.$refs.title.showShadow()
        } else {
          this.$refs.title.hideShadow()
        }
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .book-detail {
    width: 100%;
    background: white;

    .content-wrapper {
      width: 100%;

      .book-detail-content-wrapper {
        width: 100%;
        border-bottom: px2rem(1) solid #eee;
        box-sizing: border-box;

        .book-detail-content-title {
          font-size: px2rem(20);
          font-weight: bold;
          padding: px2rem(20) px2rem(15) px2rem(10) px2rem(15);
          box-sizing: border-box;
        }

        .book-detail-content-list-wrapper {
          padding: px2rem(10) px2rem(15);
          box-sizing: border-box;

          .loading-text-wrapper {
            width: 100%;

            .loading-text {
              font-size: px2rem(14);
              color: #666;
            }
          }

          .book-detail-content-row {
            display: flex;
            box-sizing: border-box;
            margin-bottom: px2rem(10);

            .book-detail-content-label {
              flex: 0 0 px2rem(70);
              font-size: px2rem(14);
              color: #666;
            }

            .book-detail-content-text {
              flex: 1;
              font-size: px2rem(14);
              color: #333;
            }
          }

          #preview {
          }

          .book-detail-content-item-wrapper {
            .book-detail-content-item {
              padding: px2rem(15) 0;
              font-size: px2rem(14);
              line-height: px2rem(16);
              color: #666;
              border-bottom: px2rem(1) solid #eee;

              &:last-child {
                border-bottom: none;
              }

              .book-detail-content-navigation-text {
                width: 100%;
                @include ellipsis;

                &.is-sub {
                  color: #666;
                }
              }
            }
          }
        }
      }

      .audio-wrapper {
        width: 100%;
        padding: px2rem(15);
        box-sizing: border-box;

        #audio {
          width: 100%;
        }
      }
    }

    .bottom-wrapper {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 120;
      display: flex;
      width: 100%;
      height: px2rem(52);
      box-shadow: 0 px2rem(-2) px2rem(2) rgba(0, 0, 0, .1);

      .bottom-btn {
        flex: 1;
        color: $color-blue;
        font-weight: bold;
        font-size: px2rem(14);
        @include center;

        &:active {
          color: $color-blue-transparent;
        }

        /*.icon-check {*/
        /*  margin-right: px2rem(5);*/
        /*}*/
      }

      &.hide-shadow {
        box-shadow: none;
      }
    }
  }
</style>
