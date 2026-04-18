<template>
  <div>
    <el-form class="search-form">
        <el-form-item label="Task Name" prop="searchText" inline>
            <el-input v-model="searchText" placeholder="Please input task name" style="width: 200px;" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSearch">Search</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="showTaskList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="50" />
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="description" label="Description" />
        <el-table-column prop="status" label="Status" />
        <el-table-column label="Actions" width="200">
            <template #default="scope">
                <el-button type="primary" size="small" @click="handleDetail(scope.row)">Detail</el-button>
                <el-button type="primary" size="small" @click="handleEdit(scope.row)">Edit</el-button>
            </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useTaskListStore } from '@/store/taskList'
import type { TaskListItem } from '@/types/task'

const router = useRouter()
const taskListStore = useTaskListStore()
const { taskList } = storeToRefs(taskListStore)
const searchText = ref('')

const showTaskList = computed(() => {
    const keyword = searchText.value.trim().toLowerCase()

    if (!keyword) {
        return taskList.value
    }

    return taskList.value.filter((item) => item.title.toLowerCase().includes(keyword))
})

const handleSearch = () => {
    searchText.value = searchText.value.trim()
}

const handleDetail = (row: TaskListItem) => {
    router.push({
        name: 'taskDetail',
        params: {
            id: row.id
        }
    })
}

const handleEdit = (row: TaskListItem) => {
    router.push({
        name: 'taskEdit',
        params: {
            id: row.id
        }
    })
}
</script>

<style scoped lang="less">
.search-form {
    margin-bottom: 20px;
    display: flex;
    justify-content: right;
    gap: 20px;
}
</style>
