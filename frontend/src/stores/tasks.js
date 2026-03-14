import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

function getApi() {
  const instance = axios.create({ baseURL: '/api' })
  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('tf_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  return instance
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks       = ref([])
  const loading     = ref(false)
  const error       = ref(null)
  const activityLog = ref([])

  const tasksByColumn = computed(() => ({
    todo:       tasks.value.filter(t => t.status === 'todo'),
    inprogress: tasks.value.filter(t => t.status === 'inprogress'),
    done:       tasks.value.filter(t => t.status === 'done'),
  }))

  function addLog(message, type = 'default') {
    activityLog.value.unshift({
      message, type,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    })
    if (activityLog.value.length > 20) activityLog.value.pop()
  }

  function replaceTask(updated) {
    const idx = tasks.value.findIndex(t => t._id === updated._id)
    if (idx !== -1) tasks.value.splice(idx, 1, { ...updated })
  }

  async function fetchTasks() {
    loading.value = true; error.value = null
    try {
      const res = await getApi().get('/tasks')
      tasks.value = res.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to fetch tasks'
    } finally { loading.value = false }
  }

  async function createTask(payload) {
    try {
      const res = await getApi().post('/tasks', payload)
      tasks.value.unshift(res.data)
      addLog(`Created "${res.data.title}"`, 'create')
      return res.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to create task'
    }
  }

  async function updateTask(id, payload) {
    try {
      const res = await getApi().put(`/tasks/${id}`, payload)
      replaceTask(res.data)
      addLog(`Updated "${res.data.title}"`, 'update')
      return res.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to update task'
    }
  }

  async function moveTask(id, newStatus) {
    const task = tasks.value.find(t => t._id === id)
    if (!task || task.status === newStatus) return
    const oldStatus = task.status
    task.status = newStatus
    try {
      const res = await getApi().patch(`/tasks/${id}/status`, { status: newStatus })
      replaceTask(res.data)
      addLog(`Moved "${res.data.title}" → ${newStatus}`, 'move')
    } catch (e) {
      task.status = oldStatus
      error.value = e.response?.data?.message || 'Failed to move task'
    }
  }

  async function toggleChecklist(taskId, checkId) {
    try {
      const res = await getApi().patch(`/tasks/${taskId}/checklist/${checkId}`)
      replaceTask(res.data)
      return res.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to toggle checklist'
    }
  }

  async function deleteTask(id) {
    const task = tasks.value.find(t => t._id === id)
    try {
      await getApi().delete(`/tasks/${id}`)
      tasks.value = tasks.value.filter(t => t._id !== id)
      addLog(`Deleted "${task?.title}"`, 'delete')
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to delete task'
    }
  }

  function clearError() { error.value = null }

  return {
    tasks, loading, error, activityLog, tasksByColumn,
    fetchTasks, createTask, updateTask, moveTask,
    toggleChecklist, deleteTask, clearError
  }
})