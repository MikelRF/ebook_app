<template>
  <div class="shelf-item-category">
    <div class="shelf-item-category-list" v-if="data.itemList.length > 0">
      <div class="shelf-item-category-item" v-for="(item, index) in data.itemList" :key="index">
        <img class="shelf-item-category-img" v-lazy="item.cover" :key="item.cover">
      </div>
    </div>
    <div class="shelf-item-category-bg" v-else>
      <span class="icon-book2"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'shelfItemCategory',
    props: {
      data: Object
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .shelf-item-category {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .shelf-item-category-list {
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      width: 100%;
      height: 100%;
      padding-top: px2rem(5);
      box-sizing: border-box;
      .shelf-item-category-item {
        flex: 0 0 33.33%; // 九宫格
        width: 33.33%;
        height: 33.33%;
        box-sizing: border-box;
        &:nth-child(3n+1) { //各排第一个
          padding: 0 px2rem(2.5) px2rem(5) px2rem(5);
        }
        &:nth-child(3n+2) { //各排第二个
          padding: 0 px2rem(2.5) px2rem(5) px2rem(2.5);
        }
        &:nth-child(3n+3) { //各排第三个
          padding: 0 px2rem(5) px2rem(5) px2rem(2.5);
        }
        &:nth-child(7) { //最后一排第一个
          margin-bottom: px2rem(10);
        }
        &:nth-child(8) { //最后一排第二个
          margin-bottom: px2rem(10);
        }
        &:nth-child(9) { //最后一排第三个
          margin-bottom: px2rem(10);
        }
        .shelf-item-category-img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .shelf-item-category-bg {
      width: 100%;
      height: 100%;
      background: white;
      font-size: px2rem(30);
      color: #ccc;
      @include center;
    }
  }
</style>
