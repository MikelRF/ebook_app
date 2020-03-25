<template>
  <div class="store-home">
    <search-bar></search-bar>
    <scroll :top="scrollTop" @onScroll="onscroll" ref="scroll">
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
      <div>11111111111111111111111111</div>
    </scroll>
  </div>
</template>

<script>
  import searchBar from '../../components/home/searchBar'
  import scroll from '../../components/common/scroll'
  import { homeMixin } from '../../utils/mixin'

  export default {
    name: 'store-home',
    mixins: [homeMixin],
    components: {
      searchBar,
      scroll
    },
    data () {
      return {
        scrollTop: 94
      }
    },
    methods: {
      onscroll (y) {
        this.setOffsetY(y)
        if (y > 0) {
          this.scrollTop = 52
        } else {
          this.scrollTop = 94
        }
        this.$refs.scroll.refresh()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .store-home {
    width: 100%;
    height: 100%;
  }
</style>
