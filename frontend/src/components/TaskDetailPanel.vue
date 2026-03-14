  <template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="isOpen" class="overlay" @click.self="$emit('close')">
        <Transition name="panel-slide">
          <div v-if="isOpen" class="panel">

            <div class="panel-hd">
              <span class="breadcrumb">TaskFlow · Sprint Board</span>
              <div class="panel-hd-r">
                <button class="hd-btn del" @click="confirmDelete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
                <button class="hd-btn" @click="$emit('close')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="panel-body">

              <div class="p-title-sec">
                <div class="p-title-row">
                  <div class="p-circle" :class="{ done: form.status === 'done' }" @click="toggleDone"></div>
                  <input class="p-title-inp" v-model="form.title" placeholder="Task title" @blur="autoSave"/>
                </div>

                <div class="p-row">
                  <div class="p-row-ic">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div class="p-av">{{ userInitial }}</div>
                  <span class="p-av-name">{{ userName }}</span>
                </div>

                <div class="p-row" style="align-items:flex-start;padding-top:8px;">
                  <div class="p-row-ic" style="margin-top:4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                      <line x1="7" y1="7" x2="7.01" y2="7"/>
                    </svg>
                  </div>
                  <div class="p-tags">
                    <span v-for="tag in form.tags" :key="tag" class="p-tag">
                      {{ tag }}
                      <button class="p-tag-x" @click="removeTag(tag)">✕</button>
                    </span>
                    <input
                      class="p-tag-inp" v-model="tagInput"
                      placeholder="Add label..."
                      @keydown.enter.prevent="addTag"
                      @keydown.comma.prevent="addTag"
                      @blur="autoSave"
                    />
                  </div>
                </div>
              </div>

              <div class="p-fields-sec">
                <div class="p-grid">
                  <div class="pf">
                    <div class="pf-label">Bucket</div>
                    <div class="pf-sel">
                      <select v-model="form.status" @change="autoSave">
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  <div class="pf">
                    <div class="pf-label">Progress</div>
                    <div class="pf-val">
                      <div class="p-circle-sm" :class="{ done: form.status === 'done' }"></div>
                      {{ form.status === 'done' ? 'Completed' : form.status === 'inprogress' ? 'In progress' : 'Not started' }}
                    </div>
                  </div>

                  <div class="pf">
                    <div class="pf-label">Priority</div>
                    <div class="pf-sel">
                      <div class="pf-sel-inner">
                        <div class="pri-dot" :class="`dot-${form.priority}`"></div>
                        <select v-model="form.priority" @change="autoSave">
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  <div class="pf">
                    <div class="pf-label">Due date</div>
                    <div class="pf-val" :class="{ overdue: isOverdue }">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8"  y1="2" x2="8"  y2="6"/>
                        <line x1="3"  y1="10" x2="21" y2="10"/>
                      </svg>
                      <input type="date" v-model="form.dueDate" @change="autoSave" class="date-inp"/>
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-sec-wrap">
                <div class="p-sec-hd">Notes
                  <label class="show-on-card">
                    <input type="checkbox" v-model="form.showNoteOnCard" @change="autoSave"/>
                    Show on card
                  </label>
                </div>
                <textarea
                  class="p-textarea"
                  v-model="form.description"
                  placeholder="Add notes..."
                  rows="4"
                  @blur="autoSave"
                ></textarea>
              </div>

              <div class="p-sec-wrap">
                <div class="p-sec-hd-row">
                  <div class="p-sec-hd-left">
                    Checklist
                    <span v-if="form.checklist.length" class="sec-count">
                      {{ checkedCount }} / {{ form.checklist.length }}
                    </span>
                  </div>
                </div>

                <div v-if="form.checklist.length" class="cl-progress-row">
                  <span class="cl-pct">{{ checklistProgress }}%</span>
                  <div class="cl-bar">
                    <div class="cl-fill" :style="{ width: checklistProgress + '%' }"></div>
                  </div>
                </div>

                <div class="p-items">
                  <div v-for="(item, i) in form.checklist" :key="item._id || i" class="p-item">
                    <div
                      class="p-item-chk" :class="{ done: item.checked }"
                      @click="toggleChecklistItem(item, i)"
                    ></div>
                    <span class="p-item-txt" :class="{ done: item.checked }">{{ item.text }}</span>
                    <button class="p-item-del" @click="removeChecklist(i)">✕</button>
                  </div>
                </div>

                <div class="p-add-row">
                  <div class="p-add-circle"></div>
                  <input
                    class="p-add-inp"
                    v-model="checklistInput"
                    placeholder="Add an item"
                    @keydown.enter.prevent="addChecklistItem"
                  />
                  <button v-if="checklistInput.trim()" class="p-add-btn" @click="addChecklistItem">Add</button>
                </div>
              </div>

              <div class="p-sec-wrap">
                <div class="p-sec-hd">Attachments</div>
                <button class="attach-btn">Add attachment</button>
              </div>

              <div class="p-sec-wrap">
                <div class="p-sec-hd">Comments</div>
                <div class="comment-box">
                  <textarea
                    class="p-textarea"
                    v-model="comment"
                    placeholder="Type your message here..."
                    rows="3"
                  ></textarea>
                  <div class="comment-foot">
                    <button class="comment-send" :disabled="!comment.trim()">Send</button>
                  </div>
                </div>
                <div v-for="(log, i) in activityItems" :key="i" class="activity-item">
                  <div class="act-av">{{ log.initials }}</div>
                  <div class="act-body">
                    <div class="act-top">
                      <span class="act-name">{{ log.name }}</span>
                      <span class="act-time">{{ log.time }}</span>
                    </div>
                    <p class="act-msg">{{ log.message }}</p>
                  </div>
                </div>
              </div>

            </div>

            <div class="panel-ft">
              <button class="ft-cancel" @click="$emit('close')">Cancel</button>
              <button class="ft-save" @click="saveAndClose">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Save changes
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'

