<template>
  <div class="comment-write-wrapper">
    <comment-title></comment-title>
    <div class="star-wrapper">
      <star @score="getScore"
            :choseScore="10"
            :notClick="false"></star>
    </div>
    <div class="bottom-line"></div>
    <div class="input-wrapper">
      <textarea class="input"
                v-model="content"
                placeholder="写下你的感想..." ref="input"></textarea>
    </div>
    <div class="comment-title-submit-wrapper" @click="submit">
      <span class="comment-title-submit">发表</span>
    </div>
  </div>
</template>

<script>
  import star from '../../components/common/star'
  import { backToUpLevel } from '../../utils/store'
  import { userMixin } from '../../utils/mixin'
  import { updateScore, submitComment } from '../../api/store'
  import CommentTitle from '../../components/common/commentTitle'

  export default {
    name: 'commentWrite',
    mixins: [userMixin],
    data () {
      return {
        title: '',
        content: '',
        score: 10
      }
    },
    components: {
      CommentTitle,
      star
    },
    methods: {
      back () {
        backToUpLevel(this)
      },
      submit () {
        if (this.content !== '') {
          // 更新分数
          console.log('提交的分数', this.score)
          updateScore(this.title, this.currentScore, this.score).then(response => {
            if (response.data.error_code === 0) {
              const text = this.content.replace(/\n/g, '<br>')
              // 提交评论
              submitComment(sessionStorage.getItem('userName'), this.title, text, this.score).then(response => {
                const res = response.data
                if (res.error_code === 0) {
                  setTimeout(() => {
                    this.simpleToast('发表成功！')
                  }, 500)
                  backToUpLevel(this)
                } else {
                  this.simpleToast('发表失败 T_T')
                  this.content = ''
                }
              })
            } else {
              this.simpleToast(response.data.msg)
            }
          })
        } else {
          this.simpleToast('还没写下任何东西...')
        }
      },
      getScore (data) {
        this.score = data * 2 // 10分制
      }
    },
    mounted () {
      this.title = this.$route.query.title
      this.currentScore = this.$route.query.currentScore
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .comment-write-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    background: white;
    z-index: 500;

    .star-wrapper {
      @include center;
      height: px2rem(150);
    }

    .bottom-line {
      width: 90%;
      margin: 0 auto;
      border: solid px2rem(1) #eee;
    }

    .input-wrapper {
      margin: px2rem(10) px2rem(5);
      width: 100%;
      height: 60%;
      @include center.input {
        font-size: px2rem(16);
        color: #5e6369;
        width: 95%;
        height: 100%;

        border: none;
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }

    .comment-title-submit-wrapper {
      width: 80%;
      @include center;
      margin: 0 auto;
      border-radius: px2rem(10);
      bottom: 0;
      background: $color-blue;
      height: px2rem(40);

      .comment-title-submit {
        font-size: px2rem(16);
        color: white;
      }
    }
  }
</style>
