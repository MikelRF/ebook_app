<template>
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
</template>

<script>
  import { shelfMixin } from '../../utils/mixin'
import { saveBookShelf } from '../../utils/localStorage'
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
      hidePopup () {
        this.popupMenu.hide()
      },
      downloadSelectedBook() {
      },
      // 操作结束后的操作
      onComplete() {
        this.hidePopup()
        // this.setIsEditMode(false)
        saveBookShelf(this.shelfList)
      },
      // 设置缓存
      setDownload () {
        let isDownload
        // 删除 -> 缓存过的
        if (this.isDownload) {
          isDownload = false
        } else {
          // 缓存 -> 无缓存过的
          isDownload = true
        }
        this.shelfSelected.forEach(book => {
          book.cache = isDownload // 该书缓存位置为true
        })
        this.downloadSelectedBook()
        this.onComplete()
        if (isDownload) {
          this.simpleToast('缓存成功')
        } else {
          this.simpleToast('删除缓存成功')
        }
      },
      // 显示缓存弹窗
      showDownload () {
        this.popupMenu = this.popup({
          title: this.isDownload ? '确认后，将删除所选书籍的离线内容' : '开启后，将自动缓存所选书籍内容',
          btn: [
            {
              text: this.isDownload ? '删除' : '缓存',
              click: () => {
                this.setDownload()
              }
            },
            {
              text: '取消',
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },
      // 移出书架
      removeSelected() {
        this.shelfSelected.forEach(selected => {
          this.setShelfList(this.shelfList.filter(book => book !== selected))
        })
        // this.setShelfSelected([])
        this.onComplete()
      },
      // 移出书架弹窗
      showRemove() {
        let title
        if (this.shelfSelected.length === 1) {
          title = '是否将$1移出书架？'.replace('$1', `《${this.shelfSelected[0].title}》`)
        } else {
          title = '是否将$1移出书架？'.replace('$1', '所选书籍')
        }
        this.popupMenu = this.popup({
          title: title,
          btn: [
            {
              text: '移出书架',
              type: 'danger',
              click: () => {
                this.removeSelected()
              }
            },
            {
              text: '取消',
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },
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
