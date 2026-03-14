  <template>
  <div class="col">
    <div class="col-hd">
      <div class="col-pill" :class="pillClass">
        <div class="col-dot" :style="{ background: color }"></div>
        {{ title }}
        <span class="col-count" :class="countClass">{{ tasks.length }}</span>
      </div>
      <button class="col-add-btn" @click="$emit('add-task', status)">+</button>
    </div>

    <div
      class="col-body"
      :class="{ 'drag-over': isDragOver }"
      @dragover.prevent="isDragOver = true"
      @dragenter.prevent="isDragOver = true"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
    >
      <TransitionGroup name="card-list" tag="div" class="card-list">
        <TaskCard
          v-for="task in tasks"
          :key="task._id"
          :task="task"
          @edit="$emit('edit-task', task)"
          @delete="$emit('delete-task', task._id)"
        />
      </TransitionGroup>

      <div v-if="tasks.length === 0" class="col-empty">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="empty-ico">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
        <span>No tasks here</span>
        <button class="empty-add" @click="$emit('add-task', status)">+ Add task</button>
      </div>
    </div>

    <button class="col-add-bottom" @click="$emit('add-task', status)">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Add task
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  title:      String,
  status:     String,
  color:      String,
  pillClass:  String,
  countClass: String,
  tasks:      { type: Array, default: () => [] }
})
const emit = defineEmits(['task-dropped','add-task','edit-task','delete-task'])

const isDragOver = ref(false)

function onDragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isDragOver.value = false
  }
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
.col {
  min-width: 300px;
  flex: 1;
  max-width: 340px;
  display: flex;
  flex-direction: column;
}

.col-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 2px;
}

.col-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.col-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.col-count {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 10px;
}

.pill-todo       { background: rgba(148,163,184,0.1); border: 0.5px solid rgba(148,163,184,0.25); color: #64748b; }
.pill-inprogress { background: rgba(91,95,199,0.08);  border: 0.5px solid rgba(91,95,199,0.25);   color: #5B5FC7; }
.pill-done       { background: rgba(34,197,94,0.08);  border: 0.5px solid rgba(34,197,94,0.25);   color: #15803d; }

.count-todo       { background: rgba(148,163,184,0.15); color: #64748b; }
.count-inprogress { background: rgba(91,95,199,0.12);   color: #5B5FC7; }
.count-done       { background: rgba(34,197,94,0.12);   color: #15803d; }

.col-add-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 0.5px solid #e2e8f0;
  background: white;
  color: #94a3b8;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all .15s;
  font-size: 18px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.col-add-btn:hover {
  background: #f0f4ff;
  border-color: #5B5FC7;
  color: #5B5FC7;
}

.col-body {
  flex: 1;
  border-radius: 12px;
  border: 2px dashed transparent;
  transition: all .15s;
  padding: 2px;
  min-height: 80px;
}
.col-body.drag-over {
  background: rgba(91,95,199,0.05);
  border-color: rgba(91,95,199,0.35);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-list-enter-active { transition: all .22s ease; }
.card-list-leave-active { transition: all .18s ease; }
.card-list-enter-from   { opacity: 0; transform: translateY(-8px); }
.card-list-leave-to     { opacity: 0; transform: scale(.95); }
.card-list-move         { transition: transform .22s ease; }

.col-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  color: #cbd5e1;
}
.empty-ico {
  animation: bob 3s ease-in-out infinite;
}
@keyframes bob {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-5px); }
}
.col-empty span {
  font-size: 12px;
  color: #cbd5e1;
}
.empty-add {
  font-size: 12px;
  color: #5B5FC7;
  background: white;
  border: 0.5px solid #c7d2fe;
  border-radius: 8px;
  padding: 5px 14px;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
}
.empty-add:hover {
  background: #f0f4ff;
  border-color: #5B5FC7;
}

.col-add-bottom {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 9px 12px;
  margin-top: 6px;
  background: rgba(255,255,255,0.7);
  border: 1px dashed #e2e8f0;
  border-radius: 10px;
  font-size: 12px;
  color: #94a3b8;
  cursor: pointer;
  transition: all .15s;
  font-family: inherit;
  font-weight: 500;
  box-sizing: border-box;
}
.col-add-bottom:hover {
  background: white;
  border-color: #5B5FC7;
  color: #5B5FC7;
}
</style>