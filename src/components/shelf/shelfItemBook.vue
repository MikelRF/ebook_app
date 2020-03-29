<template>
  <div class="shelf-item-book">
    <img class="shelf-item-book-wrapper" :src="data.cover">
  </div>
</template>

<script>
  export default {
    name: 'shelfItemImg',
    props: {
      data: Object
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .shelf-item-book {
    width: 100%;
    height: 100%;

    .shelf-item-book-wrapper {
      width: 100%;
      height: 100%;
    }
  }
</style>
