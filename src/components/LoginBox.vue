<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Lock,
  User
} from '@element-plus/icons-vue'

// 登录表单数据
const loginForm = ref({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入管理员账号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const loading = ref(false)
const loginFormRef = ref()

// 登录方法
const handleLogin = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      // 这里替换为实际的登录API调用
      // 模拟登录请求
      setTimeout(() => {
        ElMessage.success('登录成功')
        loading.value = false
        // 登录成功后的操作，例如跳转页面
      }, 1000)
    } else {
      return false
    }
  })
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">管理员登录</h2>
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入管理员账号"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            :loading="loading"
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

.login-button {
  width: 100%;
  margin-top: 10px;
}
</style>