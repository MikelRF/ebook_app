<template>
  <div class="cover-title-wrapper">
    <div class="cover-title-left-wrapper">
      <img class="cover-img" v-lazy="cover" :key="cover">
      <div class="score">
        <div class="score-text1" v-html="'评分:&nbsp&nbsp'"></div>
        <div class="score-text2">{{currentScore}}</div>
      </div>
    </div>
    <div class="cover-title-right-wrapper">
      <div class="detail-cover-title-wrapper">
        <div class="cover-title-text">{{title}}</div>
      </div>
      <div class="cover-author-wrapper">
        <div class="cover-author-text">{{author}}</div>
      </div>
      <div class="detail-cover-description-wrapper">
        <div class="detail-cover-description-text">{{desc}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      cover: String,
      title: String,
      author: String,
      desc: String,
      currentScore: Number
    },
    data() {
      return {
        score: '评分:  ' + this.currentScore
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .cover-title-wrapper {
    display: flex;
    width: 100%;
    padding: px2rem(10) 0;
    box-sizing: border-box;
    .cover-title-left-wrapper {
      flex: 0 0 px2rem(103);
      padding: px2rem(10) 0 px2rem(10) px2rem(15);
      box-sizing: border-box;
      @include left;
      display: block;
      .cover-img {
        width: px2rem(103);
        height: px2rem(146);
      }
      .score {
        width: 100%;
        height: px2rem(50);
        @include bottomLeft
        .score-text1 {
          font-size: px2rem(16);
          color: #346cb9;
        }
        .score-text2 {
          font-size: px2rem(20);
          font-weight: bold;
        }
      }
    }
    .cover-title-right-wrapper {
      flex: 1;
      padding: px2rem(10) px2rem(15);
      box-sizing: border-box;
      .detail-cover-title-wrapper {
        .cover-title-text {
          font-size: px2rem(24);
          line-height: px2rem(26);
          font-weight: bold;
          color: #333;
        }
      }
      .cover-author-wrapper {
        margin-top: px2rem(10);
        .cover-author-text {
          font-size: px2rem(14);
          line-height: px2rem(16);
          color: $color-blue;
        }
      }
      .detail-cover-description-wrapper {
        margin-top: px2rem(10);
        .detail-cover-description-text {
          font-size: px2rem(14);
          line-height: px2rem(16);
          color: #666;
          word-break: keep-all;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          overflow-wrap: break-word;
        }
      }
    }
  }
</style>
