export type TaskId = number

export type TaskStatus = 'todo' | 'doing' | 'done'

export interface TaskDetail {
    id: TaskId
    title: string
    description: string
    status: TaskStatus
    createTime: string
    updateTime: string
    createBy: string
    updateBy: string
}

export type TaskListItem = Pick<TaskDetail, 'id' | 'title' | 'description' | 'status'>

export type TaskEditForm = Pick<TaskDetail, 'id' | 'title' | 'description'>

export const createEmptyTaskEditForm = (): TaskEditForm => ({
    id: 0,
    title: '',
    description: ''
})

export const toTaskListItem = (task: TaskDetail): TaskListItem => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status
})
