import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/composables/useApi'

const COLUMNS = ['todo', 'inprogress', 'done']

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)
  const activityLog = ref([])

  // Getters
  const tasksByColumn = computed(() => {
    return COLUMNS.reduce((acc, col) => {
      acc[col] = tasks.value.filter(t => t.status === col)
      return acc
    }, {})
  })

  const taskCountByColumn = computed(() => {
    return COLUMNS.reduce((acc, col) => {
      acc[col] = tasksByColumn.value[col].length
      return acc
    }, {})
  })

  // Actions
  async function fetchTasks() {
    loading.value = true
    try {
      const { data } = await api.get('/tasks')
      tasks.value = data
    } catch (err) {
      error.value = 'Failed to load tasks'
    } finally {
      loading.value = false
    }
  }

  async function createTask(payload) {
    try {
      const { data } = await api.post('/tasks', payload)
      tasks.value.push(data)
      addActivity(`New task created: "${data.title}"`, 'create')
    } catch (err) {
      error.value = 'Failed to create task'
    }
  }

  // Optimistic UI: update locally first, then sync with backend
  async function moveTask(taskId, newStatus) {
    const task = tasks.value.find(t => t._id === taskId)
    if (!task || task.status === newStatus) return

    const prevStatus = task.status
    const statusLabel = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' }

    // OPTIMISTIC UPDATE — instant UI response
    task.status = newStatus
    addActivity(`"${task.title}" moved to ${statusLabel[newStatus]}`, 'move')

    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus })
    } catch (err) {
      // ROLLBACK on failure
      task.status = prevStatus
      error.value = 'Failed to update task status'
    }
  }

  async function updateTask(taskId, payload) {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, payload)
      const idx = tasks.value.findIndex(t => t._id === taskId)
      if (idx !== -1) tasks.value[idx] = data
    } catch (err) {
      error.value = 'Failed to update task'
    }
  }

  async function deleteTask(taskId) {
    const task = tasks.value.find(t => t._id === taskId)
    tasks.value = tasks.value.filter(t => t._id !== taskId)
    addActivity(`"${task?.title}" was deleted`, 'delete')
    try {
      await api.delete(`/tasks/${taskId}`)
    } catch (err) {
      if (task) tasks.value.push(task)
      error.value = 'Failed to delete task'
    }
  }

  function addActivity(message, type = 'info') {
    activityLog.value.unshift({
      id: Date.now(),
      message,
      type,
      time: new Date().toISOString()
    })
    if (activityLog.value.length > 20) activityLog.value.pop()
  }

  function clearError() { error.value = null }

  return {
    tasks, loading, error, activityLog,
    tasksByColumn, taskCountByColumn,
    fetchTasks, createTask, moveTask, updateTask, deleteTask, clearError
  }
})