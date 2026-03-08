 <template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ isEdit ? 'Edit Task' : 'New Task' }}</h2>
            <button class="close-btn" @click="close">✕</button>
          </div>

          <div class="modal-body">
            <div class="field">
              <label>Title *</label>
              <input v-model="form.title" type="text" placeholder="Task title..." ref="titleInput" />
            </div>

            <div class="field">
              <label>Description</label>
              <textarea v-model="form.description" placeholder="Add details..." rows="3"></textarea>
            </div>

            <div class="field-row">
              <div class="field">
                <label>Priority</label>
                <select v-model="form.priority">
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              <div class="field">
                <label>Status</label>
                <select v-model="form.status">
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div class="field">
              <label>Due Date</label>
              <input v-model="form.dueDate" type="date" />
            </div>

            <div class="field">
              <label>Tags (comma separated)</label>
              <input v-model="tagsInput" type="text" placeholder="design, frontend, urgent" />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="close">Cancel</button>
            <button class="btn-submit" @click="submit" :disabled="!form.title.trim()">
              {{ isEdit ? 'Save Changes' : 'Create Task' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  task: { type: Object, default: null },
  defaultStatus: { type: String, default: 'todo' }
})

const emit = defineEmits(['close', 'submit'])

const isEdit = ref(false)
const titleInput = ref(null)
const tagsInput = ref('')

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: ''
})

watch(() => props.isOpen, async (open) => {
  if (open) {
    if (props.task) {
      isEdit.value = true
      Object.assign(form, {
        title: props.task.title,
        description: props.task.description || '',
        priority: props.task.priority || 'medium',
        status: props.task.status,
        dueDate: props.task.dueDate ? props.task.dueDate.slice(0, 10) : ''
      })
      tagsInput.value = props.task.tags?.join(', ') || ''
    } else {
      isEdit.value = false
      Object.assign(form, { title: '', description: '', priority: 'medium', status: props.defaultStatus, dueDate: '' })
      tagsInput.value = ''
    }
    await nextTick()
    titleInput.value?.focus()
  }
})

function close() { emit('close') }

function submit() {
  if (!form.title.trim()) return
  const payload = {
    ...form,
    tags: tagsInput.value
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
  }
  emit('submit', payload)
  close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}
.modal {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-card), 0 0 60px rgba(108,99,255,0.2);
  overflow: hidden;
}
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-subtle);
}
.modal-header h2 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
}
.close-btn {
  background: none; border: none; color: var(--text-secondary);
  cursor: pointer; font-size: 16px; padding: 4px;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background var(--transition-fast);
}
.close-btn:hover { color: var(--text-primary); background: var(--bg-secondary); }
.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field { display: flex; flex-direction: column; gap: 6px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field label {
  font-size: 12px; font-weight: 500; color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.field input, .field textarea, .field select {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  outline: none;
  resize: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.field input:focus, .field textarea:focus, .field select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(108,99,255,0.15);
}
.field select option { background: var(--bg-card); }
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 24px;
}
.btn-cancel {
  background: none; border: 1px solid var(--border-subtle);
  color: var(--text-secondary); border-radius: var(--radius-sm);
  padding: 10px 20px; cursor: pointer; font-family: var(--font-body); font-size: 14px;
  transition: all var(--transition-fast);
}
.btn-cancel:hover { color: var(--text-primary); border-color: var(--text-muted); }
.btn-submit {
  background: linear-gradient(135deg, var(--accent-primary), #8b85ff);
  border: none; border-radius: var(--radius-sm);
  padding: 10px 24px; color: white;
  font-family: var(--font-display); font-size: 14px; font-weight: 600;
  cursor: pointer; transition: opacity var(--transition-fast), transform var(--transition-fast);
}
.btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
</style>