<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
import api from "../api/request.ts";
import type { Account } from "../model/model.ts";

// 用户列表数据
const userList = ref<Account[]>([])
const loading = ref(false)
const searchKeyword = ref('')

// 自定义序号
const indexMethod = (index: number) => {
  return index + 1
}

// 获取用户列表
const fetchUserList = async () => {
  try {
    loading.value = true

    const response = await api.get('/admin/getUsers')

    if (response.data.code === 1) {
      userList.value = response.data.data
    } else {
      ElMessage.error('获取用户列表失败: ' + response.data.message)
    }
  } catch (error) {
    ElMessage.error('获取用户列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 删除用户
const handleDelete = (user: Account) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${user.nickname} (${user.accountId})" 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const response = await api.delete('/admin/deleteAccount',{
        data: {
          accountId:user.accountId
        }
      })

      if (response.data.code === 1) {
        userList.value = userList.value.filter(u => u.accountId !== user.accountId)
        ElMessage.success('删除成功')
      } else {
        ElMessage.error('删除请求失败')
      }
    } catch (error) {
      ElMessage.error('删除请求失败')
      console.error(error)
    }
  })
}

// 搜索用户
const handleSearch = async () => {
  if (searchKeyword.value.trim() === '') {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  try {
    const response = await api.get('/admin/getAccount', {
      params: {
        accountId: searchKeyword.value
      }
    })
    if (response.data.code === 1) {
      userList.value = [response.data.data]
      if (response.data.data.length === 0) {
        ElMessage.warning('未找到匹配的用户')
      }
    } else {
      ElMessage.error('搜索失败: ' + response.data.message)
    }
  } catch (error) {
    ElMessage.error('搜索请求失败')
    console.error(error)
  }
}

// 清除搜索
const handleSearchClear = () => {
  searchKeyword.value = ''
  fetchUserList()
}

// 组件挂载时获取用户列表
onMounted(() => {
  fetchUserList()
})
</script>

<template>
  <div class="user-list-container">
    <el-card class="user-list-card">
      <div class="header">
        <h2>用户列表</h2>
        <el-input v-model="searchKeyword"
          placeholder="搜索账号"
          clearable
          style="width: 300px"
          @clear="handleSearchClear"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearchClear" :loading="loading">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>

      <el-table :data="userList" border stripe style="width: 100%" v-loading="loading">
        <el-table-column label="序号" width="80" type="index" :index="indexMethod"/>
        <el-table-column prop="accountId" label="账号" width="180" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="danger" size="small" @click="handleDelete(scope.row)" :loading="scope.row.deleting">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.user-list-container {
  padding: 20px;
}

.user-list-card {
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>