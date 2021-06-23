<template>

  <div class="login_container">
    <div class="login_box">
      <div>
        <el-row :gutter="20">
          <el-col :span="11" :offset="6" class="lab_text">
            ERP后台管理系统
          </el-col>
        </el-row>
        <el-form
          :model="loginForm"
          :rules="loginFormRules"
          ref="loginFormRef"
          label-width="60px"
          class="login_form"
        >
          <el-form-item label="账号"  prop="loginId">
            <el-input @keydown.enter.native="login" v-model="loginForm.loginId" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"
              @keydown.enter.native="login">
            </el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary"  @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          loginId: '',
          password: ''
        },
        // 表单验证
        loginFormRules: {
          loginId: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入用户密码', trigger: 'blur'},
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
          ]
        },
        URL: 'http://localhost:8888/images/',
      }
    },
    methods: {
      // 表单重置按钮
      resetLoginForm() {
        // resetFields：element-ui提供的表单方法
        this.$refs.loginFormRef.resetFields()
      },
      login() {
        var _this = this;
        // 表单预验证
        // valid：bool类型
        this.$refs.loginFormRef.validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            Object.keys(_this.loginForm).forEach(function (key) {
              params.append(key, _this.loginForm[key])
            })
            //表单验证成功，要发送登录请求
            this.axios.post("/users/login", params).then( (response)=> {
              if (response.data.result) {
                this.$message.success(response.data.message)
                var user = response.data.data;
                window.sessionStorage.setItem('id',user.id);
                window.sessionStorage.setItem('loginId',user.loginId);
                window.sessionStorage.setItem('roleName',user.roleName);
                window.sessionStorage.setItem('photo',this.URL+user.photo);
                setTimeout(function () {
                  _this.$router.push("/home");
                }, 1000)
              } else {
                _this.$message.error(response.data.message);
              }
              /*this.$router.push('/home')*/
            }).catch(function (error) {
              alert("服务端获取数据失败");
            });
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  /* 全局样式 */
  html,
  body,
  #app {
    height: 100%;
    margin: 0;
    padding: 0;
    min-width: 1366px;
  }

  .login_container {
    background:url("../components/warehouse/img/img0_3840x2160.jpg");
    width:100%;			//大小设置为100%
    height:100%;			//大小设置为100%
    position:fixed;
    background-size:100% 100%;
  }

  .login_box {
    width: 450px;
    height: 360px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    background-color: #fff;

  }

  .login_form {
    position: absolute;
    bottom: 60px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: center;
  }

  .info {
    font-size: 13px;
    margin: 10px 15px;
  }
  .lab_text{
    font-size: 25px;
    margin-top: 40px;
  }
</style>
