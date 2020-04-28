<template>
  <div class="login-wrapper">
    <div class="form-wrapper" :style="height">
      <span class="login-text">登陆</span>
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
          <input type="password" class="input" placeholder="请输入密码" v-model="password">
        </div>
        <div class="error-input" v-show="isErrorPassword">{{errorMsg}}</div>
      </div>
      <div class="forget-wrapper" @click="rePass">忘记密码 ></div>
      <div class="btn-wrapper">
        <input type="submit" value="登陆" class="btn login" @click="login()"/>
        <input type="submit" value="注册" class="btn register" @click="register"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { login } from '../../api/store'
  import { userMixin } from '../../utils/mixin'
  import { px2rem } from '../../utils/book'

  export default {
    name: 'login',
    mixins: [userMixin],
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
          height: px2rem(230) + 'rem'
        }
      }
    },
    methods: {
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
          this.errorMsg = '* 请输入密码'
          return false
        } else {
          return true
        }
      },
      login () {
        this.resetInput()
        if (this.isInput()) {
          login(this.username, this.password).then(response => {
            const result = response.data
            // 登陆成功
            if (result.error_code === 0) {
              this.setUserName(this.username)
              sessionStorage.setItem('userName', this.username) // 保存用户名
              sessionStorage.setItem('isLogin', 1) // 保存用户名
              this.$router.push('/store/home')
              setTimeout(() => {
                this.simpleToast(result.msg + this.userName)
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
      },
      register () {
        this.$router.push({
          path: '/register'
        })
      },
      rePass () {
        this.$router.push({
          path: '/setPassWord'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/login";
</style>
