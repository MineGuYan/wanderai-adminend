<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {User, Comment, SwitchButton, ArrowDown} from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = ref('user') // 默认激活用户管理

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  router.push({ name: index })
}

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
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
    localStorage.removeItem('token')
    router.push('/login')
  })
}
</script>

<template>
  <div class="sidebar-container">
    <div class="sidebar-logo">
      <h1>漫游精灵管理系统</h1>
    </div>

    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      @select="handleMenuSelect"
    >
      <el-menu-item index="user">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>

      <el-menu-item index="feedback" class="menu-item">
        <el-icon><Comment /></el-icon>
        <span>用户反馈</span>
      </el-menu-item>

      <!-- 可以继续添加其他菜单项 -->
    </el-menu>

    <div class="settings">
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="34" class="avatar">管</el-avatar>
          <span class="nickname">管理员</span>
          <el-icon><arrow-down /></el-icon>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  height: 100%;
  width: 12%;
  background-color: #001529;
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #002140;
}

.sidebar-logo h1 {
  margin: 0;
  font-size: 18px;
  color: white;
  white-space: nowrap;
}

.sidebar-menu {
  width: 100%;
  border-right: none;
  background-color: #001529;
  /*设置为弹性布局*/
  display:flex;
  /*设置垂直排列菜单项*/
  flex-direction: column;
}

.sidebar-menu .menu-item{
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 18px;
}

.sidebar-menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.65);
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  color: white;
  background-color: #1890ff !important;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background-color: #1890ff !important;
  color: white;
}

.sidebar-menu :deep(.el-icon) {
  color: inherit;
  margin-right: 8px;
  font-size: 18px;
}

.avatar {
  margin-right: 8px;
  background-color: #409eff;
  color: #fff;
}

.settings {
  width: 100%;
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid #002140;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

/*el-dropdown 组件有自己的默认样式和布局规则，需穿透*/
.settings :deep(.el-dropdown) {
  width: 100%;
  display: flex;
  justify-content: center;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.65);
  transition: color 0.3s;
}

.user-info:hover {
  color: white;
}

.nickname {
  margin-right: 8px;
  font-size: 20px;
}
</style>