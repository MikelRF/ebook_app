<template>
  <div class="shelf-item-wrapper">
    <div class="shelf-item"
         :class="{'shelf-item-shadow': data.type === 1 || data.type === 2}"
         @click="onItemClick">
      <component :is="item"
                 :data="data"
                 class="shelf-item-comp"
                 :class="{'is-edit': isEditMode && data.type === 2}"></component>
      <div class="icon-selected"
           :class="{'is-selected': data.selected}"
           v-show="isEditMode && data.type === 1"></div>
    </div>
    <div class="mask" v-if="isEditMode && data.type === 2"></div>
  </div>
</template>

<script>
  import { shelfMixin } from '../../utils/mixin'
  import shelfItemBook from './shelfItemBook'
  import shelfItemAdd from './shelfItemAdd'
  import shelfItemCategory from './shelfItemCategory'
  import { gotoStoreHome } from '../../utils/store'

  export default {
    name: 'shelfItem',
    props: {
      data: Object
    },
    mixins: [shelfMixin],
    computed: {
      item () {
        return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
      }
    },
    data () {
      return {
        book: shelfItemBook,
        category: shelfItemCategory,
        add: shelfItemAdd
      }
    },
    methods: {
      onItemClick () {
        // 编辑模式不跳转
        if (this.isEditMode) {
          // 选中
          this.data.selected = !this.data.selected
          if (this.data.selected) {
            // 避免重复填入数组
            this.shelfSelected.pushWithoutDuplicate(this.data)
          } else {
            this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
          }
        } else {
          // 非编辑模式，1 跳转详情 2 跳转分组 3跳转首页
          if (this.data.type === 1) {
            this.showBookDetail(this.data)
          } else if (this.data.type === 2) {
            this.$router.push({
              path: '/store/category',
              query: {
                title: this.data.title
              }
            })
          } else {
            gotoStoreHome(this)
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .shelf-item-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    .shelf-item {
      width: 100%;
      height: 100%;
      &.shelf-item-shadow {
        box-shadow: px2rem(3) px2rem(3) px2rem(6) px2rem(4) rgba(200, 200, 200, .5);
      }

      .shelf-item-comp {
        opacity: 1;

        &.is-edit {
          opacity: .5;
        }
      }

      .icon-selected {
        position: absolute;
        bottom: px2rem(2);
        right: px2rem(2);
        font-size: px2rem(18);
        color: rgba(0, 0, 0, .4);

        &.is-selected {
          color: $color-blue;
        }
      }
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 150;
    }
  }
</style>
