<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

// 用户数据类型
interface User {
  id: number
  username: string
  nickname: string
  createTime: string
  deleting?: boolean
}

// 分页数据类型
interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

// 用户列表数据
const userList = ref<User[]>([])
const loading = ref(false)

// 分页数据
const pagination = ref<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 获取用户列表
const fetchUserList = async () => {
  try {
    loading.value = true
    // 这里替换为实际的API调用
    // 模拟API请求
    const mockData = {
      data: [
        { id: 1, username: 'admin', nickname: '管理员', createTime: '2023-01-01 10:00:00' },
        { id: 2, username: 'user1', nickname: '用户1', createTime: '2023-01-02 11:00:00' },
        { id: 3, username: 'user2', nickname: '用户2', createTime: '2023-01-03 12:00:00' },
        // 更多模拟数据...
      ],
      total: 3
    }

    userList.value = mockData.data
    pagination.value.total = mockData.total
  } catch (error) {
    ElMessage.error('获取用户列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 删除用户
const handleDelete = (user: User) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${user.nickname} (${user.username})" 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      user.deleting = true
      // 这里替换为实际的删除API调用
      // 模拟删除请求
      await new Promise(resolve => setTimeout(resolve, 1000))

      userList.value = userList.value.filter(u => u.id !== user.id)
      pagination.value.total -= 1
      ElMessage.success('删除成功')
    } catch (error) {
      ElMessage.error('删除失败')
      console.error(error)
    } finally {
      user.deleting = false
    }
  }).catch(() => {
    // 用户取消删除
  })
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
        <el-button type="primary" @click="fetchUserList" :loading="loading">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>

      <el-table
        :data="userList"
        border
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="账号" width="180" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
              :loading="scope.row.deleting"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchUserList"
          @current-change="fetchUserList"
        />
      </div>
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