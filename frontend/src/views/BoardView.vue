 <template>
  <div class="board-wrap">

    <header class="topbar">
      <div class="tb-left">
        <div class="tb-logo">
          <div class="tb-mark">T</div>
          <span class="tb-name">TaskFlow</span>
        </div>
        <div class="tb-nav">
          <div class="tb-nav-item on">Kanban</div>
        </div>
      </div>
      <div class="tb-right">
        <button class="tb-icon" @click="showActivity = !showActivity" title="Activity">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span v-if="taskStore.activityLog.length" class="tb-badge"></span>
        </button>
        <div class="tb-user" @click="showUserMenu = !showUserMenu">
          <div class="tb-av">{{ userInitial }}</div>
          <transition name="fade">
            <div v-if="showUserMenu" class="dropdown">
              <div class="drop-name">{{ authStore.user?.name }}</div>
              <div class="drop-email">{{ authStore.user?.email }}</div>
              <div class="drop-divider"></div>
              <button class="drop-item danger" @click="logout">Sign out</button>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <div class="subbar">
      <span class="sb-title">Sprint Board</span>
      <div class="sb-sep"></div>
      <button class="sb-btn primary" @click="openCreateModal('todo')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add task
      </button>
      <button class="sb-btn" @click="showFilterMenu = !showFilterMenu" style="position:relative">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        Filter
        <transition name="fade">
          <div v-if="showFilterMenu" class="filter-drop">
            <div class="fd-label">Priority</div>
            <div
              v-for="p in ['','high','medium','low']" :key="p"
              class="fd-item" :class="{ active: priorityFilter === p }"
              @click.stop="priorityFilter = p; showFilterMenu = false"
            >
              <div v-if="p" class="fd-dot" :class="`dot-${p}`"></div>
              {{ p ? p.charAt(0).toUpperCase() + p.slice(1) : 'All' }}
            </div>
          </div>
        </transition>
      </button>
      <div class="sb-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="searchQuery" placeholder="Search tasks..." />
      </div>
      <div class="sb-right">
        <div class="sb-stat">
          <div class="sb-stat-dot"></div>
          {{ totalTasks }} tasks · {{ doneTasks }} done
        </div>
      </div>
    </div>

    <div class="board-bg">
      <div class="bg-blob bg1"></div>
      <div class="bg-blob bg2"></div>
      <div class="bg-blob bg3"></div>

      <div class="board" v-if="!taskStore.loading">
        <KanbanColumn
          v-for="col in columns" :key="col.status"
          :title="col.title"
          :status="col.status"
          :color="col.color"
          :pill-class="col.pillClass"
          :count-class="col.countClass"
          :tasks="filteredTasksByColumn[col.status]"
          @task-dropped="handleTaskDrop"
          @add-task="openCreateModal"
          @edit-task="openDetailPanel"
          @delete-task="handleDelete"
        />
      </div>

      <div v-else class="loading">
        <div class="lspin"></div>
        <span>Loading tasks...</span>
      </div>
    </div>

    <TaskModal
      :is-open="modalOpen"
      :default-status="modalDefaultStatus"
      @close="modalOpen = false"
      @submit="handleCreate"
    />

    <TaskDetailPanel
      :is-open="detailOpen"
      :task="detailTask"
      @close="detailOpen = false"
      @submit="handleEdit"
      @delete="handleDelete"
    />

    <ActivityLog
      :is-open="showActivity"
      :activity-log="taskStore.activityLog"
      @close="showActivity = false"
    />

    <transition name="toast">
      <div v-if="taskStore.error" class="err-toast" @click="taskStore.clearError()">
        ⚠ {{ taskStore.error }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore }  from '@/stores/auth'
import { useTaskStore }  from '@/stores/tasks'
import { useRouter }     from 'vue-router'
import KanbanColumn      from '@/components/KanbanColumn.vue'
import TaskModal         from '@/components/TaskModal.vue'
import TaskDetailPanel   from '@/components/TaskDetailPanel.vue'
import ActivityLog       from '@/components/ActivityLog.vue'

const authStore = useAuthStore()
const taskStore = useTaskStore()
const router    = useRouter()

const searchQuery        = ref('')
const priorityFilter     = ref('')
const showActivity       = ref(false)
const showUserMenu       = ref(false)
const showFilterMenu     = ref(false)
const modalOpen          = ref(false)
const modalDefaultStatus = ref('todo')
const detailOpen         = ref(false)
const detailTask         = ref(null)

const columns = [
  { title: 'To Do',       status: 'todo',       color: '#94a3b8', pillClass: 'pill-todo',       countClass: 'count-todo'       },
  { title: 'In Progress', status: 'inprogress',  color: '#3b82f6', pillClass: 'pill-inprogress', countClass: 'count-inprogress' },
  { title: 'Done',        status: 'done',        color: '#22c55e', pillClass: 'pill-done',        countClass: 'count-done'       },
]

