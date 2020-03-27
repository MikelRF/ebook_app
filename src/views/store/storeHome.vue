<template>
  <div class="store-home">
    <search-bar></search-bar>
    <random-book></random-book>
    <scroll :top="scrollTop" @onScroll="onscroll" ref="scroll">
      <div class="banner-wrapper">
        <div class="banner-img" :style="{backgroundImage:`url('${banner}')`}"></div>
      </div>
      <guess-you-like :data="guessYouLike"></guess-you-like>
      <recommend :data="recommend"></recommend>
      <featured :data="featured"
                :title-text="'精选'"
                :btn-text="'查看全部'"></featured>
      <div class="category-list-wrapper"
           v-for="(item, index) in categoryList" :key="index">
        <category-book :data="item"></category-book>
      </div>
      <category :data="categories"></category>
    </scroll>
  </div>
</template>

<script>
  import searchBar from '../../components/home/searchBar'
  import scroll from '../../components/common/scroll'
  import randomBook from '../../components/home/randomBook'
  import guessYouLike from '../../components/home/guessYouLike'
  import Recommend from '../../components/home/recommend'
  import Featured from '../../components/home/featured'
  import { homeMixin } from '../../utils/mixin'
  import { home } from '../../api/home'
  import Category from '../../components/home/category'
  import CategoryBook from '../../components/home/categoryBook'

  export default {
    name: 'store-home',
    mixins: [homeMixin],
    components: {
      CategoryBook,
      Category,
      Featured,
      Recommend,
      searchBar,
      scroll,
      randomBook,
      guessYouLike
    },
    data () {
      return {
        scrollTop: 94,
        banner: null,
        guessYouLike: null,
        recommend: null,
        featured: null,
        categoryList: null,
        categories: null
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
      home().then(response => {
        if (response && response.status === 200) {
          const data = response.data
          this.banner = data.banner
          this.guessYouLike = data.guessYouLike
          this.recommend = data.recommend
          this.featured = data.featured
          this.categoryList = data.categoryList
          this.categories = data.categories
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .store-home {
    width: 100%;
    height: 100%;

    .banner-wrapper {
      padding: px2rem(10);
      box-sizing: border-box;

      .banner-img {
        width: 100%;
        height: px2rem(150);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .line {
      margin-top: px2rem(15);
      border: solid px2rem(1) #eee;
    }
  }
</style>
