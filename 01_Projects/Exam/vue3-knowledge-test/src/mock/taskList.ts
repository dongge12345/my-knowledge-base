import type { TaskDetail, TaskId, TaskListItem } from '@/types/task'

export const taskList: TaskListItem[] = [
    {
        id: 1,
        title: 'Task 1',
        description: 'Review the Vue 3 Composition API basics.',
        status: 'todo'
    },
    {
        id: 2,
        title: 'Task 2',
        description: 'Practice reactive state with Pinia.',
        status: 'doing'
    },
    {
        id: 3,
        title: 'Task 3',
        description: 'Build a typed form with Element Plus.',
        status: 'done'
    },
    {
        id: 4,
        title: 'Task 4',
        description: 'Refactor the task detail page with route guards.',
        status: 'todo'
    }
]

export const taskDetail: Record<TaskId, TaskDetail> = {
    1: {
        id: 1,
        title: 'Task 1',
        description: 'Review the Vue 3 Composition API basics.',
        status: 'todo',
        createTime: '2023-01-01 00:00:00',
        updateTime: '2023-01-01 00:00:00',
        createBy: 'admin',
        updateBy: 'admin'
    },
    2: {
        id: 2,
        title: 'Task 2',
        description: 'Practice reactive state with Pinia.',
        status: 'doing',
        createTime: '2023-01-02 00:00:00',
        updateTime: '2023-01-03 12:00:00',
        createBy: 'admin',
        updateBy: 'mentor'
    },
    3: {
        id: 3,
        title: 'Task 3',
        description: 'Build a typed form with Element Plus.',
        status: 'done',
        createTime: '2023-01-04 00:00:00',
        updateTime: '2023-01-05 18:30:00',
        createBy: 'admin',
        updateBy: 'admin'
    },
    4: {
        id: 4,
        title: 'Task 4',
        description: 'Refactor the task detail page with route guards.',
        status: 'todo',
        createTime: '2023-01-06 00:00:00',
        updateTime: '2023-01-06 00:00:00',
        createBy: 'admin',
        updateBy: 'admin'
    }
}
