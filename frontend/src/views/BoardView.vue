 <template>
  <div class="board">
    <header class="topbar">
      <div class="tb-left">
        <div class="tlogo">T</div>
        <span class="tname">TaskFlow</span>
        <div class="tsep"></div>
        <div class="tb-srch">
          <span class="srch-ic">⌕</span>
          <input v-model="searchQuery" placeholder="Search tasks..." />
        </div>
      </div>

      <div class="tb-right">
        <select v-model="priorityFilter" class="tb-sel">
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button class="tb-ib" @click="showActivity = !showActivity">
          🔔
          <span v-if="taskStore.activityLog.length" class="tnd"></span>
        </button>

        <div class="tb-user" @click="showUserMenu = !showUserMenu">
          <div class="tav">{{ userInitial }}</div>
          <span class="tun">{{ authStore.user?.name }}</span>
          <transition name="fade">
            <div v-if="showUserMenu" class="dropdown">
              <button class="drop-item danger" @click="logout">Sign Out</button>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <main class="bbd">
      <div class="btop">
        <div>
          <div class="bht">My Board</div>
          <div class="bhs">{{ totalTasks }} tasks · {{ doneTasks }} completed</div>
        </div>
        <button class="bcta" @click="openCreateModal('todo')">＋ New Task</button>
      </div>

      <div v-if="taskStore.loading" class="loading">
        <div class="lspin"></div>
        <span>Loading tasks...</span>
      </div>

      <div v-else class="kb">
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

    <TaskModal
      :is-open="modalOpen"
      :task="editingTask"
      :default-status="modalDefaultStatus"
      @close="modalOpen = false"
      @submit="handleModalSubmit"
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
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import { useRouter } from 'vue-router'
import KanbanColumn from '@/components/KanbanColumn.vue'
import TaskModal from '@/components/TaskModal.vue'
import ActivityLog from '@/components/ActivityLog.vue'

const authStore = useAuthStore()
const taskStore = useTaskStore()
const router    = useRouter()

const searchQuery        = ref('')
const priorityFilter     = ref('')
const showActivity       = ref(false)
const showUserMenu       = ref(false)
const modalOpen          = ref(false)
const editingTask        = ref(null)
const modalDefaultStatus = ref('todo')

const columns = [
  { title: 'To Do',       status: 'todo',       color: '#5b5fef' },
  { title: 'In Progress', status: 'inprogress',  color: '#f59e0b' },
  { title: 'Done',        status: 'done',        color: '#22d3a5' },
]

const userInitial = computed(() => authStore.user?.name?.[0]?.toUpperCase() || '?')
const totalTasks  = computed(() => taskStore.tasks.length)
const doneTasks   = computed(() => taskStore.tasksByColumn.done?.length || 0)

const filteredTasksByColumn = computed(() => {
  const result = {}
  for (const col of columns) {
    result[col.status] = taskStore.tasksByColumn[col.status]?.filter(t => {
      const matchSearch   = !searchQuery.value ||
        t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchPriority = !priorityFilter.value || t.priority === priorityFilter.value
      return matchSearch && matchPriority
    }) || []
  }
  return result
})

onMounted(() => taskStore.fetchTasks())

function handleTaskDrop({ taskId, newStatus }) { taskStore.moveTask(taskId, newStatus) }
function openCreateModal(status) { editingTask.value = null; modalDefaultStatus.value = status; modalOpen.value = true }
function openEditModal(task)     { editingTask.value = task; modalOpen.value = true }
async function handleModalSubmit(payload) {
  if (editingTask.value) await taskStore.updateTask(editingTask.value._id, payload)
  else                   await taskStore.createTask(payload)
}
async function handleDelete(id) { if (confirm('Delete this task?')) taskStore.deleteTask(id) }
function logout() { authStore.logout(); router.push('/login') }
</script>

<style scoped>
.board {
  min-height: 100vh;
  background: #05050e;
  display: flex; flex-direction: column;
}

/* ── TOPBAR ── */
.topbar {
  height: 54px; display: flex; align-items: center;
  justify-content: space-between;
  padding: 0 18px; gap: 10px;
  background: rgba(5,5,14,.97);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: sticky; top: 0; z-index: 100;
}

.tb-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.tb-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

