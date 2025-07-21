<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, User, SwitchButton } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

// 定义props
interface Props {
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '系统标题'
})

// 用户信息类型
interface UserInfo {
  id: number
  username: string
  nickname?: string
  avatar?: string
}

// 模拟用户数据 - 实际应用中应从store或API获取
const userInfo = ref<UserInfo>({
  id: 1,
  username: 'admin',
  nickname: '管理员',
  avatar: ''
})

const router = useRouter()

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '退出确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 这里替换为实际的退出登录API调用
    // 模拟退出请求
    setTimeout(() => {
      ElMessage.success('退出成功')
      // 退出成功后跳转到登录页
      router.push('/login')
    }, 500)
  }).catch(() => {
    // 用户取消退出
  })
}
</script>

<template>
  <div class="header-container">
    <el-header class="main-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="title">{{ title }}</h1>
        </div>

        <div class="header-right">
          <el-dropdown @command="handleCommand" v-if="userInfo">
            <div class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar" class="avatar">
                {{ userInfo.nickname?.charAt(0) || 'U' }}
              </el-avatar>
              <span class="nickname">{{ userInfo.nickname || userInfo.username }}</span>
              <el-icon><arrow-down /></el-icon>
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
  </div>
</template>

<style scoped>
.header-container {
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.main-header {
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.title {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
  height: 60px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.avatar {
  margin-right: 8px;
  background-color: #409eff;
  color: #fff;
}

.nickname {
  margin-right: 5px;
  font-size: 14px;
  color: #333;
}
</style>