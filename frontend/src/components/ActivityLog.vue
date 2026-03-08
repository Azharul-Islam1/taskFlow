<template>
  <div class="activity-panel" :class="{ open: isOpen }">
    <div class="panel-header">
      <h3>Activity</h3>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <div class="activity-list">
      <transition-group name="activity-item" tag="div">
        <div
          v-for="log in activityLog"
          :key="log.id"
          class="activity-item"
          :class="`type-${log.type}`"
        >
          <span class="activity-icon">{{ typeIcon(log.type) }}</span>
          <div class="activity-content">
            <p class="activity-msg">{{ log.message }}</p>
            <span class="activity-time">{{ formatTime(log.time) }}</span>
          </div>
        </div>
      </transition-group>

      <div v-if="activityLog.length === 0" class="empty">
        No activity yet
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  activityLog: { type: Array, default: () => [] }
})
defineEmits(['close'])

function typeIcon(type) {
  const map = { move: '↕', create: '✦', delete: '✕', info: '●' }
  return map[type] || '●'
}

function formatTime(iso) {
  const date = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.activity-panel {
  position: fixed;
  right: 0; top: 0; bottom: 0;
  width: 280px;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-subtle);
  z-index: 200;
  transform: translateX(100%);
  transition: transform var(--transition-smooth);
  display: flex;
  flex-direction: column;
}
.activity-panel.open { transform: translateX(0); }
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px 16px;
  border-bottom: 1px solid var(--border-subtle);
}
.panel-header h3 {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}
.close-btn {
  background: none; border: none; color: var(--text-secondary);
  cursor: pointer; font-size: 14px;
  transition: color var(--transition-fast);
}
.close-btn:hover { color: var(--text-primary); }
.activity-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}
.activity-item:hover { background: var(--bg-card); }
.activity-icon {
  font-size: 12px;
  margin-top: 2px;
  flex-shrink: 0;
}
.type-move .activity-icon { color: var(--accent-primary); }
.type-create .activity-icon { color: var(--accent-green); }
.type-delete .activity-icon { color: var(--accent-secondary); }
.activity-content { display: flex; flex-direction: column; gap: 2px; }
.activity-msg { font-size: 13px; color: var(--text-primary); line-height: 1.4; }
.activity-time { font-size: 11px; color: var(--text-muted); }
.empty {
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  padding: 40px 20px;
}
.activity-item-enter-active { transition: all 0.3s ease; }
.activity-item-enter-from { opacity: 0; transform: translateX(20px); }
</style>