const props = defineProps({ isOpen: Boolean, task: Object })
const emit  = defineEmits(['close', 'submit', 'delete'])

const authStore = useAuthStore()
const taskStore = useTaskStore()

const tagInput       = ref('')
const checklistInput = ref('')
const comment        = ref('')

const form = ref({
  title: '', description: '', status: 'todo',
  priority: 'medium', dueDate: '', tags: [],
  checklist: [], showNoteOnCard: false
})

const userInitial = computed(() => authStore.user?.name?.[0]?.toUpperCase() || '?')
const userName    = computed(() => authStore.user?.name || '')

const isOverdue = computed(() => {
  if (!form.value.dueDate || form.value.status === 'done') return false
  return new Date(form.value.dueDate) < new Date()
})

const checkedCount = computed(() =>
  form.value.checklist.filter(c => c.checked).length
)

const checklistProgress = computed(() => {
  if (!form.value.checklist.length) return 0
  return Math.round(checkedCount.value / form.value.checklist.length * 100)
})

const activityItems = computed(() =>
  taskStore.activityLog.slice(0, 5).map(log => ({
    ...log,
    initials: authStore.user?.name?.[0]?.toUpperCase() || '?',
    name: authStore.user?.name || 'User'
  }))
)

watch(() => props.task, (t) => {
  if (t) {
    form.value = {
      title:           t.title       || '',
      description:     t.description || '',
      status:          t.status      || 'todo',
      priority:        t.priority    || 'medium',
      dueDate:         t.dueDate ? t.dueDate.split('T')[0] : '',
      tags:            [...(t.tags      || [])],
      checklist:       (t.checklist || []).map(c => ({ ...c })),
      showNoteOnCard:  t.showNoteOnCard || false
    }
    tagInput.value       = ''
    checklistInput.value = ''
    comment.value        = ''
  }
}, { immediate: true })

function addTag() {
  const t = tagInput.value.replace(/,/g,'').trim()
  if (t && !form.value.tags.includes(t) && form.value.tags.length < 5)
    form.value.tags.push(t)
  tagInput.value = ''
}
function removeTag(tag) {
  form.value.tags = form.value.tags.filter(t => t !== tag)
  autoSave()
}

