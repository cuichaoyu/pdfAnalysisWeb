<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on">
        <div class="title-container">
          <h3 class="title">后台管理系统</h3>
          <h5>欢迎登录</h5>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model.trim="loginForm.username"
            placeholder="输入手机号"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="大写已锁定" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="loginForm.password"
              :type="passwordType"
              placeholder="输入密码"
              name="密码"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:400px;margin-left: 100px "
          @click.native.prevent="handleLogin"
        >登录
        </el-button>
    </el-form>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getUUID } from '@/utils'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',

      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '账号不能为空'}],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空'}]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('提交 失败!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

/* 重置 element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 33px;
        width: 85%;

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 5px 5px 5px 15px;
            // color: $light_gray;
            color: #454545;
            height: 33px;
            caret-color: $cursor;

            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        // background: rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(0, 0, 0, 0.3);
        // border-radius: 5px;
        color: #454545;
        margin-bottom: 30px !important;
    }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
        position: absolute;
        width: 600px;
        height: 400px;
        background: #fff;
        border-radius: 20px;
        max-width: 100%;
        // padding: 160px 35px 0;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        overflow: hidden;
    }

    .login-form-left {
        width: 500px;
        height: 100%;
        float: left;

        img {
          width: 600px;
          float: left;
        }
    }
    .login-form-right {
        width: 400px;
        height: 100%;
        float: right;
        padding: 40px 50px;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;
        margin-bottom: 40px;
        margin-top: 30px;

        .title {
            font-size: 24px;
            // color: $light_gray;
            margin: 0px auto 20px auto;
            text-align: center;
            font-weight: bold;
        }
        h5 {
            text-align: center;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }

    .thirdparty-button {
        position: absolute;
        right: 0;
        bottom: 6px;
    }

    .captcha-input {
        width: 114px;
    }

    .login-captcha {
        height: 40px;
        padding: 2px 2px 2px 0;

        img {
            height: 100%;
            display: block;
            border-radius: 3px;
            overflow: hidden;
            float: right;
        }
    }

    @media only screen and (max-width: 470px) {
        .thirdparty-button {
            display: none;
        }
    }
}
</style>
