<template>
  <div class="comment-wrapper">
    <div class="comment-card-wrapper">
      <div class="comment-card">
        <div class="comment-top">
          <div class="comment-name">{{commentData ? commentData.username + ' 点评' : ''}}</div>
          <star :choseScore="commentData.score"
                v-if="commentData"></star>
        </div>
        <div class="comment" v-html="text"></div>

        <div class="more" @click="showMore">查看更多评论 ></div>
      </div>
    </div>
  </div>
</template>

<script>
  // import Star from '../common/star'
  import Star from '../common/star'

  export default {
    name: 'comment',
    components: { Star },
    // components: { Star },
    props: {
      commentData: Object,
      title: String
    },
    computed: {
      text () {
        return this.commentData ? this.commentData.comment : '暂无评论'
      }
    },
    methods: {
      showMore () {
        if (this.title) {
          this.$router.push({
            path: '/store/detail/commentList',
            query: {
              title: this.title
            }
          })
        } else {
          this.simpleToast('这本书还没有评论...')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .comment-wrapper {
    position: relative;
    width: 100%;
    height: px2rem(130);
    @include center;

    .comment-card-wrapper {
      position: absolute;
      width: 90%;
      height: 100%;
      border-radius: px2rem(20);
      @include center;
      background: whitesmoke;

      .comment-card {
        position: absolute;
        width: 90%;
        height: 80%;
        font-size: px2rem(16);

        .comment-top {
          display: flex;

          .comment-name {
            margin: 0 px2rem(5) px2rem(10) 0;
            color: gray;
            font-size: px2rem(14);
          }
        }

        .comment {
          @include ellipsis2(3);
          overflow: hidden;
          line-height: px2rem(20);
        }

        .more {
          font-size: px2rem(12);
          color: $color-blue;
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
    }
  }
</style>
