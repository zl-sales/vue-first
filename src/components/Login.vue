<template>
  <div id="login-container">
    <div id="login-box">
      <div id="avatar-box">
        <img src="../assets/img/logo.png" alt>
      </div>
      <div id="login-box">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username">
              <i slot="prefix" class="iconfont icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password">
              <i slot="prefix" class="iconfont icon-3702mima"></i>
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :offset="9">
              <!-- <el-button type="primary"  circle></el-button> -->
              <el-button type="success" @click="login()" circle icon="el-icon-check"></el-button>
              <el-button type="primary" @click="resetForm()" circle icon="el-icon-close"></el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async Bool => {
        if (Bool) {
          const { data: info } = await this.$http.post('/login', this.loginForm)
          if (info.meta.status === 200) {
            window.sessionStorage.setItem('token', info.data.token)
            this.$message({
              message: info.meta.msg,
              type: 'success',
              duration: 1000
            })
            return this.$router.push('/home')
          } else {
            this.$message({
              message: info.meta.msg,
              type: 'warning',
              duration: 1000
            })
          }
        }
      })
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    }
  },
  data() {
    return {
      // 登录form表单需要的数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  // background-image: -webkit-radial-gradient(90deg,hotpink, lightskyblue);
  background-image: -webkit-radial-gradient(0px 0px, hotpink, lightskyblue);
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-image: -webkit-radial-gradientrgb(76, 180, 232);
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #avatar-box {
      z-index: 10;
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px lightgoldenrodyellow;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
.el-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-button:first-child {
    background-image: -webkit-radial-gradient(0px 0px, hotpink, lightskyblue);
    border: none;
  }
  .el-button:last-child {
    background-image: -webkit-radial-gradient(0px 0px, lightskyblue, hotpink);
    border: none;
  }
}
</style>
