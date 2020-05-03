<template>
  <ebook-dialog :title="title" ref="dialog">
    <!--    分组选项-->
    <div class="dialog-list-wrapper" v-if="!ifNewGroup">
      <div class="dialog-list-item"
           :class="{'is-add': item.edit  ? item.edit === 1 : false}"
           v-for="(item, index) in categoryList"
           :key="index"
           @click="onGroupClick(item)"
           v-show="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit">
        <!--        ⬆移出组内只能在组内显示，新建组、自定义组都可显示-->
        <div class="dialog-list-item-text"
             :class="{'currentCategory': isInGroup && shelfCategory.id === item.id}">{{item.title ? item.title :
          item.shelfCategoryName}}
        </div>
      </div>
    </div>
    <!--    修改分组名-->
    <div class="dialog-new-group-wrapper" v-else>
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">修改分组名</span>
      </div>
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
          <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput">
          <div class="dialog-input-clear-wrapper" @click="clear"
               v-show="newGroupName && newGroupName.length > 0">
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
      </div>
    </div>
    <div slot="btn" class="group-dialog-btn-wrapper">
      <div class="dialog-btn" @click="hide">取消</div>
      <div class="dialog-btn" @click="createNewGroup"
           :class="{'is-empty': newGroupName && newGroupName.length === 0}"
           v-if="ifNewGroup">确定
      </div>
    </div>
  </ebook-dialog>
</template>

