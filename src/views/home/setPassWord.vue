<template>
  <div class="login-wrapper">
    <div class="form-wrapper" :style="height">
      <span class="login-text">重制密码</span>
      <div class="input-wrapper">
        <div class="form">
          <div class="icon-person icon-home"></div>
          <input type="text" class="input" placeholder="请输入用户名" v-model="username">
        </div>
        <div class="error-input" v-show="isErrorUsername">{{errorMsg}}</div>
      </div>
      <div class="input-wrapper">
        <div class="form">
          <div class="icon-password icon-home"></div>
          <input type="password" class="input" placeholder="请输入新密码" v-model="password">
        </div>
        <div class="error-input" v-show="isErrorPassword">{{errorMsg}}</div>
      </div>
      <div class="btn-wrapper">
        <input type="submit" value="修改" class="btn login" @click="reSetPassWord"/>
        <input type="submit" value="返回" class="btn" @click="back"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { backToUpLevel } from '../../utils/store'
  import { reSetPass } from '../../api/store'
  import { px2rem } from '../../utils/book'
  export default {
    name: 'setPassword',
    data () {
      return {
        username: '',
        password: '',
        isErrorUsername: false,
        isErrorPassword: false,
        errorMsg: ''
      }
    },
    computed: {
      height () {
        return {
          height: px2rem(220) + 'rem'
        }
      }
    },
    methods: {
      back () {
        backToUpLevel(this)
      },
      resetInput () {
        this.isErrorUsername = false
        this.isErrorPassword = false
        this.errorMsg = ''
      },
      // 判空
      isInput () {
        if (this.username === '') {
          this.isErrorUsername = true
          this.errorMsg = '* 请输入用户名'
          return false
        } else if (this.password === '') {
          this.isErrorPassword = true
          this.errorMsg = '* 请输入新密码'
          return false
        } else {
          return true
        }
      },
      reSetPassWord () {
        this.resetInput()
        if (this.isInput()) {
          reSetPass(this.username, this.password).then(response => {
            const result = response.data
            // 修改成功
            if (result.error_code === 0) {
              this.$router.push('/login')
              setTimeout(() => {
                this.simpleToast(result.msg)
              }, 500)
              // 失败
            } else {
              this.username = ''
              this.password = ''
              this.simpleToast(result.msg)
              this.resetInput()
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../../assets/styles/login";
</style>
