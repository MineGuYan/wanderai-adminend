<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

// 反馈数据类型
interface Feedback {
  id: number
  username: string
  nickname: string
  content: string
  createTime: string
  deleting?: boolean
}

// 分页数据类型
interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

// 反馈列表数据
const feedbackList = ref<Feedback[]>([])
const loading = ref(false)

// 分页数据
const pagination = ref<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 自定义序号
const indexMethod = (index: number) => {
  return (pagination.value.currentPage - 1) * pagination.value.pageSize + index + 1
}

// 截断长文本
const truncateContent = (content: string) => {
  return content.length > 50 ? content.substring(0, 50) + '...' : content
}

// 获取反馈列表
const fetchFeedbackList = async () => {
  try {
    loading.value = true
    // 这里替换为实际的API调用
    // 模拟API请求
    const mockData = {
      data: [
        {
          id: 1,
          username: 'user1',
          nickname: '用户1',
          content: '这个产品非常好用，但是希望能增加更多的自定义功能，比如主题颜色切换和布局调整。',
          createTime: '2023-05-10 14:30:22'
        },
        {
          id: 2,
          username: 'user2',
          nickname: '测试用户',
          content: '遇到了一些bug，在保存数据时偶尔会失败，希望能尽快修复。',
          createTime: '2023-05-11 09:15:33'
        },
        {
          id: 3,
          username: 'admin',
          nickname: '管理员',
          content: '建议添加批量操作功能，目前只能单个处理，效率较低。',
          createTime: '2023-05-12 16:45:10'
        },
        // 更多模拟数据...
      ],
      total: 15
    }

    feedbackList.value = mockData.data
    pagination.value.total = mockData.total
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
    `确定要删除用户 "${feedback.nickname}" 的反馈吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      feedback.deleting = true
      // 这里替换为实际的删除API调用
      // 模拟删除请求
      await new Promise(resolve => setTimeout(resolve, 800))

      feedbackList.value = feedbackList.value.filter(item => item.id !== feedback.id)
      pagination.value.total -= 1
      ElMessage.success('删除成功')
    } catch (error) {
      ElMessage.error('删除失败')
      console.error(error)
    } finally {
      feedback.deleting = false
    }
  }).catch(() => {
    // 用户取消删除
  })
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
        <div class="header-actions">
          <el-button type="primary" @click="fetchFeedbackList" :loading="loading">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>

      <el-table
        :data="feedbackList"
        border
        stripe
        style="width: 100%"
        v-loading="loading"
        empty-text="暂无反馈数据"
      >
        <el-table-column
          label="序号"
          width="80"
          type="index"
          :index="indexMethod"
        />

        <el-table-column
          prop="nickname"
          label="用户昵称"
          width="150"
        />

        <el-table-column
          prop="username"
          label="用户账号"
          width="180"
        />

        <el-table-column
          prop="content"
          label="反馈内容"
          min-width="300"
        >
          <template #default="{ row }">
            <el-popover
              placement="top-start"
              width="400"
              trigger="hover"
              :content="row.content"
              v-if="row.content && row.content.length > 50"
            >
              <template #reference>
                <div class="content-preview">
                  {{ truncateContent(row.content) }}
                </div>
              </template>
            </el-popover>
            <span v-else>{{ row.content || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          label="反馈时间"
          width="180"
        />

        <el-table-column
          label="操作"
          width="120"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
              :loading="row.deleting"
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