<script>
  import EbookDialog from '../common/dialog'
  import { shelfMixin } from '../../utils/mixin'
  import { removeAddFromShelf, appendAddToShelf } from '../../utils/store'
  import { changeGroupName, moveToGroup, duplicateGroupName } from '../../api/store'

  export default {
    name: 'group-dialog',
    mixins: [shelfMixin],
    props: {
      showNewGroup: {
        type: Boolean,
        default: false // true: 空组只能修改名字
      },
      groupName: String
    },
    components: {
      EbookDialog
    },
    computed: {
      isInGroup () {
        // 当前在组中
        return this.currentType === 2
      },
      defaultCategory () {
        return [
          {
            title: '新建分组',
            edit: 1
          },
          {
            title: '移出分组',
            edit: 2
          }
        ]
      },
      category () {
        return this.shelfList.filter(item => item.type === 2)
      },
      categoryList () {
        return [...this.defaultCategory, ...this.category]
      },
      title () {
        return !this.ifNewGroup ? '移动书籍' : '新建分组'
      }
    },
    data () {
      return {
        ifNewGroup: false,
        newGroupName: ''
      }
    },
    methods: {
      show () {
        this.ifNewGroup = this.showNewGroup
        this.newGroupName = this.groupName
        this.$refs.dialog.show()
      },
      hide () {
        this.$refs.dialog.hide()
        setTimeout(() => {
          this.ifNewGroup = false
        }, 200)
      },
      clear () {
        this.newGroupName = ''
      },
      // 分组弹窗
      onGroupClick (item) {
        if (item.edit && item.edit === 1) {
          this.ifNewGroup = true // 新建分组
        } else if (item.edit && item.edit === 2) {
          this.moveOutFromGroup(item) // 移出分组
        } else {
          this.moveToGroup(item) // 移入分组， item: 要移入的组
        }
      },
      // 图书移到小组中
      moveToGroup (group) {
        moveToGroup(this.shelfSelected, sessionStorage.getItem('userName'), group.shelfCategoryName).then(response => {
          if (response.data.error_code === 0) {
            this.setShelfList(this.shelfList.filter(book => {
              // 当前目标是一个分组移到另一个分组
              if (book.itemList) {
                // <0 表示未变选中
                book.itemList = book.itemList.filter(subBook => this
                  .shelfSelected.indexOf(subBook) < 0)
              }
              // 从书架中移出
              return this.shelfSelected.indexOf(book) < 0
            })) // 书架图书更新完毕
              .then(() => { // 移动图书到指定分组
                if (group) {
                  // 分组中原来存在的图书与选中图书合并成新数组
                  group.itemList = [...group.itemList, ...this.shelfSelected]
                }
                group.itemList.forEach((item, index) => {
                  item.id = index + 1 // 重置id
                })
              })
            this.simpleToast('成功移入$1'.replace('$1', group.shelfCategoryName))
            this.onComplete()
          } else {
           this.simpleToast('分组失败...')
          }
        })
      },
      // 移出分组
      moveOutFromGroup () {
        this.moveOutOfGroup(this.onComplete)
      },
      // 新分组是否重名
      DuplicateGroupName(category, newGroupName) {
        let success = true
        category.forEach(item => {
          if (item.shelfCategoryName === newGroupName) {
            success = false
          }
        })
        return success
      },
      // 创建新的分组
      createNewGroup () {
        // 空名
        if (!this.newGroupName || this.newGroupName.length === 0) {
          return
        }
        if (this.showNewGroup) { // 修改分组名
          if (this.newGroupName === this.shelfCategory.shelfCategoryName) {
            this.simpleToast('与原组名重复...')
          } else {
            duplicateGroupName(this.newGroupName, sessionStorage.getItem('userName')).then(response => {
              if (response.data.error_code === 0) {
                changeGroupName(this.newGroupName, sessionStorage.getItem('userName'), this.shelfCategory.shelfCategoryName).then(response => {
                  if (response.data.error_code === 0) {
                    this.shelfCategory.shelfCategoryName = this.newGroupName
                    this.onComplete()
                    this.simpleToast('修改成功')
                  } else {
                    this.simpleToast('修改失败')
                  }
                })
              } else if (response.data.error_code === 2) {
                this.simpleToast('当前已存在该组名...')
              }
            })
          }
        } else {
          if (this.DuplicateGroupName(this.category, this.newGroupName)) {
            const group = {
              id: this.shelfList[this.shelfList.length - 2].id + 1,
              itemList: [],
              selected: false,
              shelfCategoryName: this.newGroupName,
              type: 2
            }
            // 移出“添加”图书
            const list = removeAddFromShelf(this.shelfList)
            // 加入新的分组
            list.push(group)
            // 添加“添加”图书
            this.setShelfList(appendAddToShelf(list)).then(() => {
              this.moveToGroup(group)
              this.onComplete()
            })
          } else {
            this.simpleToast('该组名已存在...')
          }
        }
      },
      onComplete () {
        this.hide()
        this.setIsEditMode(false)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .dialog-list-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    font-size: px2rem(14);
    @include scroll;

    .dialog-list-item {
      display: flex;
      padding: px2rem(15) 0;
      box-sizing: border-box;
      color: #666;

      &.is-add {
        color: $color-blue;

        &:active {
          color: $color-blue-transparent;
        }
      }

      &:active {
        color: rgba(102, 102, 102, .5)
      }

      .dialog-list-item-text {
        @include center;
        flex: 1;

        &.currentCategory {
          color: $color-green;
        }
      }

      .dialog-list-icon-wrapper {
        flex: 0 0 px2rem(30);
        color: $color-blue;
        @include right;
      }
    }
  }

  .dialog-new-group-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;

    .dialog-input-title-wrapper {
      font-size: px2rem(10);
      margin-top: px2rem(20);
    }

    .dialog-input-wrapper {
      width: 100%;
      padding: 0 0 px2rem(30) 0;
      box-sizing: border-box;

      .dialog-input-inner-wrapper {
        display: flex;
        width: 100%;
        padding: px2rem(10) 0;
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(14);
        color: #666;

        .dialog-input {
          flex: 1;
          border: none;

          &:focus {
            outline: none;
          }
        }

        .dialog-input-clear-wrapper {
          flex: 0 0 px2rem(30);
          color: #ccc;
          @include center;

          &:active {
            color: #999;
          }
        }
      }
    }
  }

  .group-dialog-btn-wrapper {
    width: 100%;
    @include center;
  }

  .dialog-btn {
    flex: 1;

    &.is-empty {
      color: rgba(255, 255, 255, .5);
    }

    &:active {
      color: rgba(255, 255, 255, .5)
    }
  }
</style>
