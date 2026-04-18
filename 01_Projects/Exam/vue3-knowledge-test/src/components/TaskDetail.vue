<template>
  <div class="task-detail-container">
    <template v-if="taskDetail">
      <h1>Task Detail</h1>
      <p>ID: {{ taskDetail.id }}</p>
      <p>Name: {{ taskDetail.title }}</p>
      <p>Description: {{ taskDetail.description }}</p>
      <p>Status: {{ taskDetail.status }}</p>
      <p>Created At: {{ taskDetail.createTime }}</p>
      <p>Updated At: {{ taskDetail.updateTime }}</p>
      <p>Created By: {{ taskDetail.createBy }}</p>
      <p>Updated By: {{ taskDetail.updateBy }}</p>
    </template>
    <p v-else class="empty-state">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskListStore } from '@/store/taskList'
import type { TaskDetail as TaskDetailModel } from '@/types/task'
import { parseRouteId } from '@/utils/route'

const route = useRoute()
const taskListStore = useTaskListStore()
const taskDetail = ref<TaskDetailModel | null>(null)
const errorMessage = ref('Task not found.')

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

    taskDetail.value = currentTaskDetail
})
</script>

<style scoped lang="less">
.task-detail-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.empty-state {
    color: #909399;
}
</style>
