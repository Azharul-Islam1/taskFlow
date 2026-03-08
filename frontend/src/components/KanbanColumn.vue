<template>
  <div
    class="column"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- Column Header -->
    <div class="column-header">
      <div class="col-title-row">
        <span class="col-dot" :style="{ background: color }"></span>
        <h2 class="col-title">{{ title }}</h2>
        <span class="col-count">{{ tasks.length }}</span>
      </div>
      <button class="add-btn" @click="$emit('add-task', status)" title="Add task">+</button>
    </div>

    <!-- Task List -->
    <div class="task-list">
      <transition-group name="task-move" tag="div">
        <TaskCard
          v-for="task in tasks"
          :key="task._id"
          :task="task"
          @edit="$emit('edit-task', $event)"
          @delete="$emit('delete-task', $event)"
        />
      </transition-group>

      <!-- Empty state -->
      <div v-if="tasks.length === 0" class="empty-state">
        <span>{{ emptyMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  title: String,
  status: String,
  tasks: { type: Array, default: () => [] },
  color: String
})

const emit = defineEmits(['task-dropped', 'add-task', 'edit-task', 'delete-task'])

const isDragOver = ref(false)

const emptyMessages = {
  todo: 'No tasks yet — add one!',
  inprogress: 'Nothing in progress',
  done: 'No completed tasks'
}
const emptyMessage = emptyMessages[props.status]

function onDragOver() {
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(e) {
  isDragOver.value = false
  const taskId = e.dataTransfer.getData('taskId')
  if (taskId) {
    emit('task-dropped', { taskId, newStatus: props.status })
  }
}
</script>

<style scoped>
.column {
  background: var(--bg-column);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px 16px;
  min-width: 300px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
  min-height: 400px;
}
.column.drag-over {
  border-color: var(--accent-primary);
  box-shadow: inset 0 0 0 1px var(--accent-primary), var(--shadow-glow);
  background: rgba(108, 99, 255, 0.04);
}
.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.col-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.col-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.col-title {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}
.col-count {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  min-width: 24px;
  text-align: center;
  transition: background var(--transition-smooth), color var(--transition-smooth);
}
.column.drag-over .col-count {
  background: rgba(108,99,255,0.15);
  color: var(--accent-primary);
  border-color: var(--border-accent);
}
.add-btn {
  background: none;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  width: 28px; height: 28px;
  border-radius: var(--radius-sm);
  font-size: 18px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition-fast);
  line-height: 1;
}
.add-btn:hover {
  background: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--accent-primary);
}
.task-list { display: flex; flex-direction: column; gap: 10px; flex: 1; }
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
  padding: 40px 20px;
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-md);
}
.task-move-move { transition: transform 0.3s ease; }
.task-move-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.task-move-leave-active { transition: all 0.2s ease; }
.task-move-enter-from { opacity: 0; transform: translateY(-12px) scale(0.95); }
.task-move-leave-to { opacity: 0; transform: translateY(12px) scale(0.95); }
</style>