function addChecklistItem() {
  if (!checklistInput.value.trim()) return
  form.value.checklist.push({ text: checklistInput.value.trim(), checked: false })
  checklistInput.value = ''
  autoSave()
}

function removeChecklist(i) {
  form.value.checklist.splice(i, 1)
  autoSave()
}

async function toggleChecklistItem(item, i) {
  if (item._id && props.task?._id) {
    const updated = await taskStore.toggleChecklist(props.task._id, item._id)
    if (updated) {
      form.value.checklist = updated.checklist.map(c => ({ ...c }))
    }
  } else {
    form.value.checklist[i].checked = !form.value.checklist[i].checked
    autoSave()
  }
}

function toggleDone() {
  form.value.status = form.value.status === 'done' ? 'todo' : 'done'
  autoSave()
}

function autoSave()     { emit('submit', { ...form.value }) }
function saveAndClose() { emit('submit', { ...form.value }); emit('close') }
function confirmDelete() {
  if (confirm('Delete this task?')) emit('delete', props.task?._id)
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(15,23,42,0.3);
  display: flex; justify-content: flex-end;
  backdrop-filter: blur(2px);
}
.overlay-fade-enter-active, .overlay-fade-leave-active { transition: opacity .2s ease; }
.overlay-fade-enter-from, .overlay-fade-leave-to { opacity: 0; }

.panel {
  width: 500px; height: 100%; background: white;
  box-shadow: -6px 0 32px rgba(0,0,0,0.1);
  display: flex; flex-direction: column; overflow: hidden;
}
.panel-slide-enter-active { transition: transform .22s cubic-bezier(.4,0,.2,1), opacity .22s; }
.panel-slide-leave-active { transition: transform .18s ease, opacity .18s; }
.panel-slide-enter-from, .panel-slide-leave-to { transform: translateX(32px); opacity: 0; }