const userInitial = computed(() => authStore.user?.name?.[0]?.toUpperCase() || '?')
const totalTasks  = computed(() => taskStore.tasks.length)
const doneTasks   = computed(() => taskStore.tasksByColumn.done?.length || 0)

const filteredTasksByColumn = computed(() => {
  const result = {}
  for (const col of columns) {
    result[col.status] = (taskStore.tasksByColumn[col.status] || []).filter(t => {
      const matchSearch   = !searchQuery.value ||
        t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchPriority = !priorityFilter.value || t.priority === priorityFilter.value
      return matchSearch && matchPriority
    })
  }
  return result
})

onMounted(() => taskStore.fetchTasks())

function openCreateModal(status) {
  modalDefaultStatus.value = typeof status === 'string' ? status : 'todo'
  modalOpen.value = true
}

function openDetailPanel(task) {
  detailTask.value = { ...task }
  detailOpen.value = true
}

function handleTaskDrop({ taskId, newStatus }) {
  taskStore.moveTask(taskId, newStatus)
}

async function handleCreate(payload) {
  const created = await taskStore.createTask(payload)
  if (created) modalOpen.value = false
}

async function handleEdit(payload) {
  if (detailTask.value) {
    const updated = await taskStore.updateTask(detailTask.value._id, payload)
    if (updated) detailTask.value = { ...updated }
  }
}

