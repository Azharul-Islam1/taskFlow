 <template>
  <div class="reg-wrap">
    <div class="reg-box">
      <!-- logo -->
      <div class="lb-logo">
        <div class="lb-mark">T</div>
        <span class="lb-name">TaskFlow</span>
      </div>

      <h1 class="lb-hd">Create account</h1>
      <p class="lb-sh">to get started with TaskFlow</p>

      <transition name="slide-down">
        <div v-if="authStore.error" class="err-box">⚠ {{ authStore.error }}</div>
      </transition>

      <div class="two-col">
        <div class="field">
          <label class="flb">First name</label>
          <input
            class="fin"
            v-model="firstName"
            placeholder="John"
            :disabled="authStore.loading"
          />
        </div>
        <div class="field">
          <label class="flb">Last name</label>
          <input
            class="fin"
            v-model="lastName"
            placeholder="Doe"
            :disabled="authStore.loading"
          />
        </div>
      </div>

      <div class="field">
        <label class="flb">Email</label>
        <input
          class="fin"
          v-model="email"
          type="email"
          placeholder="you@example.com"
          :disabled="authStore.loading"
        />
      </div>

      <div class="field">
        <label class="flb">Password</label>
        <input
          class="fin"
          v-model="password"
          type="password"
          placeholder="Min. 8 characters"
          @keyup.enter="handleRegister"
          :disabled="authStore.loading"
        />
        <div v-if="password" class="pw-meter">
          <div class="pw-track">
            <div class="pw-seg" :class="pwClass(1)"></div>
            <div class="pw-seg" :class="pwClass(2)"></div>
            <div class="pw-seg" :class="pwClass(3)"></div>
            <div class="pw-seg" :class="pwClass(4)"></div>
          </div>
          <div class="pw-hint" :style="{ color: pwColor }">{{ pwLabel }}</div>
        </div>
      </div>

      <button class="fbtn" @click="handleRegister" :disabled="authStore.loading">
        <span v-if="!authStore.loading">Create account</span>
        <span v-else class="spin"></span>
      </button>

      <div class="lb-sw">
        Already have an account?
        <router-link to="/login">Sign in</router-link>
      </div>
    </div>

    <!-- right side -->
    <div class="reg-side">
      <div class="rs-inner">
        <div class="rs-steps">
          <div class="rs-step done">
            <div class="rs-step-dot">✓</div>
            <div class="rs-step-label">Choose plan</div>
          </div>
          <div class="rs-line"></div>
          <div class="rs-step active">
            <div class="rs-step-dot">2</div>
            <div class="rs-step-label">Create account</div>
          </div>
          <div class="rs-line"></div>
          <div class="rs-step">
            <div class="rs-step-dot">3</div>
            <div class="rs-step-label">Start working</div>
          </div>
        </div>
        <div class="rs-title">You're almost there!</div>
        <div class="rs-sub">Create your account and start managing tasks with your team.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router    = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName  = ref('')
const email     = ref('')
const password  = ref('')

const pwStrength = computed(() => {
  const l = password.value.length
  if (l === 0) return 0
  if (l < 6)   return 1
  if (l < 10)  return 2
  return 3
})
const pwColor = computed(() =>
  ['#d13438','#c7700a','#107c10'][pwStrength.value - 1] || '#c0c0c0'
)
const pwLabel = computed(() =>
  ['Weak','Medium — add numbers or symbols','Strong ✓'][pwStrength.value - 1] || ''
)
function pwClass(seg) {
  if (pwStrength.value === 0) return ''
  if (pwStrength.value === 1 && seg === 1) return 'w'
  if (pwStrength.value === 2 && seg <= 2)  return 'm'
  if (pwStrength.value === 3 && seg <= 4)  return 's'
  return ''
}

async function handleRegister() {
  if (!firstName.value || !email.value || !password.value) return
  const name = `${firstName.value} ${lastName.value}`.trim()
  const ok   = await authStore.register(name, email.value, password.value)
  if (ok) router.push('/')
}
</script>

