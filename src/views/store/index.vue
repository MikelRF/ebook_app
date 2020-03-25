<template>
  <div class="store">
    <store-home></store-home>
    <router-view></router-view>
  </div>
</template>

<script>
  import storeHome from './storeHome'
  export default {
    name: 'store',
    components: { storeHome }
  }
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
  .store {
    width: 100%;
    height: 100%;
    background: white;
  }
</style>
