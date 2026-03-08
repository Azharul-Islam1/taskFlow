<template>
  <div
    class="task-card"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    :class="{ 'is-dragging': isDragging }"
  >
    <!-- Priority Badge -->
    <div class="card-header">
      <span class="priority-badge" :class="`priority-${task.priority}`">
        {{ priorityLabel }}
      </span>
      <div class="card-actions">
        <button class="action-btn" @click.stop="$emit('edit', task)" title="Edit">✎</button>
        <button class="action-btn danger" @click.stop="$emit('delete', task._id)" title="Delete">✕</button>
      </div>
    </div>

    <!-- Title -->
    <h3 class="card-title">{{ task.title }}</h3>

    <!-- Description -->
    <p v-if="task.description" class="card-desc">{{ task.description }}</p>

    <!-- Footer: Due date + tags -->
    <div class="card-footer">
      <span v-if="task.dueDate" class="due-date" :class="{ overdue: isOverdue }">
        📅 {{ formattedDate }}
      </span>
      <div v-if="task.tags?.length" class="tags">
        <span v-for="tag in task.tags.slice(0,2)" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  task: { type: Object, required: true }
})

const emit = defineEmits(['dragstart', 'edit', 'delete'])

const isDragging = ref(false)

function onDragStart(e) {
  isDragging.value = true
  e.dataTransfer.setData('taskId', props.task._id)
  e.dataTransfer.effectAllowed = 'move'
  emit('dragstart', props.task._id)
}

function onDragEnd() {
  isDragging.value = false
}

const priorityLabel = computed(() => {
  const map = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' }
  return map[props.task.priority] || '⚪ None'
})

const formattedDate = computed(() => {
  if (!props.task.dueDate) return null
  return new Date(props.task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

const isOverdue = computed(() => {
  if (!props.task.dueDate) return false
  return new Date(props.task.dueDate) < new Date() && props.task.status !== 'done'
})
</script>

<style scoped>
.task-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  cursor: grab;
  transition: transform var(--transition-smooth), box-shadow var(--transition-smooth), opacity var(--transition-fast);
  user-select: none;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
  border-color: var(--border-accent);
  background: var(--bg-card-hover);
}
.task-card:active { cursor: grabbing; }
.task-card.is-dragging {
  opacity: 0.4;
  transform: scale(0.98);
  box-shadow: none;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.priority-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  letter-spacing: 0.02em;
}
.priority-high { background: rgba(255,101,132,0.15); color: #ff6584; }
.priority-medium { background: rgba(249,202,36,0.15); color: #f9ca24; }
.priority-low { background: rgba(67,233,123,0.15); color: #43e97b; }
.card-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}
.task-card:hover .card-actions { opacity: 1; }
.action-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 13px;
  transition: background var(--transition-fast), color var(--transition-fast);
}
.action-btn:hover { background: var(--bg-secondary); color: var(--text-primary); }
.action-btn.danger:hover { background: rgba(255,101,132,0.15); color: var(--accent-secondary); }
.card-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 6px;
}
.card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.due-date { font-size: 11px; color: var(--text-secondary); }
.due-date.overdue { color: var(--accent-secondary); }
.tags { display: flex; gap: 4px; flex-wrap: wrap; }
.tag {
  font-size: 11px;
  background: rgba(108,99,255,0.12);
  color: var(--accent-primary);
  border-radius: 4px;
  padding: 2px 7px;
  font-weight: 500;
}
</style>