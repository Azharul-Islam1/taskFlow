 <template>
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="isOpen" class="overlay" @click.self="$emit('close')">
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Activity Log
            </div>
            <button class="close-btn" @click="$emit('close')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="panel-body">
            <div v-if="activityLog.length === 0" class="empty">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>No activity yet</span>
            </div>

            <TransitionGroup name="log" tag="div" class="log-list">
              <div v-for="(item, i) in activityLog" :key="i" class="log-item">
                <div class="log-dot" :class="`dot-${item.type}`"></div>
                <div class="log-content">
                  <div class="log-msg">{{ item.message }}</div>
                  <div class="log-time">{{ item.time }}</div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen:      Boolean,
  activityLog: { type: Array, default: () => [] }
})
defineEmits(['close'])
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.25);
  display: flex; justify-content: flex-end;
}
.panel {
  width: 300px; height: 100%;
  background: white;
  border-left: 1px solid #e1e1e1;
  display: flex; flex-direction: column;
  box-shadow: -4px 0 16px rgba(0,0,0,0.08);
}
.panel-enter-active, .panel-leave-active { transition: all .22s ease; }
.panel-enter-from, .panel-leave-to       { opacity: 0; transform: translateX(20px); }

.panel-hd {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #e1e1e1;
  flex-shrink: 0;
}
.panel-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600; color: #1a1a1a;
}
.close-btn {
  width: 26px; height: 26px; background: none;
  border: 1px solid #e1e1e1; border-radius: 4px;
  color: #8a8a8a; cursor: pointer;
  display: grid; place-items: center; transition: all .15s;
}
.close-btn:hover { background: #f0f0f0; color: #1a1a1a; }

.panel-body { flex: 1; overflow-y: auto; padding: 12px; }
.panel-body::-webkit-scrollbar       { width: 3px; }
.panel-body::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 2px; }

.empty {
  display: flex; flex-direction: column;
  align-items: center; gap: 8px; padding: 48px 16px;
  color: #c0c0c0;
}
.empty span { font-size: 13px; }

.log-list { display: flex; flex-direction: column; gap: 2px; }
.log-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 9px 8px; border-radius: 5px; transition: background .12s;
}
.log-item:hover { background: #f9f9f9; }

.log-dot {
  width: 7px; height: 7px; border-radius: 50%;
  flex-shrink: 0; margin-top: 5px;
}
.dot-create  { background: #107c10; }
.dot-update  { background: #5b5ea6; }
.dot-move    { background: #c7700a; }
.dot-delete  { background: #d13438; }
.dot-default { background: #c0c0c0; }

.log-content { flex: 1; min-width: 0; }
.log-msg  { font-size: 12.5px; color: #4a4a4a; line-height: 1.5; }
.log-time { font-size: 11px; color: #a0a0a0; margin-top: 2px; }

.log-enter-active { transition: all .18s ease; }
.log-enter-from   { opacity: 0; transform: translateX(6px); }
</style>