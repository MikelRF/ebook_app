<template>
  <div class="random-book-wrapper" v-show="randomBookVisible">
    <div class="book-card" v-show="randomBookAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="this.randomBook ? this.randomBook.cover: ''">
        </div>
        <div class="content-wrapper">
          <div class="title">{{this.randomBook ? this.randomBook.title : ''}}</div>
          <div class="author sub-title-medium">{{this.randomBook ? this.randomBook.author : ''}}</div>
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="readNow()">立即阅读</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
  import { homeMixin } from '../../utils/mixin'
  import { categoryText } from '../../utils/store'

  export default {
    name: 'randomBook',
    data () {
      return {
        randomBookAnimation: false
      }
    },
    mixins: [homeMixin],
    watch: {
      randomBook (book) {
        if (book) {
          this.randomBookAnimation = true
        } else {
          this.randomBookAnimation = false
        }
      }
    },
    methods: {
      close () {
        this.setRandomBookVisible(false)
        this.randomBookAnimation = false
      },
      categoryText () {
        if (this.data) {
          return categoryText(this.randomBook.category)
        } else {
          return ''
        }
      },
      readNow() {
        this.showBookDetail(this.randomBook)
        this.setRandomBookVisible(false)
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .random-book-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    @include center;

    .book-card {
      position: relative;
      width: 75%;
      height: 45%;
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      max-width: px2rem(400);
      animation: scale .3s ease-in both;
      @keyframes scale {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;

        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;

          .img {
            width: px2rem(90);
            height: px2rem(120);
          }
        }

        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);

          .title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }

          .author {
            margin-top: px2rem(10);
            text-align: center;
            @include ellipsis2(1)
          }

          .category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }

        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }

    .close-btn-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(30);
      z-index: 1100;
      width: 100%;
      @include center;

      .icon-close {
        display: inline-block;
        width: px2rem(45);
        height: px2rem(45);
        font-size: px2rem(30);
        color: white;
        background: transparent;
        border-radius: 50%;
        @include center;
      }
    }
  }
</style>
