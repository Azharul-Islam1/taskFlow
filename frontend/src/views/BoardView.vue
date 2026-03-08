<template>
  <div class="board-layout">
    <!-- Topbar -->
    <header class="topbar">
      <div class="topbar-left">
        <span class="logo-icon">⬡</span>
        <span class="logo-text">TaskFlow</span>
      </div>

      <div class="topbar-center">
        <div class="search-box">
          <span class="search-icon">⌕</span>
          <input v-model="searchQuery" type="text" placeholder="Search tasks..." />
        </div>
      </div>

      <div class="topbar-right">
        <select v-model="priorityFilter" class="filter-select">
          <option value="">All Priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        <button class="icon-btn" @click="showActivity = !showActivity" title="Activity Log">
          <span>◎</span>
          <span v-if="taskStore.activityLog.length" class="badge">{{ taskStore.activityLog.length }}</span>
        </button>

        <div class="user-menu" @click="showUserMenu = !showUserMenu">
          <div class="avatar">{{ userInitial }}</div>
          <span class="username">{{ authStore.user?.name }}</span>
          <transition name="fade">
            <div v-if="showUserMenu" class="dropdown">
              <button @click="logout" class="dropdown-item danger">Sign Out</button>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="board-main">
      <div class="board-title-row">
        <div>
          <h1 class="board-title">My Board</h1>
          <p class="board-sub">{{ totalTasks }} tasks total · {{ doneTasks }} completed</p>
        </div>
        <button class="btn-new-task" @click="openCreateModal('todo')">
          <span>+</span> New Task
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="taskStore.loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span>Loading your tasks...</span>
      </div>

      <!-- Kanban columns -->
      <div v-else class="kanban-board">
        <KanbanColumn
          v-for="col in columns"
          :key="col.status"
          :title="col.title"
          :status="col.status"
          :color="col.color"
          :tasks="filteredTasksByColumn[col.status]"
          @task-dropped="handleTaskDrop"
          @add-task="openCreateModal"
          @edit-task="openEditModal"
          @delete-task="handleDelete"
        />
      </div>
    </main>

    <!-- Task Modal -->
    <TaskModal
      :is-open="modalOpen"
      :task="editingTask"
      :default-status="modalDefaultStatus"
      @close="modalOpen = false"
      @submit="handleModalSubmit"
    />

    <!-- Activity Panel -->
    <ActivityLog
      :is-open="showActivity"
      :activity-log="taskStore.activityLog"
      @close="showActivity = false"
    />

    <!-- Error Toast -->
    <transition name="toast">
      <div v-if="taskStore.error" class="error-toast" @click="taskStore.clearError()">
        ⚠ {{ taskStore.error }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import { useRouter } from 'vue-router'
import KanbanColumn from '@/components/KanbanColumn.vue'
import TaskModal from '@/components/TaskModal.vue'
import ActivityLog from '@/components/ActivityLog.vue'

const authStore = useAuthStore()
const taskStore = useTaskStore()
const router = useRouter()

const searchQuery = ref('')
const priorityFilter = ref('')
const showActivity = ref(false)
const showUserMenu = ref(false)
const modalOpen = ref(false)
const editingTask = ref(null)
const modalDefaultStatus = ref('todo')

const columns = [
  { title: 'To Do',       status: 'todo',       color: '#6c63ff' },
  { title: 'In Progress', status: 'inprogress',  color: '#f9ca24' },
  { title: 'Done',        status: 'done',        color: '#43e97b' }
]

const userInitial = computed(() => authStore.user?.name?.[0]?.toUpperCase() || '?')
const totalTasks = computed(() => taskStore.tasks.length)
const doneTasks = computed(() => taskStore.tasksByColumn.done?.length || 0)

const filteredTasksByColumn = computed(() => {
  const result = {}
  for (const col of columns) {
    result[col.status] = taskStore.tasksByColumn[col.status]?.filter(task => {
      const matchSearch = !searchQuery.value ||
        task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchPriority = !priorityFilter.value || task.priority === priorityFilter.value
      return matchSearch && matchPriority
    }) || []
  }
  return result
})

onMounted(() => {
  taskStore.fetchTasks()
})

function handleTaskDrop({ taskId, newStatus }) {
  taskStore.moveTask(taskId, newStatus)
}

function openCreateModal(status) {
  editingTask.value = null
  modalDefaultStatus.value = status
  modalOpen.value = true
}

function openEditModal(task) {
  editingTask.value = task
  modalOpen.value = true
}

async function handleModalSubmit(payload) {
  if (editingTask.value) {
    await taskStore.updateTask(editingTask.value._id, payload)
  } else {
    await taskStore.createTask(payload)
  }
}

async function handleDelete(taskId) {
  if (confirm('Delete this task?')) {
    taskStore.deleteTask(taskId)
  }
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.board-layout {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}
.topbar {
  height: 60px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.topbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
}
.logo-icon { font-size: 22px; filter: drop-shadow(0 0 10px var(--accent-primary)); }
.logo-text {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.topbar-center { flex: 1; display: flex; justify-content: center; }
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 8px 14px;
  width: 100%;
  max-width: 360px;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.search-box:focus-within {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(108,99,255,0.1);
}
.search-icon { color: var(--text-muted); font-size: 16px; }
.search-box input {
  background: none; border: none; outline: none;
  color: var(--text-primary); font-family: var(--font-body); font-size: 14px; width: 100%;
}
.search-box input::placeholder { color: var(--text-muted); }
.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
  justify-content: flex-end;
}
.filter-select {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  color: var(--text-secondary); border-radius: var(--radius-sm);
  padding: 6px 10px; font-family: var(--font-body); font-size: 13px; outline: none; cursor: pointer;
}
.icon-btn {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  color: var(--text-secondary); border-radius: var(--radius-sm);
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; position: relative; font-size: 16px;
  transition: all var(--transition-fast);
}
.icon-btn:hover { color: var(--text-primary); border-color: var(--accent-primary); }
.badge {
  position: absolute; top: -4px; right: -4px;
  background: var(--accent-secondary); color: white;
  font-size: 9px; font-weight: 700;
  width: 16px; height: 16px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
}
.user-menu {
  display: flex; align-items: center; gap: 8px;
  cursor: pointer; position: relative;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}
.user-menu:hover { background: var(--bg-card); }
.avatar {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 13px; font-weight: 700; color: white;
}
.username { font-size: 13px; color: var(--text-secondary); }
.dropdown {
  position: absolute; top: 100%; right: 0; margin-top: 4px;
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md); padding: 6px;
  min-width: 140px; box-shadow: var(--shadow-card);
}
.dropdown-item {
  width: 100%; background: none; border: none;
  padding: 8px 12px; text-align: left; border-radius: var(--radius-sm);
  font-family: var(--font-body); font-size: 13px; cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}
.dropdown-item.danger { color: var(--accent-secondary); }
.dropdown-item.danger:hover { background: rgba(255,101,132,0.1); }
.board-main { flex: 1; padding: 28px 24px; display: flex; flex-direction: column; gap: 24px; }
.board-title-row {
  display: flex; align-items: flex-end; justify-content: space-between;
}
.board-title { font-family: var(--font-display); font-size: 28px; font-weight: 800; }
.board-sub { color: var(--text-secondary); font-size: 13px; margin-top: 4px; }
.btn-new-task {
  background: linear-gradient(135deg, var(--accent-primary), #8b85ff);
  border: none; border-radius: var(--radius-md);
  padding: 11px 20px; color: white;
  font-family: var(--font-display); font-size: 14px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 6px;
  transition: opacity var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}
.btn-new-task:hover {
  opacity: 0.9; transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(108,99,255,0.4);
}
.loading-state {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  color: var(--text-secondary); padding: 80px;
}
.loading-spinner {
  width: 24px; height: 24px;
  border: 2px solid var(--border-subtle);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.kanban-board {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  overflow-x: auto;
  padding-bottom: 16px;
}
.error-toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: rgba(255,101,132,0.15); border: 1px solid rgba(255,101,132,0.3);
  color: var(--accent-secondary); border-radius: var(--radius-md);
  padding: 12px 20px; font-size: 13px; cursor: pointer;
  backdrop-filter: blur(10px); z-index: 999;
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }
@media (max-width: 768px) {
  .topbar { padding: 0 16px; }
  .topbar-center { display: none; }
  .username { display: none; }
  .board-main { padding: 16px; }
  .kanban-board { flex-direction: column; }
}
</style>