<style scoped>
.reg-wrap {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* ── LEFT ── */
.reg-box {
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 60px 80px;
  background: white;
}

.lb-logo {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 32px;
}
.lb-mark {
  width: 36px; height: 36px; border-radius: 6px;
  background: #5b5ea6;
  display: grid; place-items: center;
  font-size: 16px; font-weight: 700; color: white;
}
.lb-name { font-size: 18px; font-weight: 600; color: #1a1a1a; }

.lb-hd {
  font-size: 24px; font-weight: 600;
  color: #1a1a1a; margin-bottom: 4px;
  align-self: flex-start;
}
.lb-sh {
  font-size: 13px; color: #8a8a8a;
  margin-bottom: 24px; align-self: flex-start;
}

.err-box {
  width: 100%;
  background: #fde7e9; border: 1px solid #f1b2b7;
  color: #d13438; border-radius: 4px;
  padding: 10px 13px; margin-bottom: 14px; font-size: 13px;
}
.slide-down-enter-active { transition: all .2s ease; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-6px); }

.two-col {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px; width: 100%;
}

.field { width: 100%; margin-bottom: 14px; }
.flb {
  display: block; font-size: 12px; font-weight: 600;
  color: #4a4a4a; margin-bottom: 6px;
}
.fin {
  width: 100% !important;
  background: white !important;
  border: 1px solid #d0d0d0 !important;
  border-radius: 4px !important;
  padding: 9px 12px !important;
  font-size: 14px !important;
  color: #1a1a1a !important;
  outline: none !important;
  transition: border-color .15s, box-shadow .15s !important;
  box-shadow: none !important;
}
.fin:hover { border-color: #a0a0a0 !important; }
.fin:focus {
  border-color: #5b5ea6 !important;
  box-shadow: 0 0 0 3px rgba(91,94,166,0.15) !important;
  background: white !important;
}
.fin::placeholder { color: #c0c0c0 !important; }
.fin:disabled     { opacity: .5; cursor: not-allowed; }

/* password meter */
.pw-meter  { margin-top: 7px; }
.pw-track  { display: grid; grid-template-columns: repeat(4,1fr); gap: 3px; }
.pw-seg    { height: 3px; border-radius: 2px; background: #e1e1e1; transition: background .3s; }
.pw-seg.w  { background: #d13438; }
.pw-seg.m  { background: #c7700a; }
.pw-seg.s  { background: #107c10; }
.pw-hint   { font-size: 11px; margin-top: 5px; transition: color .3s; }

.fbtn {
  width: 100%; padding: 10px;
  background: #5b5ea6; border: none;
  border-radius: 4px; color: white;
  font-size: 14px; font-weight: 600;
  cursor: pointer; transition: background .15s;
  margin-top: 4px;
}
.fbtn:hover:not(:disabled) { background: #4a4d8f; }
.fbtn:disabled { opacity: .5; cursor: not-allowed; }

.spin {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: white; border-radius: 50%;
  animation: spinR .7s linear infinite;
  display: inline-block;
}
@keyframes spinR { to { transform: rotate(360deg); } }

.lb-sw {
  margin-top: 20px; font-size: 13px; color: #8a8a8a;
}
.lb-sw a { color: #5b5ea6; font-weight: 500; }
.lb-sw a:hover { text-decoration: underline; }

/* ── RIGHT ── */
.reg-side {
  background: #f0f0f8;
  display: flex; align-items: center; justify-content: center;
  padding: 60px;
  border-left: 1px solid #e1e1e1;
}
.rs-inner { max-width: 300px; }

.rs-steps {
  display: flex; align-items: center;
  gap: 0; margin-bottom: 36px;
}
.rs-step {
  display: flex; flex-direction: column;
  align-items: center; gap: 6px;
}
.rs-step-dot {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid #d0d0d0;
  display: grid; place-items: center;
  font-size: 12px; font-weight: 600; color: #a0a0a0;
  background: white; transition: all .2s;
}
.rs-step.done .rs-step-dot {
  background: #107c10; border-color: #107c10;
  color: white;
}
.rs-step.active .rs-step-dot {
  background: #5b5ea6; border-color: #5b5ea6;
  color: white;
}
.rs-step-label {
  font-size: 11px; color: #8a8a8a; font-weight: 500;
  white-space: nowrap;
}
.rs-step.active .rs-step-label { color: #5b5ea6; font-weight: 600; }
.rs-step.done  .rs-step-label  { color: #107c10; }

.rs-line {
  flex: 1; height: 2px;
  background: #d0d0d0; margin: 0 8px;
  margin-bottom: 22px;
}

.rs-title {
  font-size: 24px; font-weight: 700;
  color: #1a1a1a; margin-bottom: 10px;
}
.rs-sub {
  font-size: 14px; color: #8a8a8a;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .reg-wrap  { grid-template-columns: 1fr; }
  .reg-side  { display: none; }
  .reg-box   { padding: 40px 24px; }
  .two-col   { grid-template-columns: 1fr; }
}
</style>