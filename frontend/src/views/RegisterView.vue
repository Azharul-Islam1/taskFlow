 <template>
  <div class="reg">
    <div class="rb"></div>
    <div class="rg"></div>

    <div class="rc">
      <div class="logo">
        <div class="lmark">T</div>
        <span class="ltxt">TaskFlow</span>
      </div>

      <div class="steps">
        <div class="step done"></div>
        <div class="step now"></div>
        <div class="step"></div>
      </div>
      <div class="plbl">
        <span>Account Setup</span>
        <span>Step 2 of 3</span>
      </div>

      <div class="rhd">Create your account</div>
      <div class="rsh">Free forever. No credit card required.</div>

      <transition name="slide-down">
        <div v-if="authStore.error" class="err-box">⚠ {{ authStore.error }}</div>
      </transition>

      <div class="twoc">
        <div class="tc-f">
          <label class="flb">First name</label>
          <input v-model="firstName" placeholder="John" :disabled="authStore.loading"/>
        </div>
        <div class="tc-f">
          <label class="flb">Last name</label>
          <input v-model="lastName" placeholder="Doe" :disabled="authStore.loading"/>
        </div>
      </div>

      <div class="fg">
        <label class="flb">Email</label>
        <div class="fw">
          <span class="fic">✉</span>
          <input class="fin" v-model="email" type="email"
            placeholder="you@example.com" :disabled="authStore.loading"/>
        </div>
      </div>

      <div class="fg">
        <label class="flb">Password</label>
        <div class="fw">
          <span class="fic">🔒</span>
          <input class="fin" v-model="password" type="password"
            placeholder="Min. 8 characters"
            @keyup.enter="handleRegister"
            :disabled="authStore.loading"/>
        </div>
        <div v-if="password" class="pwm">
          <div class="pwtk">
            <div class="pwsg" :class="pwClass(1)"></div>
            <div class="pwsg" :class="pwClass(2)"></div>
            <div class="pwsg" :class="pwClass(3)"></div>
            <div class="pwsg" :class="pwClass(4)"></div>
          </div>
          <div class="pwht" :style="{ color: pwColor }">{{ pwLabel }}</div>
        </div>
      </div>

      <button class="fbtn-g" @click="handleRegister" :disabled="authStore.loading">
        <span v-if="!authStore.loading">Create account →</span>
        <span v-else class="spin"></span>
      </button>

      <div class="fsw">
        Have an account?
        <router-link to="/login">Sign in</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName  = ref('')
const email     = ref('')
const password  = ref('')

const pwStrength = computed(() => {
  const l = password.value.length
  if (l === 0) return 0
  if (l < 6)  return 1
  if (l < 10) return 2
  return 3
})
const pwColor = computed(() => ['#f43f5e','#f59e0b','#22d3a5'][pwStrength.value - 1] || '#222238')
const pwLabel = computed(() => ['Weak','Medium — add numbers or symbols','Strong ✓'][pwStrength.value - 1] || '')

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
  const ok = await authStore.register(name, email.value, password.value)
  if (ok) router.push('/')
}
</script>

<style scoped>
.reg {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  background: #05050e; padding: 40px 24px;
}

.rb {
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 50% 0%,   rgba(91,95,239,.15)  0%, transparent 58%),
    radial-gradient(ellipse 45% 45% at 90% 90%,  rgba(34,211,165,.07) 0%, transparent 55%),
    radial-gradient(ellipse 35% 35% at 5%  70%,  rgba(6,182,212,.06)  0%, transparent 55%);
}
.rg {
  position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(91,95,239,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(91,95,239,.04) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at 50% 25%, black 5%, transparent 65%);
  animation: gridScroll 24s linear infinite;
}
@keyframes gridScroll {
  0%   { background-position: 0 0, 0 0; }
  100% { background-position: 56px 56px, 56px 56px; }
}

.rc {
  position: relative; z-index: 2;
  background: rgba(9,9,26,.88);
  backdrop-filter: blur(48px);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px; padding: 44px;
  width: 100%; max-width: 448px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.04),
    0 32px 80px rgba(0,0,0,.6),
    0 0 50px rgba(91,95,239,.08);
  animation: cardIn .45s cubic-bezier(.34,1.2,.64,1);
}
@keyframes cardIn {
  from { opacity:0; transform: translateY(22px) scale(.98); }
  to   { opacity:1; transform: none; }
}

