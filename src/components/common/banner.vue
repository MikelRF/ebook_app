<template>
  <swiper class="banner-list-wrapper" ref="mySwiper" :options="swiperOptions">
    <swiper-slide class="banner-wrapper"
                  v-for="(item, index) in bannerList" :key="index">
      <img class="banner" :src="item" alt="">
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
  import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'

  export default {
    name: 'banner',
    props: {
      bannerList: {
        type: Array,
        require: true
      }
    },
    components: {
      Swiper,
      SwiperSlide
    },
    directives: {
      swiper: directive
    },
    data () {
      return {
        swiperOptions: {
          pagination: {
            el: '.swiper-pagination'
          },
          loop: true,
          autoplay: {
            delay: 2000,
            stopOnLastSlide: false, // 当切换到最后一个slide时是否自动停止切换，false：不停止；true:停止
            disableOnInteraction: false // 用户操作swiper之后，是否禁止autoplay。
          },
          autoHeight: true
        }
      }
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.$swiper
      }
    },
    mounted () {
      this.swiper.slideTo(3, 1000, false)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .banner-list-wrapper {
    .banner-wrapper {
      .banner {
        width: 100%;
        height: px2rem(150);
      }
    }
  }
</style>
