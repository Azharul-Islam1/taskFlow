 <template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="overlay" @click.self="$emit('close')">
        <div class="modal">
          <div class="modal-hd">
            <div class="modal-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Task
            </div>
            <button class="close-btn" @click="$emit('close')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="field">
              <label class="flb">Task Title <span class="req">*</span></label>
              <input
                class="fin" v-model="form.title"
                placeholder="e.g. Design new landing page"
                ref="titleRef"
                @keyup.enter="handleSubmit"
              />
            </div>

            <div class="field">
              <label class="flb">Description</label>
              <textarea
                class="fin fta" v-model="form.description"
                placeholder="Add details..." rows="3"
              />
            </div>

            <div class="two-col">
              <div class="field">
                <label class="flb">Status</label>
                <div class="sel-wrap">
                  <select class="fin fsel" v-model="form.status">
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <svg class="sel-ic" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
              <div class="field">
                <label class="flb">Priority</label>
                <div class="pri-btns">
                  <button
                    v-for="p in priorities" :key="p.value"
                    class="pri-btn" :class="[`p-${p.value}`, { active: form.priority === p.value }]"
                    @click="form.priority = p.value" type="button"
                  >
                    <div class="pdot"></div>{{ p.label }}
                  </button>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="flb">Due Date</label>
              <input class="fin" type="date" v-model="form.dueDate" :min="today"/>
            </div>

            <div class="field">
              <label class="flb">Tags <span class="hint">press Enter to add</span></label>
              <div class="fin tag-row">
                <TransitionGroup name="tag" tag="div" class="tag-chips">
                  <span v-for="tag in form.tags" :key="tag" class="tag-chip">
                    {{ tag }}
                    <button class="tag-rm" @click="removeTag(tag)">✕</button>
                  </span>
                </TransitionGroup>
                <input
                  class="tag-inp" v-model="tagInput"
                  placeholder="design, frontend..."
                  @keydown.enter.prevent="addTag"
                  @keydown.comma.prevent="addTag"
                />
              </div>
            </div>
          </div>

          <div class="modal-ft">
            <button class="btn-cancel" @click="$emit('close')">Cancel</button>
            <button class="btn-submit" @click="handleSubmit" :disabled="!form.title.trim()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Create Task
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen:        Boolean,
  defaultStatus: { type: String, default: 'todo' }
})
const emit = defineEmits(['close', 'submit'])

const priorities = [
  { value: 'low',    label: 'Low'    },
  { value: 'medium', label: 'Med'    },
  { value: 'high',   label: 'High'   },
]

const today    = new Date().toISOString().split('T')[0]
const titleRef = ref(null)
const tagInput = ref('')

const defaultForm = () => ({
  title: '', description: '',
  status: props.defaultStatus,
  priority: 'medium', dueDate: '', tags: []
})

const form = ref(defaultForm())

watch(() => props.isOpen, async (val) => {
  if (val) {
    form.value = defaultForm()
    form.value.status = props.defaultStatus
    tagInput.value = ''
    await nextTick()
    titleRef.value?.focus()
  }
})

function addTag() {
  const t = tagInput.value.replace(/,/g,'').trim().toLowerCase()
  if (t && !form.value.tags.includes(t) && form.value.tags.length < 5)
    form.value.tags.push(t)
  tagInput.value = ''
}
function removeTag(tag) {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}
function handleSubmit() {
  if (!form.value.title.trim()) return
  if (tagInput.value.trim()) addTag()
  emit('submit', { ...form.value })
  emit('close')
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; z-index: 300;
  background: rgba(0,0,0,0.35);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.modal {
  background: white; border-radius: 8px;
  width: 100%; max-width: 460px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  overflow: hidden;
}
.modal-enter-active { transition: all .2s cubic-bezier(.34,1.3,.64,1); }
.modal-leave-active { transition: all .15s ease; }
.modal-enter-from   { opacity: 0; transform: scale(.95) translateY(8px); }
.modal-leave-to     { opacity: 0; transform: scale(.97); }

.modal-hd {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 16px 18px 14px;
  border-bottom: 1px solid #e1e1e1;
}
.modal-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 600; color: #1a1a1a;
}
.close-btn {
  width: 26px; height: 26px; background: none;
  border: 1px solid #e1e1e1; border-radius: 4px;
  color: #8a8a8a; cursor: pointer;
  display: grid; place-items: center; transition: all .15s;
}
.close-btn:hover { background: #f0f0f0; color: #1a1a1a; }

.modal-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 13px; }

