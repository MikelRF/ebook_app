<template>
  <transition name="popup-slide-up">
    <div class="shelf-footer" v-show="isEditMode">
      <div class="shelf-footer-tab-wrapper"
           v-for="item in tabs" :key="item.index"
           @click="onTabClick(item)">
        <div class="shelf-footer-tab" :class="{'is-selected': isSelected}">
          <div class="icon-download tab-icon"
               v-if="item.index === 1 && !isDownload"></div>
          <div class="icon-download-remove tab-icon"
               v-if="item.index === 1 && isDownload"></div>
          <div class="icon-move tab-icon" v-if="item.index === 2"></div>
          <div class="icon-shelf tab-icon" v-if="item.index === 3"></div>
          <div class="tab-text" :class="{'remove-text': item.index === 3}">{{label(item)}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { shelfMixin } from '../../utils/mixin'
  import { saveBookShelf, removeLocalStorage } from '../../utils/LocalStorage'
  import { download } from '../../api/store'
  import { removeLocalForage } from '../../utils/localForage'

  export default {
    name: 'shelfFooter',
    mixins: [shelfMixin],
    data () {
      return {
        popupMenu: null
      }
    },
    computed: {
      isSelected () {
        return this.shelfSelected && this.shelfSelected.length > 0
      },
      tabs () {
        return [
          {
            label: '开启离线',
            label2: '删除',
            index: 1
          },
          {
            label: '移动到...',
            index: 2
          },
          {
            label: '移出书架',
            index: 3
          }
        ]
      },
      isDownload () {
        // 未选中不判断
        if (!this.isSelected) {
          return false
        } else {
          // 选中的图书全都为缓存过时返回true
          return this.shelfSelected.every(item => item.cache)
        }
      }
    },
    methods: {
      // 隐藏弹窗
      // hidePopup () {
      //   this.popupMenu.hide()
      // },
      // 操作结束后的操作
      onComplete () {
        this.hidePopup()
        this.setIsEditMode(false)
        saveBookShelf(sessionStorage.getItem('userName'), this.shelfList)
      },
      // 设置离线
      async setDownload () {
        this.onComplete()
        if (this.isDownload) { // 选中目标为已下载
          this.removeSelectedBook() // 删除缓存
        } else { // 未下载
          await this.downloadSelectedBook().then(res => {
            if (res) {
              saveBookShelf(sessionStorage.getItem('userName'), this.shelfList)
              this.simpleToast('缓存成功')
            } else {
              this.simpleToast('缓存失败')
            }
          })
        }
      },
      // 离线下载
      async downloadSelectedBook () {
        for (let i = 0; i < this.shelfSelected.length; i++) {
          if (this.shelfSelected[i].type === 1) {
            await this.downloadBook(this.shelfSelected[i]).then(book => {
              book.cache = true
            })
          } else {
            return false
          }
        }
        return true
      },
      downloadBook (book) {
        let text = ''
        const toast = this.toast({ text })
        toast.continueShow()
        return new Promise((resolve, reject) => {
          download(book,
            () => {
              toast.remove()
              resolve(book)
            },
            reject,
            progressEvent => {
              const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
              text = '正在下载：$1'.replace('$1', `${book.fileName}.epub(${progress})`)
              toast.updateText(text)
            })
        })
      },
      // 删除离线
      removeSelectedBook () {
        Promise.all(this.shelfSelected.map(book => this.removeBook(book)))
          .then(books => {
            books.map(book => {
              book.cache = false
            })
            saveBookShelf(sessionStorage.getItem('userName'), this.shelfList)
            this.simpleToast('删除缓存成功')
          })
      },
      removeBook (book) {
        return new Promise((resolve, reject) => {
          // 清空电子书缓存
          removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
          // 清空电子书离线
          removeLocalForage(`${book.fileName}`)
          resolve(book)
        })
      },
      // 显示缓存弹窗
      showDownload () {
        this.popupMenu = this.popup({
          title: this.isDownload ? '确认后，将删除所选书籍的离线内容' : '开启后，将自动下载所选书籍内容',
          btn: [
            // {
            //   text: this.isDownload ? '删除' : '离线',
            //   click: () => {
            //     this.setDownload()
            //   }
            // },
            // {
            //   text: '取消',
            //   click: () => {
            //     this.hidePopup()
            //   }
            // }
            this.createPopupBtn(this.isDownload ? '删除' : '离线', () => {
              this.setDownload()
            }),
            this.popupCancelBtn()
          ]
        }).show()
      },
      // 移出书架
      removeSelected () {
        this.shelfSelected.forEach(selected => {
          this.removeBook(selected)
          this.setShelfList(this.shelfList.filter(book => {
            if (book.itemList) {
              book.itemList = book.itemList.filter(subBook => subBook !== selected)
            }
           return book !== selected
          }))
        })
        // this.setShelfSelected([])
        this.onComplete()
      },
      // 显示移出书架弹窗
      showRemove () {
        let title
        if (this.shelfSelected.length === 1) {
          title = '是否将$1移出书架？'.replace('$1', `《${this.shelfSelected[0].title}》`)
        } else {
          title = '是否将$1移出书架？'.replace('$1', '所选书籍')
        }
        this.popupMenu = this.popup({
          title: title,
          btn: [
            // {
            //   text: '移出书架',
            //   type: 'danger',
            //   click: () => {
            //     this.removeSelected()
            //   }
            // },
            // {
            //   text: '取消',
            //   click: () => {
            //     this.hidePopup()
            //   }
            // }
            this.createPopupBtn('移出书架', () => {
              this.removeSelected()
            }, 'danger'),
            this.popupCancelBtn()
          ]
        }).show()
      },
      // 菜单点击事件
      onTabClick (item) {
        if (!this.isSelected) {
          return
        }
        switch (item.index) {
          case 1:
            this.showDownload()
            break
          case 2:
            this.dialog().show()
            break
          case 3:
            this.showRemove()
            break
          default:
            break
        }
      },
      label (item) {
        if (item.index === 1) {
          return this.isDownload ? item.label2 : item.label
        } else {
          return item.label
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .shelf-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    background: white;
    height: px2rem(48);
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);

    .shelf-footer-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;

      .shelf-footer-tab {
        width: 100%;
        height: 100%;
        opacity: .5;
        @include columnCenter;

        &.is-selected {
          opacity: 1;
        }

        .tab-icon {
          font-size: px2rem(20);
        }

        .tab-text {
          margin-top: px2rem(5);
          font-size: px2rem(12);
        }
      }
    }
  }
</style>
