<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {User, Comment, SwitchButton, ArrowDown, HomeFilled} from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = ref('home') // 默认激活用户管理

// 从路由中获取当前激活的菜单
const updateActiveMenu = () => {
  const routeName = router.currentRoute.value.name?.toString() || ''
  if (['user-management', 'feedback-management'].includes(routeName)) {
    activeMenu.value = routeName
  }
}

// 初始化时设置激活菜单
updateActiveMenu()

// 监听路由变化
watch(() => router.currentRoute.value, () => {
  updateActiveMenu()
})

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  router.push({ name: index })
}

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
  <div class="sidebar-container">
    <div class="sidebar-logo">
      <h1>漫游精灵管理系统</h1>
    </div>

    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      @select="handleMenuSelect"
    >
      <el-menu-item index="home">
        <el-icon><HomeFilled /></el-icon>
        <span>首页</span>
      </el-menu-item>

      <el-menu-item index="user">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>

      <el-menu-item index="feedback">
        <el-icon><Comment /></el-icon>
        <span>用户反馈</span>
      </el-menu-item>

      <!-- 可以继续添加其他菜单项 -->
    </el-menu>

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
            <el-dropdown-item command="logout">
              <el-icon><SwitchButton /></el-icon>退出登录
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
  border-right: none;
  background-color: #001529;
  /*设置为弹性布局*/
  display:flex;
  /*设置垂直排列菜单项*/
  flex-direction: column;
  /*使菜单项在水平方向上居中对齐*/
  align-items:center;
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
</style>