async function handleDelete(id) {
  await taskStore.deleteTask(id)
  detailOpen.value = false
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.board-wrap { min-height: 100vh; display: flex; flex-direction: column; }

.topbar {
  height: 52px; display: flex; align-items: center;
  justify-content: space-between; padding: 0 20px;
  background: linear-gradient(135deg, #1e1f3b 0%, #2d2f5e 100%);
  position: sticky; top: 0; z-index: 100; flex-shrink: 0;
  box-shadow: 0 2px 20px rgba(0,0,0,0.2);
}
.tb-left  { display: flex; align-items: center; height: 100%; }
.tb-right { display: flex; align-items: center; gap: 10px; }

.tb-logo  { display: flex; align-items: center; gap: 9px; margin-right: 24px; }
.tb-mark  {
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: grid; place-items: center;
  font-size: 14px; font-weight: 800; color: white;
  box-shadow: 0 2px 8px rgba(59,130,246,0.4);
}
.tb-name { font-size: 15px; font-weight: 800; color: white; letter-spacing: -.3px; }

.tb-nav { display: flex; height: 52px; }
.tb-nav-item {
  display: flex; align-items: center; padding: 0 14px;
  font-size: 12.5px; font-weight: 600;
  color: rgba(255,255,255,0.5); cursor: pointer;
  border-bottom: 2px solid transparent; transition: all .15s;
}
.tb-nav-item:hover { color: rgba(255,255,255,0.85); }
.tb-nav-item.on    { color: white; border-bottom-color: #6366f1; }

.tb-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  display: grid; place-items: center;
  color: rgba(255,255,255,0.7); cursor: pointer;
  transition: all .15s; position: relative;
  background-color: transparent;
}
.tb-icon:hover { background: rgba(255,255,255,0.15); color: white; }
.tb-badge {
  position: absolute; top: 5px; right: 5px;
  width: 7px; height: 7px; background: #ef4444;
  border-radius: 50%; border: 2px solid #1e1f3b;
}

.tb-user { position: relative; cursor: pointer; }
.tb-av {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #8b6352, #c4956a);
  display: grid; place-items: center;
  font-size: 13px; font-weight: 700; color: white;
  border: 2px solid rgba(255,255,255,0.2);
}

.dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: white; border: 1px solid #e2e8f0; border-radius: 10px;
  padding: 8px; min-width: 190px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 10;
}
.drop-name  { font-size: 13px; font-weight: 700; color: #0f172a; padding: 4px 8px; }
.drop-email { font-size: 12px; color: #94a3b8; padding: 2px 8px 6px; }
.drop-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }
.drop-item {
  width: 100%; background: none; border: none;
  padding: 7px 8px; text-align: left; border-radius: 6px;
  font-size: 13px; cursor: pointer; transition: background .12s;
  color: #475569; font-family: inherit;
}
.drop-item:hover  { background: #f8fafc; }
.drop-item.danger { color: #dc2626; }
.drop-item.danger:hover { background: #fef2f2; }

.fade-enter-active, .fade-leave-active { transition: all .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }

.subbar {
  height: 48px; display: flex; align-items: center; gap: 8px;
  background: white; border-bottom: 1px solid #e8edf5;
  padding: 0 20px; flex-shrink: 0;
  position: sticky; top: 52px; z-index: 50;
  box-shadow: 0 1px 8px rgba(0,0,0,0.05);
}
.sb-title { font-size: 14px; font-weight: 800; color: #0f172a; letter-spacing: -.3px; margin-right: 4px; }
.sb-sep   { width: 1px; height: 20px; background: #e2e8f0; margin: 0 4px; }

.sb-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 13px; border-radius: 8px;
  font-size: 12.5px; font-weight: 600; cursor: pointer;
  border: 1px solid #e2e8f0; background: white;
  color: #475569; transition: all .15s; font-family: inherit;
}
.sb-btn:hover   { background: #f8fafc; border-color: #cbd5e1; }
.sb-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border-color: transparent; color: white;
  box-shadow: 0 2px 10px rgba(59,130,246,0.3);
}
.sb-btn.primary:hover {
  box-shadow: 0 4px 16px rgba(59,130,246,0.4);
  transform: translateY(-1px);
}

.filter-drop {
  position: absolute; top: calc(100% + 6px); left: 0;
  background: white; border: 1px solid #e2e8f0;
  border-radius: 10px; padding: 6px; min-width: 150px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 10;
}
.fd-label { font-size: 10px; color: #94a3b8; font-weight: 700; padding: 4px 8px; text-transform: uppercase; letter-spacing: .06em; }
.fd-item  {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 8px; border-radius: 6px;
  font-size: 13px; color: #475569; cursor: pointer; transition: background .12s;
}
.fd-item:hover  { background: #f8fafc; }
.fd-item.active { background: #f0f4ff; color: #6366f1; font-weight: 600; }
.fd-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-high   { background: #ef4444; }
.dot-medium { background: #f59e0b; }
.dot-low    { background: #22c55e; }

.sb-search {
  display: flex; align-items: center; gap: 7px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 8px; padding: 6px 12px; transition: all .15s;
}
.sb-search:focus-within {
  border-color: #3b82f6; background: white;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}
.sb-search svg { color: #94a3b8; flex-shrink: 0; }
.sb-search input {
  background: none !important; border: none !important;
  box-shadow: none !important; outline: none !important;
  font-size: 12.5px !important; color: #0f172a !important;
  width: 160px; padding: 0 !important; font-family: inherit;
}
.sb-search input::placeholder { color: #cbd5e1 !important; }

.sb-right { margin-left: auto; }
.sb-stat {
  display: flex; align-items: center; gap: 6px;
  background: #f0f4ff; border: 1px solid #dde5ff;
  border-radius: 8px; padding: 5px 12px;
  font-size: 12px; font-weight: 600; color: #4f46e5;
}
.sb-stat-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.5) } 50% { box-shadow: 0 0 0 6px rgba(34,197,94,0) } }

.board-bg {
  flex: 1; position: relative; overflow: hidden;
  background: linear-gradient(145deg, #eff6ff 0%, #eef2ff 40%, #f0f9ff 100%);
  min-height: calc(100vh - 100px);
}
.bg-blob {
  position: absolute; border-radius: 50%;
  filter: blur(90px); pointer-events: none; mix-blend-mode: multiply;
}
.bg1 { width: 700px; height: 700px; top: -200px; right: -150px; background: #bfdbfe; opacity: .5; animation: bm1 14s ease-in-out infinite alternate; }
.bg2 { width: 500px; height: 500px; bottom: -150px; left: -100px; background: #c7d2fe; opacity: .4; animation: bm2 17s ease-in-out infinite alternate; }
.bg3 { width: 350px; height: 350px; top: 30%; left: 35%; background: #bae6fd; opacity: .35; animation: bm3 11s ease-in-out infinite alternate; }
@keyframes bm1 { 0% { transform: scale(1) translate(0,0) } 100% { transform: scale(1.08) translate(30px,-25px) } }
@keyframes bm2 { 0% { transform: scale(1) translate(0,0) } 100% { transform: scale(1.12) translate(-20px,30px) } }
@keyframes bm3 { 0% { transform: scale(1) translate(0,0) } 100% { transform: scale(.92) translate(20px,15px) } }

.board {
  display: flex; gap: 18px; padding: 20px;
  position: relative; z-index: 2;
  align-items: flex-start; overflow-x: auto;
}
.board::-webkit-scrollbar { height: 5px; }
.board::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 3px; }

.loading {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; color: #94a3b8; padding: 80px;
  font-size: 14px; font-weight: 500;
  position: relative; z-index: 2;
}
.lspin {
  width: 20px; height: 20px;
  border: 2px solid #e2e8f0; border-top-color: #3b82f6;
  border-radius: 50%; animation: spinR .8s linear infinite;
}
@keyframes spinR { to { transform: rotate(360deg) } }

.err-toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: #fef2f2; border: 1px solid #fecaca;
  color: #dc2626; border-radius: 10px;
  padding: 10px 20px; font-size: 13px; font-weight: 500;
  cursor: pointer; z-index: 999;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.toast-enter-active, .toast-leave-active { transition: all .25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }
</style>