.panel-hd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 18px; border-bottom: 0.5px solid #f1f5f9; flex-shrink: 0;
}
.breadcrumb { font-size: 12px; color: #5B5FC7; font-weight: 500; }
.panel-hd-r { display: flex; gap: 6px; }
.hd-btn {
  width: 30px; height: 30px; background: white;
  border: 0.5px solid #e2e8f0; border-radius: 7px;
  cursor: pointer; display: grid; place-items: center;
  color: #94a3b8; transition: all .15s;
}
.hd-btn:hover     { background: #f8fafc; color: #0f172a; }
.hd-btn.del:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }

.panel-body { flex: 1; overflow-y: auto; }
.panel-body::-webkit-scrollbar       { width: 4px; }
.panel-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

.p-title-sec { padding: 16px 20px 14px; border-bottom: 0.5px solid #f1f5f9; }
.p-title-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 14px; }

.p-circle {
  width: 20px; height: 20px; border-radius: 50%;
  border: 1.5px solid #94a3b8; flex-shrink: 0;
  margin-top: 4px; cursor: pointer;
  display: grid; place-items: center; transition: all .15s;
}
.p-circle:hover { border-color: #5B5FC7; }
.p-circle.done  { background: #22c55e; border-color: #22c55e; }
.p-circle.done::after { content: '✓'; color: white; font-size: 11px; font-weight: 800; }

.p-title-inp {
  flex: 1; font-size: 18px; font-weight: 600; color: #0f172a;
  border: none; outline: none; background: none;
  line-height: 1.4; font-family: inherit; padding: 0;
}
.p-title-inp::placeholder { color: #cbd5e1; }

.p-row { display: flex; align-items: center; gap: 10px; padding: 5px 0; }
.p-row-ic { color: #94a3b8; width: 20px; display: grid; place-items: center; flex-shrink: 0; }
.p-av {
  width: 28px; height: 28px; border-radius: 50%;
  background: #8B6D57;
  display: grid; place-items: center;
  font-size: 11px; font-weight: 600; color: white; flex-shrink: 0;
}
.p-av-name { font-size: 13px; color: #0f172a; font-weight: 500; }

.p-tags { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; flex: 1; }
.p-tag {
  display: inline-flex; align-items: center; gap: 5px;
  background: #FAEEDA; color: #854F0B;
  font-size: 11px; font-weight: 500;
  padding: 3px 10px; border-radius: 4px;
}
.p-tag-x { background: none; border: none; cursor: pointer; color: #854F0B; font-size: 10px; padding: 0; }
.p-tag-x:hover { color: #dc2626; }
.p-tag-inp {
  border: none; outline: none; background: none;
  font-size: 13px; color: #0f172a; min-width: 80px; font-family: inherit; padding: 0;
}
.p-tag-inp::placeholder { color: #cbd5e1; }

.p-fields-sec { padding: 14px 20px; border-bottom: 0.5px solid #f1f5f9; }
.p-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.pf { display: flex; flex-direction: column; gap: 5px; }
.pf-label { font-size: 11px; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }

.pf-val {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 10px; border: 0.5px solid #e2e8f0;
  border-radius: 6px; font-size: 13px; color: #0f172a;
  background: white; min-height: 38px; font-weight: 500;
}
.pf-val.overdue { background: #fef2f2; border-color: #fecaca; color: #dc2626; }

.date-inp {
  border: none; outline: none; background: none;
  font-size: 13px; color: inherit; font-family: inherit;
  cursor: pointer; flex: 1; padding: 0; color-scheme: light;
}

.pf-sel {
  display: flex; align-items: center; justify-content: space-between;
  border: 0.5px solid #e2e8f0; border-radius: 6px;
  padding: 8px 10px; background: white; min-height: 38px;
}
.pf-sel-inner { display: flex; align-items: center; gap: 7px; flex: 1; }
.pf-sel select {
  border: none; outline: none; background: none;
  font-size: 13px; color: #0f172a; font-weight: 500;
  font-family: inherit; cursor: pointer; appearance: none; flex: 1;
}
.pf-sel svg { color: #cbd5e1; flex-shrink: 0; }

.p-circle-sm {
  width: 14px; height: 14px; border-radius: 50%;
  border: 1.5px solid #94a3b8; flex-shrink: 0;
}
.p-circle-sm.done { background: #22c55e; border-color: #22c55e; }

.pri-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-high   { background: #ef4444; }
.dot-medium { background: #f59e0b; }
.dot-low    { background: #22c55e; }

.p-sec-wrap { padding: 16px 20px; border-bottom: 0.5px solid #f1f5f9; }

.p-sec-hd {
  font-size: 13px; font-weight: 600; color: #1a1a1a;
  margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;
}
.show-on-card {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; color: #94a3b8; font-weight: 400; cursor: pointer;
}
.show-on-card input { cursor: pointer; }

.p-sec-hd-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
}
.p-sec-hd-left {
  font-size: 13px; font-weight: 600; color: #1a1a1a;
  display: flex; align-items: center; gap: 8px;
}
.sec-count { font-size: 12px; color: #64748b; font-weight: 500; }

.p-textarea {
  width: 100%; background: #f8f9fa;
  border: 0.5px solid #e2e8f0; border-radius: 6px;
  padding: 10px 12px; font-size: 13px; color: #1a1a1a;
  line-height: 1.6; resize: vertical; outline: none; font-family: inherit;
  box-sizing: border-box;
}
.p-textarea:focus { border-color: #5B5FC7; background: white; }

.cl-progress-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.cl-pct { font-size: 12px; font-weight: 600; color: #64748b; min-width: 32px; }
.cl-bar { flex: 1; height: 4px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
.cl-fill { height: 100%; background: #5B5FC7; border-radius: 4px; transition: width .3s; }

.p-items { display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px; }
.p-item  {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 8px; border-radius: 6px; transition: background .12s;
}
.p-item:hover { background: #f8faff; }

.p-item-chk {
  width: 18px; height: 18px; border-radius: 50%;
  border: 1.5px solid #94a3b8; flex-shrink: 0;
  cursor: pointer; display: grid; place-items: center; transition: all .15s;
}
.p-item-chk:hover { border-color: #5B5FC7; }
.p-item-chk.done  { background: #5B5FC7; border-color: #5B5FC7; }
.p-item-chk.done::after { content: '✓'; color: white; font-size: 10px; font-weight: 800; }

.p-item-txt { flex: 1; font-size: 13px; color: #1a1a1a; font-weight: 400; }
.p-item-txt.done { text-decoration: line-through; color: #94a3b8; }

.p-item-del {
  background: none; border: none; cursor: pointer;
  color: #cbd5e1; font-size: 12px; padding: 3px 5px;
  border-radius: 4px; opacity: 0; transition: all .12s;
}
.p-item:hover .p-item-del { opacity: 1; }
.p-item-del:hover { background: #fef2f2; color: #dc2626; }

.p-add-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px; border-radius: 6px;
  border: 0.5px solid #e2e8f0; transition: border-color .15s;
  background: white;
}
.p-add-row:focus-within { border-color: #5B5FC7; }
.p-add-circle {
  width: 18px; height: 18px; border-radius: 50%;
  border: 1.5px solid #cbd5e1; flex-shrink: 0;
}
.p-add-inp {
  flex: 1; border: none; outline: none; background: none;
  font-size: 13px; color: #1a1a1a; font-family: inherit; padding: 0;
}
.p-add-inp::placeholder { color: #94a3b8; }
.p-add-btn {
  padding: 3px 12px; background: #5B5FC7;
  border: none; border-radius: 5px; color: white;
  font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit;
}
.p-add-btn:hover { background: #4e52b5; }

.attach-btn {
  padding: 7px 16px;
  border: 0.5px solid #e2e8f0; border-radius: 7px;
  background: white; font-size: 13px; color: #475569;
  cursor: pointer; font-family: inherit; transition: all .15s;
}
.attach-btn:hover { background: #f8fafc; border-color: #cbd5e1; }

.comment-box { margin-bottom: 12px; }
.comment-foot { display: flex; justify-content: flex-end; margin-top: 6px; }
.comment-send {
  padding: 5px 16px; background: white;
  border: 0.5px solid #e2e8f0; border-radius: 6px;
  font-size: 12px; color: #64748b; cursor: pointer;
  font-family: inherit; transition: all .15s;
}
.comment-send:disabled { opacity: 0.4; cursor: not-allowed; }
.comment-send:not(:disabled):hover { background: #f8fafc; border-color: #5B5FC7; color: #5B5FC7; }

.activity-item {
  display: flex; gap: 10px; padding: 8px 0;
  border-top: 0.5px solid #f1f5f9;
}
.act-av {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: #C0395A; display: grid; place-items: center;
  font-size: 10px; font-weight: 600; color: white;
}
.act-body { flex: 1; }
.act-top { display: flex; justify-content: space-between; margin-bottom: 2px; }
.act-name { font-size: 12px; font-weight: 600; color: #0f172a; }
.act-time { font-size: 11px; color: #94a3b8; }
.act-msg  { font-size: 12px; color: #64748b; margin: 0; }

.panel-ft {
  padding: 12px 20px; border-top: 0.5px solid #e2e8f0;
  display: flex; justify-content: flex-end; gap: 8px;
  flex-shrink: 0;
}
.ft-cancel {
  padding: 8px 16px; background: white;
  border: 0.5px solid #e2e8f0; border-radius: 6px;
  color: #64748b; font-family: inherit; font-size: 13px;
  font-weight: 500; cursor: pointer;
}
.ft-cancel:hover { background: #f8fafc; }
.ft-save {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 18px; background: #5B5FC7;
  border: none; border-radius: 6px; color: white;
  font-family: inherit; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .15s;
}
.ft-save:hover { background: #4e52b5; transform: translateY(-1px); }

@media (max-width: 540px) {
  .panel { width: 100%; }
  .p-grid { grid-template-columns: 1fr; }
}
</style>