import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskList as taskListMock, taskDetail as taskDetailMock } from '@/mock/taskList'
import type { TaskDetail, TaskEditForm, TaskId, TaskListItem } from '@/types/task'
import { toTaskListItem } from '@/types/task'

const formatDateTime = (date: Date) => date.toISOString().slice(0, 19).replace('T', ' ')

export const useTaskListStore = defineStore('taskList', () => {
    const taskList = ref<TaskListItem[]>(taskListMock)
    const taskDetailMap = ref<Map<TaskId, TaskDetail>>(
        new Map(Object.values(taskDetailMock).map((task) => [task.id, task]))
    )

    const setTaskList = (taskListValue: TaskListItem[]) => {
        taskList.value = taskListValue
    }

    const getTaskDetail = (taskId: TaskId) => taskDetailMap.value.get(taskId)

    const updateTask = (taskForm: TaskEditForm) => {
        const currentTaskDetail = taskDetailMap.value.get(taskForm.id)

        if (!currentTaskDetail) {
            return false
        }

        const nextTaskDetail: TaskDetail = {
            ...currentTaskDetail,
            ...taskForm,
            updateTime: formatDateTime(new Date())
        }

        taskDetailMap.value.set(nextTaskDetail.id, nextTaskDetail)

        const nextTaskListItem = toTaskListItem(nextTaskDetail)
        const index = taskList.value.findIndex((item) => item.id === nextTaskListItem.id)

        if (index === -1) {
            taskList.value.push(nextTaskListItem)
        } else {
            taskList.value.splice(index, 1, nextTaskListItem)
        }

        return true
    }

    return {
        taskList,
        taskDetailMap,
        getTaskDetail,
        setTaskList,
        updateTask
    }
})