.field { display: flex; flex-direction: column; gap: 5px; }
.flb {
  font-size: 11px; font-weight: 600; color: #8a8a8a;
  text-transform: uppercase; letter-spacing: .05em;
}
.req  { color: #d13438; }
.hint { font-size: 11px; color: #c0c0c0; font-weight: 400; text-transform: none; letter-spacing: 0; margin-left: 4px; }

.fin {
  width: 100%; background: white !important;
  border: 1px solid #d0d0d0 !important;
  border-radius: 4px !important; padding: 8px 11px !important;
  font-size: 13.5px !important; color: #1a1a1a !important;
  outline: none !important; box-shadow: none !important;
  transition: border-color .15s !important;
}
.fin:hover { border-color: #a0a0a0 !important; }
.fin:focus { border-color: #5b5ea6 !important; box-shadow: 0 0 0 3px rgba(91,94,166,0.12) !important; }
.fin::placeholder { color: #c0c0c0 !important; }
.fta { resize: vertical; min-height: 68px; line-height: 1.55; }

input[type="date"].fin { color-scheme: light; }

.sel-wrap { position: relative; }
.fsel { appearance: none; cursor: pointer; padding-right: 28px !important; }
.sel-ic { position: absolute; right: 9px; top: 50%; transform: translateY(-50%); color: #a0a0a0; pointer-events: none; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.pri-btns { display: flex; gap: 5px; }
.pri-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
  padding: 7px 4px; border-radius: 4px; cursor: pointer;
  font-family: inherit; font-size: 11px; font-weight: 600;
  background: white; border: 1px solid #d0d0d0;
  color: #8a8a8a; transition: all .15s;
}
.pdot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

.p-low    .pdot { background: #107c10; }
.p-medium .pdot { background: #c7700a; }
.p-high   .pdot { background: #d13438; }

.p-low:hover,    .p-low.active    { background: #dff6dd; border-color: #9fd49f; color: #107c10; }
.p-medium:hover, .p-medium.active { background: #fff4ce; border-color: #f0d070; color: #c7700a; }
.p-high:hover,   .p-high.active   { background: #fde7e9; border-color: #f1b2b7; color: #d13438; }

.tag-row {
  display: flex; flex-wrap: wrap; align-items: center;
  gap: 5px; padding: 6px 8px !important; min-height: 38px; cursor: text;
}
.tag-chips { display: contents; }
.tag-chip {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; color: #7a4f00; font-weight: 500;
  background: #fde7c3; border-radius: 3px; padding: 2px 7px;
}
.tag-rm {
  background: none; border: none; cursor: pointer;
  color: #7a4f00; font-size: 9px; padding: 0; transition: color .12s;
}
.tag-rm:hover { color: #d13438; }
.tag-inp {
  flex: 1; min-width: 80px; background: none !important;
  border: none !important; outline: none !important;
  box-shadow: none !important; padding: 0 !important;
  font-size: 13px !important; color: #1a1a1a !important;
}
.tag-inp::placeholder { color: #c0c0c0 !important; }

.tag-enter-active { transition: all .15s ease; }
.tag-enter-from   { opacity: 0; transform: scale(.85); }
.tag-leave-active { transition: all .12s ease; }
.tag-leave-to     { opacity: 0; transform: scale(.85); }

.modal-ft {
  display: flex; align-items: center; justify-content: flex-end; gap: 8px;
  padding: 12px 18px; border-top: 1px solid #e1e1e1;
  background: #fafafa;
}
.btn-cancel {
  padding: 7px 16px; background: white;
  border: 1px solid #d0d0d0; border-radius: 4px;
  color: #4a4a4a; font-family: inherit; font-size: 13px;
  font-weight: 500; cursor: pointer; transition: all .15s;
}
.btn-cancel:hover { background: #f5f5f5; }

.btn-submit {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 16px; background: #5b5ea6;
  border: none; border-radius: 4px; color: white;
  font-family: inherit; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .15s;
}
.btn-submit:hover:not(:disabled) { background: #4a4d8f; }
.btn-submit:disabled { opacity: .4; cursor: not-allowed; }

@media (max-width: 480px) {
  .two-col { grid-template-columns: 1fr; }
}
</style>