<template>
  <transition name="fade">
    <div class="shelf-title" :class="{'hide-shadow': ifHideShadow}" v-show="shelfTitleVisible">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{title}}</span>
      </div>
<!--      <div class="shelf-title-btn-wrapper shelf-title-left">-->
<!--              <span class="shelf-title-btn-text" @click="clearCache" v-if="showClear">清空缓存</span>-->
<!--            </div>-->
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showBack">
        <span class="icon-back" @click="back"></span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-right" v-if="showEdit">
        <span class="shelf-title-btn-text"
              @click="choseAll" v-if="isEditMode">{{!isChoseAll ? '全选' : '取消全选'}}</span>
        <span class="shelf-title-btn-text"
              @click="onEditClick">{{isEditMode ? '取消' : '编辑'}}</span>
      </div>
      <div class="shelf-title-btn-wrapper"
           :class="{'shelf-title-left': changeGroupLeft,
                    'shelf-title-right': changeGroupRight}"
           @click="changeGroup"
           v-if="showChangeGroup">
        <span class="shelf-title-btn-text">修改分组</span>
      </div>
    </div>
  </transition>
</template>

<script>
  import { shelfMixin } from '../../utils/mixin'
  import { clearLocalForage } from '../../utils/localForage'
  import { saveBookShelf } from '../../utils/LocalStorage'
  import { backToUpLevel } from '../../utils/store'

  export default {
    name: 'shelfTitle',
    mixins: [shelfMixin],
    props: {
      title: String,
      parentName: String
    },
    computed: {
      emptyCategory () { // 当前是否是分组，分组是否为空是否为空
        return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
      },
      showEdit () { // 显示“编辑”，书架页，非空组内
        return this.currentType === 1 || !this.emptyCategory
      },
      showBack () { // 显示“回退”，分组内，非编辑模式
        return this.currentType === 2 && !this.isEditMode
      },
      showClear () { // 显示“清除缓存”，书架页
        return this.currentType === 1
      },
      showChangeGroup () { // 显示“修改分组”，编辑模式下，空组内
        return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
      },
      changeGroupLeft () { // 显示“修改分组” 左，编辑模式下组内
        return !this.emptyCategory
      },
      changeGroupRight () { // 显示“修改分组” 右，空组内
        return this.emptyCategory
      }
    },
    watch: {
      offsetY (offsetY) {
        if (offsetY > 0) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    data () {
      return {
        ifHideShadow: true,
        popupMenu: null,
        isChoseAll: false
      }
    },
    methods: {
      choseAll () {
        this.isChoseAll = !this.isChoseAll // 切换状态
        if (this.parentName === 'storeShelfCategory') { // 组内
          if (this.isChoseAll) { // 全选中时
            this.shelfList.forEach(book => {
              // 找到该组
              if (book.type === 2 && book.shelfCategoryName === this.title) {
                book.itemList.forEach(subBook => {
                  subBook.selected = true
                  console.log('subBook', subBook, 'selected', subBook.selected)
                  this.shelfSelected.pushWithoutDuplicate(subBook)
                })
              }
            })
          } else { // 取消全选中
            this.clearSelected()
          }
        } else { // 书架
          if (this.isChoseAll) { // 全选中时
            this.shelfList.forEach(book => {
              if (!book.itemList && book.type === 1) {
                book.selected = true
                this.shelfSelected.pushWithoutDuplicate(book)
              }
            })
          } else { // 取消全选中
            this.clearSelected()
          }
        }
      },
      back () {
        backToUpLevel(this)
        this.setIsEditMode(false)
      },
      onComplete () {
        this.hidePopup()
        this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id)).then(() => {
          saveBookShelf(sessionStorage.getItem('userName'), this.shelfList)
          this.setIsEditMode(false)
          this.$router.go(-1)
        })
      },
      // 删除分组
      deleteGroup () {
        if (!this.emptyCategory) { // 非空组
          this.setShelfSelected(this.shelfCategory.itemList) // 组内图书设置为全部选中
          this.moveOutOfGroup(this.onComplete) // 移除
        } else {
          this.onComplete()
        }
      },
      // 修改名字
      changeGroupName () {
        this.hidePopup()
        this.dialog({
          showNewGroup: true,
          groupName: this.shelfCategory.title
        }).show()
      },
      // 删除分组弹窗
      showDeleteGroup () {
        this.hidePopup()
        setTimeout(() => {
          this.popupMenu = this.popup({
            title: '删除分组后，分组内的书籍将会自动移出分组',
            btn: [
              this.createPopupBtn('确定', () => {
                this.deleteGroup()
              }, 'danger'),
              this.popupCancelBtn() // 取消
            ]
          }).show()
        }, 200)
      },
      // 修改分组弹窗
      changeGroup () {
        this.popupMenu = this.popup({
          btn: [
            this.createPopupBtn('修改分组名', () => {
              this.changeGroupName()
            }),
            this.createPopupBtn('删除分组', () => {
              this.showDeleteGroup()
            }, 'danger'),
            this.popupCancelBtn()
          ]
        }).show()
      },
      onEditClick () {
        if (!this.isEditMode) { // 非编辑模式
          this.isChoseAll = false // 取消全选状态 标题切换为全选
          this.clearSelected()
        }
        this.setIsEditMode(!this.isEditMode)
      },
      // 清空选中框
      clearSelected () {
        this.shelfList.forEach(book => {
          book.selected = false
          if (book.itemList) {
            book.itemList.forEach(subBook => {
              subBook.selected = false
            })
          }
        })
        this.setShelfSelected([]) // 清空选中图书及状态
      },
      clearCache () {
        clearLocalForage()
        this.getShelfList()
        this.simpleToast('缓存已清空')
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-title {
    position: relative;
    z-index: 130;
    width: 100%;
    height: px2rem(42);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);

    &.hide-shadow {
      box-shadow: none;
    }

    .shelf-title-text-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;

      .shelf-title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }
    }

    .shelf-title-btn-wrapper {
      position: absolute;
      top: 0;
      box-sizing: border-box;
      height: 100%;
      @include center;

      .shelf-title-btn-text {
        font-size: px2rem(14);
        color: #666;
        padding-left: px2rem(5);
      }

      .icon-back {
        font-size: px2rem(20);
        color: #666;
      }

      &.shelf-title-left {
        left: 0;
        padding-left: px2rem(15);
      }

      &.shelf-title-right {
        right: 0;
        padding-right: px2rem(15);
      }
    }
  }
</style>
