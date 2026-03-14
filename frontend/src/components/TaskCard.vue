  <template>
  <div
    class="card"
    :class="[`pri-${task.priority}`, { 'is-done': task.status === 'done' }]"
    draggable="true"
    @dragstart="onDragStart"
    @click="$emit('edit', task)"
  >
    <div class="card-inner">
      <div class="card-tags" v-if="task.tags?.length">
        <span v-for="tag in task.tags.slice(0,2)" :key="tag" class="ctag">{{ tag }}</span>
      </div>

      <div class="card-title" :class="{ done: task.status === 'done' }">{{ task.title }}</div>

      <!-- checklist progress -->
      <div v-if="task.checklist?.length" class="card-checklist">
        <div class="cl-bar">
          <div class="cl-fill" :style="{ width: checklistProgress + '%' }"></div>
        </div>
        <span class="cl-txt">{{ doneChecklist }}/{{ task.checklist.length }}</span>
      </div>

      <div class="card-foot">
        <div
          v-if="task.dueDate"
          class="date-badge"
          :class="isOverdue ? 'date-red' : 'date-green'"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {{ formattedDate }}
        </div>
        <div v-else class="date-empty"></div>
        <div class="card-av">{{ userInitial }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({ task: Object })
defineEmits(['edit', 'delete'])

const authStore   = useAuthStore()
const userInitial = computed(() => authStore.user?.name?.[0]?.toUpperCase() || '?')

function onDragStart(e) {
  e.dataTransfer.setData('taskId', props.task._id)
  e.dataTransfer.effectAllowed = 'move'
}

const doneChecklist     = computed(() => props.task.checklist?.filter(c => c.checked).length || 0)
const checklistProgress = computed(() => {
  if (!props.task.checklist?.length) return 0
  return Math.round((doneChecklist.value / props.task.checklist.length) * 100)
})

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.status === 'done') return false
  return new Date(props.task.dueDate) < new Date()
})

const formattedDate = computed(() => {
  if (!props.task.dueDate) return ''
  const d        = new Date(props.task.dueDate)
  const today    = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString())    return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
})
</script>

<style scoped>
.card {
  background: white; border: 1px solid #e2e8f0;
  border-radius: 8px; cursor: pointer; transition: all .18s;
  position: relative; overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06); user-select: none;
}
.card:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  border-color: #c7d2fe; transform: translateY(-2px);
}
.card.is-done { opacity: .6; }

.card::before {
  content: ''; position: absolute;
  left: 0; top: 0; bottom: 0; width: 4px;
}
.card.pri-high::before   { background: #ef4444; }
.card.pri-medium::before { background: #f59e0b; }
.card.pri-low::before    { background: #22c55e; }

.card-inner { padding: 12px 14px 11px 18px; }

.card-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 7px; }
.ctag {
  font-size: 11px; font-weight: 600;
  padding: 2px 9px; border-radius: 4px;
  background: #fde7c3; color: #7a4f00;
}

.card-title {
  font-size: 13.5px; font-weight: 600;
  color: #0f172a; line-height: 1.4; margin-bottom: 10px;
}
.card-title.done { text-decoration: line-through; color: #94a3b8; }

/* checklist progress */
.card-checklist {
  display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
}
.cl-bar {
  flex: 1; height: 4px; background: #f1f5f9;
  border-radius: 4px; overflow: hidden;
}
.cl-fill {
  height: 100%; background: #6366f1;
  border-radius: 4px; transition: width .3s;
}
.cl-txt { font-size: 11px; color: #94a3b8; font-weight: 600; white-space: nowrap; }

.card-foot {
  display: flex; align-items: center; justify-content: space-between;
}
.date-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11.5px; font-weight: 600;
  padding: 3px 10px; border-radius: 20px;
}
.date-red   { background: #fde7e9; color: #dc2626; }
.date-green { background: #dcfce7; color: #15803d; }
.date-empty { flex: 1; }

.card-av {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg, #8b6352, #c4956a);
  display: grid; place-items: center;
  font-size: 10px; font-weight: 700; color: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}
</style>