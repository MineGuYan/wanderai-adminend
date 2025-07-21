<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { User, Comment } from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = ref('user-management') // 默认激活用户管理

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

      <el-menu-item index="feedback">
        <el-icon><Comment /></el-icon>
        <span>用户反馈</span>
      </el-menu-item>

      <!-- 可以继续添加其他菜单项 -->
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar-container {
  height: 100%;
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
</style>