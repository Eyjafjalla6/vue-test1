<template>
  <div class="forget-container">
    <div class="forget-card">
      <h2 class="forget-title">密码重置</h2>
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="forgetForm"
        label-position="top"
        class="forget-form"
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
          @click="handleForget"
          class="forget-btn"
          :loading="loading"
        >
          重置密码
        </el-button>
        
        <div class="forget-footer">
        <router-link to="/register">注册用户</router-link>
        <router-link to="/login">立即登录</router-link>
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
    ...mapActions(['forget']),
    async handleForget() {
      try {
        const res=await this.forget(this.form)
        this.$message.success(res.message)
        this.$router.push('/login')
      } catch (error) {
        console.log("Forget.vue error: ",error)
        this.$message.error(error.response?.data?.detail || '重置失败')
      }
    }
  }
}
</script>

<style scoped>
.forget-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.forget-card {
  width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.forget-title {
  margin-bottom: 30px;
  color: #303133;
  text-align: center;
  font-size: 24px;
  font-weight: 500;
}

.forget-form {
  margin-top: 20px;
}

.forget-btn {
  width: 100%;
  height: 44px;
  margin-top: 20px;
  font-size: 16px;
}

.forget-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.forget-footer a {
  color: #606266;
  font-size: 14px;
  text-decoration: none;
}

.forget-footer a:hover {
  color: #409eff;
  text-decoration: underline;
}
</style>