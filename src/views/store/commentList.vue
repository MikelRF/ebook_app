<template>
  <div class="comment-list-wrapper">
    <router-view></router-view>
    <comment-title ref="title"></comment-title>
    <div class="no-comment-wrapper" v-show="noComment">
      <span class="no-comment">还没有任何评论...</span>
    </div>
    <scroll :top="42"
            @onScroll="onScroll"
            ref="scroll">
      <div class="comment-list" v-for="(item, index) in commentList" :key="index">
        <div class="comment-item-wrapper">
          <div class="comment-item">
            <div class="comment-top">
              <div class="comment-name">{{item.username}} :</div>
              <div class="star-wrapper">
                <star :choseScore="item.score"
                      :fontSize="15"></star>
<!--                <div class="thumbsUp-wrapper">-->
<!--                  <div class="icon-thumbs-up"-->
<!--                       :class="{'selected': isThumbsUp}"-->
<!--                       @click="likeIt(item)"></div>-->
<!--                  <div class="thumbs-up-num">{{item.thumbsUp}}</div>-->
<!--                </div>-->
              </div>
            </div>
            <div class="comment" v-html="text(item)" @click="showAll(item)"></div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import { getCommentList } from '../../api/store'
  import { backToUpLevel } from '../../utils/store'
  import CommentTitle from '../../components/common/commentTitle'
  import Scroll from '../../components/common/scroll'
  import { realpx } from '../../utils/book'
  import Star from '../../components/common/star'

  export default {
    name: 'commentList',
    components: {
      Star,
      Scroll,
      CommentTitle
    },
    methods: {
      text (item) {
        return item.comment
      },
      back () {
        backToUpLevel(this)
      },
      // likeIt (item) {
      //   this.isThumbsUp = !this.isThumbsUp
      //   if (this.isThumbsUp) {
      //     updateCommentScore(item.id, 1).then(response => {
      //       if (response.data.error_code === 0) {
      //         item.thumbsUp++
      //       } else {
      //         this.simpleToast('点赞失败')
      //       }
      //     })
      //   } else {
      //     updateCommentScore(item.id, -1).then(response => {
      //       if (response.data.error_code === 0) {
      //         item.thumbsUp--
      //       } else {
      //         this.simpleToast('点赞失败')
      //       }
      //     })
      //   }
      // },
      showAll (item) {
        this.$router.push({
          path: '/store/detail/commentList/commentDetail',
          query: {
            text: item.comment,
            item
          }
        })
      },
      onScroll (offsetY) {
        if (offsetY > realpx(42)) {
          this.$refs.title.showShadow()
        } else {
          this.$refs.title.hideShadow()
        }
      }
    },
    data () {
      return {
        commentList: [],
        noComment: false,
        isThumbsUp: false,
        thumbsUpNum: 1000
      }
    },
    mounted () {
      const title = this.$route.query.title
      getCommentList(title).then(response => {
        this.commentList = response.data.data
        if (!this.commentList) {
          this.noComment = true
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .comment-list-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 500;

    .no-comment-wrapper {
      position: absolute;
      top: 0;
      @include center;
      width: 100%;
      height: 100%;

      .no-comment {
        font-size: px2rem(20);
        color: gray;
      }
    }

    .comment-list {
      width: 100%;
      @include center;

      .comment-item-wrapper {
        width: 95%;
        box-sizing: border-box;
        margin: px2rem(5) px2rem(5);

        .comment-item {
          border: solid px2rem(1) #eee;
          box-shadow: px2rem(2) px2rem(2) px2rem(5) rgba(0, 0, 0, .1);
          border-radius: px2rem(10);

          .comment-top {
            width: 100%;
            height: px2rem(25);
            display: flex;

            .comment-name {
              margin: px2rem(5) px2rem(5);
              font-size: px2rem(14);
              color: gray;
            }

            .star-wrapper {
              height: px2rem(10);
              @include center;
            }

            .thumbsUp-wrapper {
              flex: 1;
              @include right;
              margin-right: px2rem(10);

              .icon-thumbs-up {
                padding-right: px2rem(5);
                font-size: px2rem(16);

                &.selected {
                  color: $color-blue;
                }
              }

              .thumbs-up-num {
                font-size: px2rem(16);
              }
            }
          }

          .comment {
            margin: px2rem(5) px2rem(8);
            font-size: px2rem(16);
            line-height: px2rem(25);
            @include ellipsis2(5)
          }
        }
      }
    }
  }
</style>
