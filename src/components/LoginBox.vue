<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Lock,
  User
} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
import api from "../api/request.ts";

// 登录表单数据
const loginForm = ref({
  userid: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  userid: [
    { required: true, message: '请输入管理员账号', trigger: 'blur' },
    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
  ]
}

const loading = ref(false)
const loginFormRef = ref()
const router = useRouter()

// 登录方法
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()

    loading.value = true

    try {
      const response = await api.post('/admin/login',{
        adminId: loginForm.value.userid,
        password: loginForm.value.password
      })

      if (response.data.code === 1) {
        ElMessage.success('登录成功')
        localStorage.setItem('token', response.data.data.token)
        loading.value = false
        await router.push('/')
      } else {
        ElMessage.error('登录失败，请稍后重试')
      loading.value = false
      return false
      }
    } catch (error) {
      ElMessage.error('登录请求失败，请稍后重试')
      loading.value = false
      return false
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入')
    return false
  }
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
        <el-form-item prop="userid">
          <el-input
            v-model="loginForm.userid"
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