.logo { display: flex; align-items: center; gap: 9px; margin-bottom: 20px; }
.lmark {
  width: 32px; height: 32px; border-radius: 8px;
  background: #5b5fef;
  display: grid; place-items: center;
  font-size: 14px; font-weight: 700; color: white;
  box-shadow: 0 0 20px rgba(91,95,239,.35);
  position: relative; overflow: hidden;
}
.lmark::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 55%); }
.ltxt { font-size: 16px; font-weight: 700; color: #ededff; letter-spacing: -.01em; }

.steps { display: flex; gap: 5px; margin-bottom: 8px; }
.step { height: 2px; flex: 1; background: rgba(255,255,255,0.07); border-radius: 1px; transition: background .4s; }
.step.done { background: #5b5fef; }
.step.now  { background: linear-gradient(90deg, #5b5fef, #67e8f9); box-shadow: 0 0 8px rgba(91,95,239,.4); }

.plbl {
  display: flex; justify-content: space-between;
  font-size: 11px; color: #484868; font-weight: 500;
  margin-bottom: 22px;
}
.plbl span:last-child { color: #7679f5; }

.rhd { font-size: 21px; font-weight: 700; letter-spacing: -.02em; margin-bottom: 4px; }
.rsh { font-size: 13px; color: #484868; margin-bottom: 22px; }

.err-box {
  background: rgba(244,63,94,0.08);
  border: 1px solid rgba(244,63,94,0.2);
  color: #fb7185; border-radius: 9px;
  padding: 10px 13px; margin-bottom: 14px; font-size: 13px;
}
.slide-down-enter-active { transition: all .2s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-6px); }

.twoc { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
.tc-f { display: flex; flex-direction: column; gap: 6px; }
.tc-f input {
  background: #0e0e22; border: 1px solid rgba(255,255,255,0.07);
  border-radius: 9px; padding: 11px 13px;
  color: #ededff; font-family: inherit; font-size: 14px; outline: none;
  transition: all .15s;
}
.tc-f input:hover { background: #13132b; }
.tc-f input:focus { border-color: #5b5fef; box-shadow: 0 0 0 3px rgba(91,95,239,.16); background: #13132b; }
.tc-f input::placeholder { color: #222238; }
.tc-f input:disabled { opacity: .4; }

.fg { margin-bottom: 14px; }
.flb { display: block; font-size: 10px; font-weight: 600; color: #484868; text-transform: uppercase; letter-spacing: .09em; margin-bottom: 7px; }
.fw { position: relative; }
.fic { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 13px; color: #484868; pointer-events: none; }
.fin {
  width: 100%; background: #0e0e22;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 9px; padding: 11px 13px 11px 36px;
  color: #ededff; font-family: inherit; font-size: 14px; outline: none;
  transition: all .15s;
}
.fin:hover { border-color: rgba(255,255,255,0.11); background: #13132b; }
.fin:focus { border-color: #5b5fef; box-shadow: 0 0 0 3px rgba(91,95,239,.16); background: #13132b; }
.fin::placeholder { color: #222238; }
.fin:disabled { opacity: .4; }

.pwm { margin-top: 7px; }
.pwtk { display: grid; grid-template-columns: repeat(4,1fr); gap: 3px; }
.pwsg { height: 2px; border-radius: 1px; background: rgba(255,255,255,0.07); transition: background .3s; }
.pwsg.w { background: #f43f5e; }
.pwsg.m { background: #f59e0b; }
.pwsg.s { background: #22d3a5; }
.pwht { font-size: 11px; margin-top: 5px; transition: color .3s; }

.fbtn-g {
  width: 100%; padding: 12px; margin-top: 6px;
  background: #22d3a5; border: none; border-radius: 9px;
  color: #04110e; font-family: inherit; font-size: 14px; font-weight: 600;
  cursor: pointer; letter-spacing: .01em;
  transition: all .18s; position: relative; overflow: hidden;
}
.fbtn-g::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 55%); }
.fbtn-g:hover:not(:disabled) { background: #1ab88f; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,211,165,.3); }
.fbtn-g:disabled { opacity: .5; cursor: not-allowed; }

.spin {
  width: 16px; height: 16px;
  border: 2px solid rgba(0,0,0,.2);
  border-top-color: #04110e; border-radius: 50%;
  animation: spinR .7s linear infinite; display: inline-block;
}
@keyframes spinR { to { transform: rotate(360deg); } }

.fsw { margin-top: 18px; text-align: center; font-size: 13px; color: #484868; }
.fsw a { color: #7679f5; text-decoration: none; font-weight: 500; }
.fsw a:hover { text-decoration: underline; }

@media (max-width: 520px) {
  .rc { padding: 32px 22px; }
  .twoc { grid-template-columns: 1fr; }
}
</style>