<template>
  <div class="shelf-list">
    <div class="shelf-list-item-wrapper"
         v-for="item in shelfList" :key="item.id">
      <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
      <div class="shelf-list-title-wrapper">
        <span class="shelf-list-title title-small">{{item.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { shelfMixin } from '../../utils/mixin'
  import shelfItem from './shelfItem'
  import { realpx, px2rem } from '../../utils/book'

  export default {
    name: 'shelfList',
    components: {
      shelfItem
    },
    computed: {
      shelfListTop () {
        return px2rem(this.top) + 'rem'
      },
      itemHeight () {
        // w / 250 = h / 350
        // h = w / 250 * 350
        return ((window.innerWidth - realpx(120)) / 3) / 250 * 350 + 'px'
      }
    },
    mixins: [shelfMixin]
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .shelf-list {
    position: absolute;
    top: px2rem(94);
    left: 0;
    z-index: 100;
    display: flex;
    flex-flow: row wrap; //换行
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;

    .shelf-list-item-wrapper {
      flex: 0 0 33.33%; //一行三个
      width: 33.33%;
      padding: px2rem(15) px2rem(15);
      box-sizing: border-box;
      .shelf-list-title-wrapper {
        margin-top: px2rem(10);
      }
    }
  }
</style>
