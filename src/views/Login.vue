
<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>系统登录</h2>
        <p>欢迎回来，请登录您的账号</p>
      </div>
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="loginForm"
        label-position="top"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            type="password" 
            v-model="form.password" 
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>
        
        <el-button 
          type="primary" 
          @click="handleLogin"
          class="login-btn"
          :loading="loading"
        >
          登 录
        </el-button>
        
        <div class="login-footer">
          <router-link to="/register" class="register-link">注册新账号</router-link>
          <router-link to="/forget" class="forget-link">忘记密码?</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      form: {
        username: 'admin',//在data中直接设置form对象的默认值‌
        password: '123456'
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loading: false
    }
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        this.loading = true
        await this.login(this.form) //api请求逻辑移动到store
        this.$router.push('/')//跳转到首页
      } catch (error) {
        const errorMsg = error.message || '用户名或密码错误'
        this.$message.error(errorMsg+", detail: "+error.response?.data?.detail)
      }finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #303133;
  font-size: 24px;
  margin-bottom: 10px;
}

.login-header p {
  color: #909399;
  font-size: 14px;
}

.login-form {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
  height: 44px;
  margin-top: 20px;
  font-size: 16px;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.login-footer a {
  color: #606266;
  font-size: 14px;
  text-decoration: none;
}

.login-footer a:hover {
  color: #409eff;
}

.register-link {
  color: #409eff !important;
}
</style>