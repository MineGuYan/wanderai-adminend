<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {Refresh, Search} from '@element-plus/icons-vue'
import type { Feedback, Pagination } from "../model/model.ts";
import api from "../api/request.ts";

// 反馈列表数据
const feedbackList = ref<Feedback[]>([])
const loading = ref(false)
const searchKeyword = ref('')

// 分页数据
const pagination = ref<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 截断长文本
const truncateContent = (content: string) => {
  return content.length > 50 ? content.substring(0, 50) + '...' : content
}

// 获取反馈列表
const fetchFeedbackList = async () => {
  try {
    loading.value = true

    const response = await api.get('/admin/getAllSuggestion')

    if (response.data.code === 1) {
      feedbackList.value = response.data.data
      pagination.value.total = response.data.data.length
    } else {
      ElMessage.error('获取反馈列表失败: ' + response.data.message)
      return
    }
  } catch (error) {
    ElMessage.error('获取反馈列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 删除反馈
const handleDelete = (feedback: Feedback) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${feedback.accountId}" 的该条反馈吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const response = await api.delete('/admin/deleteSuggestion', {
        data: {
          id: feedback.id
        }
      })

      if (response.data.code === 1) {
        feedbackList.value = feedbackList.value.filter(item => item.id !== feedback.id)
        pagination.value.total -= 1
        ElMessage.success('删除成功')
      } else {
        ElMessage.error('删除请求失败: ' + response.data.message)
        return
      }
    } catch (error) {
      ElMessage.error('删除失败')
      console.error(error)
    }
  })
}

// 搜索反馈
const handleSearch = async () => {
  if (searchKeyword.value.trim() === '') {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  try {
    const response = await api.get('/admin/getSuggestion', {
      params: {
        accountId: searchKeyword.value
      }
    })

    if (response.data.code === 1) {
      feedbackList.value = response.data.data
      pagination.value.total = response.data.data.length
      pagination.value.currentPage = 1
      if (pagination.value.total === 0) {
        ElMessage.info('未找到相关反馈')
      }
    } else {
      ElMessage.error('搜索反馈失败: ' + response.data.message)
    }
  } catch (error) {
    ElMessage.error('搜索反馈请求失败')
    console.error(error)
  }
}

// 清除搜索
const handleSearchClear = () => {
  searchKeyword.value = ''
  pagination.value.currentPage= 1
  fetchFeedbackList()
}

// 组件挂载时获取反馈列表
onMounted(() => {
  fetchFeedbackList()
})
</script>

<template>
  <div class="feedback-container">
    <el-card class="feedback-card">
      <div class="header">
        <h2>用户反馈列表</h2>
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
        <div class="header-actions">
          <el-button type="primary" @click="handleSearchClear" :loading="loading">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>

      <el-table :data="feedbackList" border stripe style="width: 100%" v-loading="loading" empty-text="暂无反馈数据">
        <el-table-column prop="id" label="ID" width="80"/>
        <el-table-column prop="accountId" label="用户账号" width="180"/>
        <el-table-column prop="message" label="反馈内容" min-width="300">
          <template #default="{ row }">
            <el-popover
              placement="top-start"
              width="400"
              trigger="hover"
              :content="row.message"
              v-if="row.message && row.message.length > 50"
            >
              <template #reference>
                <div class="content-preview">
                  {{ truncateContent(row.message) }}
                </div>
              </template>
            </el-popover>
            <span v-else>{{ row.message || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleDelete(row)" :loading="row.deleting">
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
          @size-change="fetchFeedbackList"
          @current-change="fetchFeedbackList"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.feedback-container {
  padding: 20px;
}

.feedback-card {
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.content-preview {
  cursor: pointer;
  color: #409eff;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>