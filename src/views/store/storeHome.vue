<template>
  <div class="store-home">
    <search-bar></search-bar>
    <random-book></random-book>
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
  import randomBook from '../../components/home/randomBook'
  import { homeMixin } from '../../utils/mixin'
  // import { home } from '../../api/home'

  export default {
    name: 'store-home',
    mixins: [homeMixin],
    components: {
      searchBar,
      scroll,
      randomBook
    },
    data () {
      return {
        scrollTop: 94,
        random: null
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
    },
    mounted () {
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
