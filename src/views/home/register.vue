<template>
  <div class="login-wrapper">
    <div class="form-wrapper" :style="height">
      <span class="login-text">注册</span>
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
      <div class="input-wrapper">
        <div class="form">
          <div class="icon-password icon-home"></div>
          <input type="password" class="input" placeholder="请再次输入密码" v-model="rePass">
        </div>
        <div class="error-input" v-show="isErrorDuplicatePassword">{{errorMsg}}</div>
      </div>
      <div class="btn-wrapper">
        <input type="submit" value="注册" class="btn login" @click="register"/>
        <input type="submit" value="返回" class="btn" @click="back"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { backToUpLevel } from '../../utils/store'
  import { register } from '../../api/store'
  import { px2rem } from '../../utils/book'

  export default {
    name: 'register',
    computed: {
      height () {
        return {
          height: px2rem(270) + 'rem'
        }
      }
    },
    data () {
      return {
        username: '',
        password: '',
        rePass: '',
        isErrorUsername: false,
        isErrorPassword: false,
        isErrorDuplicatePassword: false,
        errorMsg: ''
      }
    },
    methods: {
      back () {
        backToUpLevel(this)
      },
      resetInput () {
        this.isErrorUsername = false
        this.isErrorPassword = false
        this.isErrorDuplicatePassword = false
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
        } else if (this.password !== this.rePass) {
          this.isErrorDuplicatePassword = true
          this.errorMsg = '* 两次输入密码不相同'
          return false
        } else {
          return true
        }
      },
      register () {
        this.resetInput()
        if (this.isInput()) {
          register(this.username, this.password).then(response => {
            const result = response.data
            // 注册成功
            if (result.error_code === 0) {
              this.$router.push('/login')
              setTimeout(() => {
                this.simpleToast(result.msg)
              }, 500)
              // 失败
            } else if (result.error_code === 1 && result.msg.errno === 1062) {
              this.simpleToast('当前同户名已存在！')
            } else {
              this.simpleToast(result.msg)
            }
            this.resetInput()
            this.username = ''
            this.password = ''
            this.rePass = ''
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/login";
</style>
