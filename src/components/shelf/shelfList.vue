<template>
  <div class="shelf-list">
    <transition-group name="list"
                      tag="div"
                      id="shelf-list">
      <div class="shelf-list-item-wrapper"
           v-for="item in data" :key="item.id">
        <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import { shelfMixin } from '../../utils/mixin'
  import shelfItem from './shelfItem'
  import { realpx } from '../../utils/book'

  export default {
    name: 'shelfList',
    components: {
      shelfItem
    },
    props: {
      data: Array
    },
    computed: {
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
    left: 0;
    top: px2rem(42);
    z-index: 100;
    width: 100%;

    #shelf-list {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      padding: 0 px2rem(15);
      box-sizing: border-box;

      .shelf-list-item-wrapper {
        flex: 0 0 33.33%;
        width: 33.33%;
        padding: px2rem(15);
        box-sizing: border-box;

        &.list-leave-active {
          display: none;
        }

        &.list-move {
          transition: transform .5s;
        }

        .shelf-list-title-wrapper {
          margin-top: px2rem(10);
        }
      }
    }
  }
</style>
