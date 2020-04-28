<template>
  <div class="comment-detail-wrapper">
    <comment-title></comment-title>
    <scroll :top="50">
      <div class="comment-wrapper">
        <div class="comment-top">
          <div class="comment-name">{{item.username}}:</div>
          <div class="star-wrapper">
            <star :fontSize="20"
                  :choseScore="item.score * 1"></star>
          </div>
        </div>
        <div class="comment-box">
          <div class="comment" v-html="text"></div>
        </div>
        <div class="time">发表于 {{item.date}}</div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import CommentTitle from '../../components/common/commentTitle'
  import Scroll from '../../components/common/scroll'
  import { userMixin } from '../../utils/mixin'
  import Star from '../../components/common/star'

  export default {
    name: 'commentDetail',
    mixins: [userMixin],
    components: {
      Star,
      Scroll,
      CommentTitle
    },
    data () {
      return {
        item: this.$route.query.item,
        text: this.$route.query.text
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .comment-detail-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
    background: white;

    .comment-wrapper {
      margin: px2rem(10);

      .comment-top {
        display: flex;

        .comment-name {
          margin: 0 px2rem(10) px2rem(10) 0;
          font-size: px2rem(16);
          color: #ccc;
        }

        .star-wrapper {
          height: px2rem(10);
          @include center
        }
      }

      .comment-box {
        margin: px2rem(10);

        .comment {
          line-height: px2rem(30);
          font-size: px2rem(20);
        }
      }

      .time {
        font-size: px2rem(16);
        margin-top: px2rem(20);
        color: gray;
        @include right;
      }
    }
  }
</style>