.tlogo {
  width: 26px; height: 26px; background: #5b5fef; border-radius: 6px;
  display: grid; place-items: center;
  font-size: 12px; font-weight: 700; color: white;
  box-shadow: 0 0 14px rgba(91,95,239,.35);
  position: relative; overflow: hidden; flex-shrink: 0;
}
.tlogo::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 55%); }
.tname { font-size: 14px; font-weight: 700; color: #ededff; letter-spacing: -.01em; flex-shrink: 0; }
.tsep  { width: 1px; height: 16px; background: rgba(255,255,255,0.06); margin: 0 2px; flex-shrink: 0; }

.tb-srch {
  display: flex; align-items: center; gap: 7px;
  background: #0e0e22; border: 1px solid rgba(255,255,255,0.06);
  border-radius: 7px; padding: 6px 12px;
  flex: 1; max-width: 240px; transition: all .15s;
}
.tb-srch:focus-within {
  border-color: rgba(91,95,239,.35);
  box-shadow: 0 0 0 3px rgba(91,95,239,.1);
}
.srch-ic { color: #222238; font-size: 14px; flex-shrink: 0; }
.tb-srch input {
  background: none; border: none; outline: none;
  color: #ededff; font-family: inherit; font-size: 13px; width: 100%;
}
.tb-srch input::placeholder { color: #222238; }

.tb-sel {
  background: #0e0e22; border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px; padding: 5px 10px;
  font-size: 12px; color: #8080a8; font-family: inherit;
  outline: none; cursor: pointer; transition: all .15s;
}
.tb-sel:hover { border-color: rgba(255,255,255,0.1); color: #ededff; }

.tb-ib {
  width: 30px; height: 30px; background: #0e0e22;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px; display: grid; place-items: center;
  color: #8080a8; cursor: pointer; position: relative; font-size: 13px;
  transition: all .15s;
}
.tb-ib:hover { border-color: rgba(255,255,255,0.1); color: #ededff; }
.tnd {
  position: absolute; top: -2px; right: -2px;
  width: 7px; height: 7px; background: #f43f5e;
  border-radius: 50%; border: 2px solid #05050e;
  animation: ndBlink 2s ease infinite;
}
@keyframes ndBlink { 0%,100%{opacity:1} 50%{opacity:.3} }

.tb-user {
  display: flex; align-items: center; gap: 7px;
  padding: 4px 9px; border-radius: 7px; cursor: pointer;
  position: relative; transition: background .15s;
}
.tb-user:hover { background: #0e0e22; }
.tav {
  width: 28px; height: 28px; background: #5b5fef; border-radius: 50%;
  display: grid; place-items: center;
  font-size: 11px; font-weight: 700; color: white;
  box-shadow: 0 0 10px rgba(91,95,239,.25); flex-shrink: 0;
}
.tun { font-size: 13px; color: #8080a8; font-weight: 500; }

.dropdown {
  position: absolute; top: calc(100% + 6px); right: 0;
  background: #0e0e22; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 9px; padding: 5px; min-width: 130px;
  box-shadow: 0 16px 40px rgba(0,0,0,.5); z-index: 10;
}
.drop-item {
  width: 100%; background: none; border: none;
  padding: 8px 12px; text-align: left; border-radius: 6px;
  font-family: inherit; font-size: 13px; cursor: pointer;
  transition: all .15s;
}
.drop-item.danger { color: #fb7185; }
.drop-item.danger:hover { background: rgba(244,63,94,.08); }

.fade-enter-active, .fade-leave-active { transition: all .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }

/* ── BOARD BODY ── */
.bbd { flex: 1; padding: 20px 18px; }

.btop {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.bht { font-size: 17px; font-weight: 700; letter-spacing: -.015em; margin-bottom: 2px; }
.bhs { font-size: 12px; color: #484868; }

.bcta {
  display: flex; align-items: center; gap: 6px;
  background: #5b5fef; border: none; border-radius: 7px;
  padding: 8px 16px; color: white;
  font-family: inherit; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .18s;
  position: relative; overflow: hidden;
}
.bcta::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.1) 0%,transparent 55%); }
.bcta:hover { background: #4a4edf; transform: translateY(-1px); box-shadow: 0 5px 16px rgba(91,95,239,.38); }

/* loading */
.loading {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; color: #484868; padding: 80px; font-size: 14px;
}
.lspin {
  width: 20px; height: 20px;
  border: 2px solid rgba(255,255,255,0.06);
  border-top-color: #5b5fef; border-radius: 50%;
  animation: spinR .8s linear infinite;
}
@keyframes spinR { to { transform: rotate(360deg); } }

/* kanban */
.kb {
  display: flex; gap: 11px; align-items: flex-start;
  overflow-x: auto; padding-bottom: 16px;
}
.kb::-webkit-scrollbar { height: 3px; }
.kb::-webkit-scrollbar-thumb { background: #222238; border-radius: 2px; }

/* error toast */
.err-toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: rgba(244,63,94,.1); border: 1px solid rgba(244,63,94,.2);
  color: #fb7185; border-radius: 9px; padding: 11px 18px;
  font-size: 13px; cursor: pointer; backdrop-filter: blur(10px);
  z-index: 999; box-shadow: 0 4px 20px rgba(0,0,0,.3);
}
.toast-enter-active, .toast-leave-active { transition: all .25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }

@media (max-width: 768px) {
  .tname, .tun, .tsep { display: none; }
  .tb-srch { max-width: 160px; }
  .bbd { padding: 16px; }
  .kb { flex-direction: column; }
}
</style>