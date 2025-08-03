<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">用户注册</h2>
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="registerForm"
        label-position="top"
        class="register-form"
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
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            type="password" 
            v-model="form.confirmPassword" 
            placeholder="请再次输入密码"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>
        
        <el-button 
          type="primary" 
          @click="handleRegister"
          class="register-btn"
          :loading="loading"
        >
          立即注册
        </el-button>
        
        <div class="login-link">
          已有账号？<router-link to="/login">立即登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapActions } from 'vuex'

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['register']),
    async handleRegister() {
      try {
        await this.register(this.form)
        this.$message.success('注册成功')
        this.$router.push('/login')
      } catch (error) {
        this.$message.error(error.response?.data?.detail || '注册失败')
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.register-card {
  width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.register-title {
  margin-bottom: 30px;
  color: #303133;
  text-align: center;
  font-size: 24px;
  font-weight: 500;
}

.register-form {
  margin-top: 20px;
}

.register-btn {
  width: 100%;
  height: 44px;
  margin-top: 10px;
  font-size: 16px;
}

.login-link {
  margin-top: 20px;
  text-align: center;
  color: #909399;
}

.login-link a {
  color: #409eff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>