<template>
  <div class="task-detail-container">
    <template v-if="taskForm">
      <h1 class="title">Edit Task</h1>
      <el-form class="task-form" :model="taskForm" label-width="120px">
          <el-form-item label="Task ID" prop="id" style="width: 400px;">
              <el-input v-model="taskForm.id" placeholder="Please input task ID" disabled />
          </el-form-item>
          <el-form-item label="Task Title" prop="title" style="width: 400px;">
              <el-input v-model="taskForm.title" placeholder="Please input task title" />
          </el-form-item>
          <el-form-item label="Description" prop="description" style="width: 400px;">
              <el-input v-model="taskForm.description" placeholder="Please input task description" />
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submitForm">Submit</el-button>
          </el-form-item>
      </el-form>
    </template>
    <p v-else class="empty-state">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskListStore } from '@/store/taskList'
import type { TaskEditForm } from '@/types/task'
import { parseRouteId } from '@/utils/route'

const route = useRoute()
const router = useRouter()
const taskListStore = useTaskListStore()
const taskForm = ref<TaskEditForm | null>(null)
const errorMessage = ref('Task not found.')

const submitForm = () => {
    if (!taskForm.value) {
        return
    }

    const isUpdated = taskListStore.updateTask(taskForm.value)

    if (isUpdated) {
        router.push({
            name: 'taskDetail',
            params: {
                id: taskForm.value.id
            }
        })
    }
}

onBeforeMount(() => {
    const taskId = parseRouteId(route.params.id)

    if (taskId === null) {
        errorMessage.value = 'Invalid task id.'
        return
    }

    const currentTaskDetail = taskListStore.getTaskDetail(taskId)

    if (!currentTaskDetail) {
        errorMessage.value = `Task ${taskId} does not exist.`
        return
    }

    taskForm.value = {
        id: currentTaskDetail.id,
        title: currentTaskDetail.title,
        description: currentTaskDetail.description
    }
})
</script>

<style scoped lang="less">
.task-detail-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}

.task-form {
    width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;

    label {
      text-align: left;
    }
}

.empty-state {
    color: #909399;
}
</style>
