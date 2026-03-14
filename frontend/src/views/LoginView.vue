 <template>
  <div class="wrap">

    <!-- LEFT -->
    <div class="left">
      <div class="logo">
        <div class="logo-mark">T</div>
        <span class="logo-name">TaskFlow</span>
      </div>
      <div class="form-wrap">
        <div class="fhd">Welcome <span class="fhd-accent">back</span></div>
        <div class="fsh">Sign in to your workspace to continue</div>

        <transition name="slide-down">
          <div v-if="authStore.error" class="err-box">⚠ {{ authStore.error }}</div>
        </transition>

        <div class="field">
          <label class="flb">Email address</label>
          <div class="fin-wrap">
            <span class="fin-ic">✉</span>
            <input
              class="fin" type="email"
              v-model="email"
              placeholder="you@example.com"
              @keyup.enter="handleLogin"
              :disabled="authStore.loading"
            />
          </div>
        </div>

        <div class="field">
          <label class="flb">Password</label>
          <div class="fin-wrap">
            <span class="fin-ic">🔒</span>
            <input
              class="fin" type="password"
              v-model="password"
              placeholder="••••••••"
              @keyup.enter="handleLogin"
              :disabled="authStore.loading"
            />
          </div>
        </div>

        <button class="fbtn" @click="handleLogin" :disabled="authStore.loading">
          <span v-if="!authStore.loading">Sign in to TaskFlow →</span>
          <span v-else class="spin"></span>
        </button>

        <div class="divider">
          <div class="div-line"></div>
          <div class="div-txt">OR</div>
          <div class="div-line"></div>
        </div>

        <div class="fsw">
          New to TaskFlow?
          <router-link to="/register">Create a free account</router-link>
        </div>

        <div class="trust">
          <div class="trust-av">
            <div class="tav" style="background:#5b5ea6">AI</div>
            <div class="tav" style="background:#0ea5e9">JD</div>
            <div class="tav" style="background:#10b981">RS</div>
            <div class="tav" style="background:#f59e0b">KP</div>
          </div>
          <div class="trust-txt"><strong>4 teammates</strong> already using TaskFlow</div>
        </div>
      </div>
    </div>

    <!-- RIGHT -->
    <div class="right">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
      <div class="blob b3"></div>
      <div class="blob b4"></div>

      <div class="badge badge-tl">
        <span class="badge-ic">✅</span>
        <div>
          <div class="badge-main">Task completed</div>
          <div class="badge-sub">Just now · by Azharul</div>
        </div>
      </div>
      <div class="badge badge-tr">
        <span class="badge-ic">🔥</span>
        <div>
          <div class="badge-main">3 tasks due today</div>
          <div class="badge-sub">Sprint deadline near</div>
        </div>
      </div>
      <div class="badge badge-bl">
        <span class="badge-ic">📦</span>
        <div>
          <div class="badge-main">Sprint 1 · 7 tasks</div>
          <div class="badge-sub">2 in progress</div>
        </div>
      </div>

      <div class="rc">
        <div class="rc-label">
          <span class="rc-dot"></span>Live Board Preview
        </div>
        <div class="rc-h">Everything in one<br><em>organized board</em></div>
        <div class="rc-sub">Drag, assign, track — your sprint, beautifully managed.</div>

        <!-- KANBAN MOCKUP -->
        <div class="mockup">
          <div class="mk-bar">
            <div class="mk-dots">
              <div class="mk-dot r"></div>
              <div class="mk-dot y"></div>
              <div class="mk-dot g"></div>
            </div>
            <div class="mk-title">TaskFlow · Sprint Board</div>
            <div class="mk-av">AI</div>
          </div>
          <div class="mk-sub">
            <div class="mk-subbtn">+ Add task</div>
            <div class="mk-subghost">Filter</div>
            <div class="mk-subghost">Group by</div>
            <div class="mk-search">🔍 Search...</div>
          </div>
          <div class="mk-board">
            <div class="mk-col">
              <div class="mk-col-hd">
                <div class="mk-col-dot" style="background:#94a3b8"></div>
                <div class="mk-col-name">To Do</div>
                <div class="mk-col-count">3</div>
              </div>
              <div class="mcard pri-high">
                <span class="mcard-tag tag-purple">UI/UX</span>
                <div class="mcard-title">I1. Theme token system</div>
                <div class="mcard-ft">
                  <span class="mcard-date date-red">📅 06/03</span>
                  <div class="mcard-av" style="background:#8b6352">AI</div>
                </div>
              </div>
              <div class="mcard pri-med">
                <span class="mcard-tag tag-blue">Frontend</span>
                <div class="mcard-title">Setup Vue Router & Pinia</div>
                <div class="mcard-ft">
                  <span class="mcard-date date-amber">📅 03/15</span>
                  <div class="mcard-av" style="background:#5b5ea6">JD</div>
                </div>
              </div>
              <div class="mcard pri-low">
                <span class="mcard-tag tag-green">Backend</span>
                <div class="mcard-title">Write API documentation</div>
                <div class="mcard-ft">
                  <span class="mcard-date date-gray">📅 03/22</span>
                </div>
              </div>
            </div>

            <div class="mk-col">
              <div class="mk-col-hd">
                <div class="mk-col-dot" style="background:#3b82f6"></div>
                <div class="mk-col-name">In Progress</div>
                <div class="mk-col-count">2</div>
              </div>
              <div class="mcard active-card pri-high">
                <span class="mcard-tag tag-blue">Frontend</span>
                <div class="mcard-title">Kanban drag & drop board</div>
                <div class="mcard-ft">
                  <span class="mcard-date date-red">📅 03/12</span>
                  <div class="mcard-av" style="background:#8b6352">AI</div>
                </div>
              </div>
              <div class="mcard pri-med">
                <span class="mcard-tag tag-green">Backend</span>
                <div class="mcard-title">JWT auth middleware</div>
                <div class="mcard-ft">
                  <span class="mcard-date date-gray">📅 03/14</span>
                  <div class="mcard-av" style="background:#0ea5e9">RS</div>
                </div>
              </div>
            </div>

            <div class="mk-col">
              <div class="mk-col-hd">
                <div class="mk-col-dot" style="background:#22c55e"></div>
                <div class="mk-col-name">Done</div>
                <div class="mk-col-count">2</div>
              </div>
              <div class="mcard pri-low done-card">
                <span class="mcard-tag tag-green">Backend</span>
                <div class="mcard-title done-title">MongoDB Atlas setup</div>
                <div class="mcard-ft">
                  <span class="mcard-date date-gray">📅 03/05</span>
                  <div class="mcard-av" style="background:#8b6352">AI</div>
                </div>
              </div>
              <div class="mcard pri-low done-card">
                <span class="mcard-tag tag-rose">Setup</span>
                <div class="mcard-title done-title">Git init & folder structure</div>
                <div class="mcard-ft">
                  <span class="mcard-date date-gray">📅 03/03</span>
                  <div class="mcard-av" style="background:#5b5ea6">JD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router    = useRouter()
const authStore = useAuthStore()
const email     = ref('')
const password  = ref('')

async function handleLogin() {
  if (!email.value || !password.value) return
  const ok = await authStore.login(email.value, password.value)
  if (ok) router.push('/')
}
</script>

<style scoped>
.wrap {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 460px 1fr;
  overflow: hidden;
}

/* ── LEFT ── */
.left {
  background: #fff;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 48px 52px;
  position: relative; z-index: 10;
  box-shadow: 4px 0 40px rgba(0,0,0,0.08);
}
.left::before {
  content: ''; position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}

.logo {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 44px; position: relative;
}
.logo-mark {
  width: 40px; height: 40px; border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: grid; place-items: center;
  font-size: 18px; font-weight: 800; color: white;
  box-shadow: 0 4px 14px rgba(59,130,246,0.4);
}
.logo-name { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -.5px; }

.form-wrap { width: 100%; position: relative; }

.fhd { font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 6px; letter-spacing: -.6px; line-height: 1.2; }
.fsh { font-size: 13.5px; color: #94a3b8; margin-bottom: 32px; font-weight: 500; }

.fhd-accent { display: inline-block; position: relative; color: #3b82f6; }
.fhd-accent::after {
  content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
  height: 3px; background: linear-gradient(90deg, #3b82f6, #6366f1);
  border-radius: 2px;
  animation: underlineGrow 1s cubic-bezier(.4,0,.2,1) .3s both;
  transform-origin: left;
}
@keyframes underlineGrow { from { transform: scaleX(0) } to { transform: scaleX(1) } }

.err-box {
  background: #fde7e9; border: 1px solid #f1b2b7;
  color: #d13438; border-radius: 6px;
  padding: 10px 13px; margin-bottom: 16px; font-size: 13px;
}
.slide-down-enter-active { transition: all .2s ease; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-6px); }

.field { margin-bottom: 18px; }
.flb {
  display: block; font-size: 12px; font-weight: 700; color: #475569;
  margin-bottom: 7px; letter-spacing: .02em; text-transform: uppercase;
}
.fin-wrap { position: relative; }
.fin-ic {
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  color: #94a3b8; pointer-events: none; font-size: 14px;
}
.fin {
  width: 100% !important; padding: 11px 13px 11px 38px !important;
  border: 1.5px solid #e2e8f0 !important; border-radius: 10px !important;
  font-size: 14px !important; color: #0f172a !important;
  background: white !important; outline: none !important;
  box-shadow: none !important;
  transition: border-color .15s, box-shadow .15s, background .15s !important;
}
.fin:hover { border-color: #cbd5e1 !important; }
.fin:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 4px rgba(59,130,246,0.1) !important;
  background: #f8fbff !important;
}
.fin::placeholder { color: #cbd5e1 !important; }
.fin:disabled     { opacity: .5; cursor: not-allowed; }

.fbtn {
  width: 100%; padding: 13px; margin-top: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  border: none; border-radius: 10px;
  color: white; font-size: 14.5px; font-weight: 700;
  cursor: pointer; font-family: inherit;
  transition: all .2s;
  box-shadow: 0 4px 20px rgba(59,130,246,0.35);
  position: relative; overflow: hidden;
}
.fbtn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(59,130,246,0.45);
}
.fbtn:disabled { opacity: .5; cursor: not-allowed; }

.spin {
  width: 18px; height: 18px; display: inline-block;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: white; border-radius: 50%;
  animation: spinR .7s linear infinite;
}
@keyframes spinR { to { transform: rotate(360deg) } }

.divider { display: flex; align-items: center; gap: 12px; margin: 22px 0; }
.div-line { flex: 1; height: 1px; background: #f1f5f9; }
.div-txt  { font-size: 12px; color: #cbd5e1; font-weight: 600; }

.fsw { text-align: center; font-size: 13px; color: #94a3b8; font-weight: 500; }
.fsw a { color: #3b82f6; font-weight: 700; text-decoration: none; }
.fsw a:hover { text-decoration: underline; }

.trust {
  display: flex; align-items: center; gap: 10px;
  margin-top: 28px; padding-top: 22px;
  border-top: 1px solid #f1f5f9;
}
.trust-av { display: flex; }
.tav {
  width: 26px; height: 26px; border-radius: 50%;
  border: 2px solid white; margin-left: -7px;
  display: grid; place-items: center;
  font-size: 9px; font-weight: 700; color: white;
}
.tav:first-child { margin-left: 0; }
.trust-txt { font-size: 12px; color: #94a3b8; font-weight: 500; }
.trust-txt strong { color: #475569; }

/* ── RIGHT ── */
.right {
  position: relative; overflow: hidden;
  background: linear-gradient(145deg, #eff6ff 0%, #eef2ff 40%, #f0f9ff 100%);
}

.blob {
  position: absolute; border-radius: 50%;
  filter: blur(70px); pointer-events: none;
  mix-blend-mode: multiply;
}
.b1 { width: 600px; height: 600px; top: -150px; right: -100px; background: #bfdbfe; opacity: .7; animation: blobMove1 12s ease-in-out infinite alternate; }
.b2 { width: 400px; height: 400px; bottom: -100px; left: -50px; background: #c7d2fe; opacity: .6; animation: blobMove2 15s ease-in-out infinite alternate; }
.b3 { width: 300px; height: 300px; top: 40%; left: 30%; background: #bae6fd; opacity: .5; animation: blobMove3 9s ease-in-out infinite alternate; }
.b4 { width: 200px; height: 200px; bottom: 20%; right: 10%; background: #ddd6fe; opacity: .5; animation: blobMove1 11s ease-in-out infinite alternate-reverse; }

@keyframes blobMove1 { 0% { transform: scale(1) translate(0,0) } 100% { transform: scale(1.1) translate(30px,-20px) } }
@keyframes blobMove2 { 0% { transform: scale(1) translate(0,0) } 100% { transform: scale(1.15) translate(-20px,25px) } }
@keyframes blobMove3 { 0% { transform: scale(1) translate(0,0) } 100% { transform: scale(.9) translate(15px,15px) } }

/* floating badges */
.badge {
  position: absolute; z-index: 3;
  background: white; border-radius: 12px;
  padding: 8px 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  display: flex; align-items: center; gap: 8px;
  white-space: nowrap;
}
.badge-tl { top: 12%; left: 3%; animation: badgeFloat1 7s ease-in-out infinite; }
.badge-tr { top: 8%;  right: 3%; animation: badgeFloat2 8s ease-in-out infinite; }
.badge-bl { bottom: 8%; left: 3%; animation: badgeFloat1 9s ease-in-out infinite alternate-reverse; }
@keyframes badgeFloat1 { 0%,100% { transform: translateY(0) rotate(-1deg) } 50% { transform: translateY(-8px) rotate(1deg) } }
@keyframes badgeFloat2 { 0%,100% { transform: translateY(0) rotate(1deg) } 50% { transform: translateY(-6px) rotate(-1deg) } }

.badge-ic   { font-size: 16px; }
.badge-main { font-size: 12px; font-weight: 600; color: #0f172a; }
.badge-sub  { font-size: 10px; color: #94a3b8; font-weight: 500; }

/* rc */
.rc {
  position: relative; z-index: 2;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 100%; padding: 48px 40px;
}
.rc-label {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2);
  border-radius: 20px; padding: 6px 15px;
  font-size: 11.5px; font-weight: 700; color: #3b82f6;
  letter-spacing: .05em; text-transform: uppercase;
  margin-bottom: 20px;
}
.rc-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.5) } 50% { box-shadow: 0 0 0 7px rgba(34,197,94,0) } }
.rc-h {
  font-size: 30px; font-weight: 800; color: #0f172a;
  text-align: center; letter-spacing: -.6px; line-height: 1.2; margin-bottom: 10px;
}
.rc-h em {
  font-style: normal;
  background: linear-gradient(120deg, #3b82f6, #6366f1, #8b5cf6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.rc-sub { font-size: 13.5px; color: #64748b; text-align: center; margin-bottom: 28px; line-height: 1.6; }

/* mockup */
.mockup {
  width: 100%; max-width: 600px;
  background: white; border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06);
  overflow: hidden;
  animation: floatUp 6s ease-in-out infinite;
}
@keyframes floatUp { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }

.mk-bar {
  background: #1e1f3b; padding: 9px 14px;
  display: flex; align-items: center; gap: 10px;
}
.mk-dots { display: flex; gap: 5px; }
.mk-dot  { width: 10px; height: 10px; border-radius: 50%; }
.mk-dot.r { background: #ff5f57; }
.mk-dot.y { background: #febc2e; }
.mk-dot.g { background: #28c840; }
.mk-title { flex: 1; text-align: center; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.5); letter-spacing: .04em; }
.mk-av { width: 22px; height: 22px; border-radius: 50%; background: #5b5ea6; display: grid; place-items: center; font-size: 9px; font-weight: 700; color: white; }

.mk-sub {
  background: white; border-bottom: 1px solid #f1f5f9;
  padding: 7px 12px; display: flex; align-items: center; gap: 6px;
}
.mk-subbtn  { padding: 3px 9px; border-radius: 4px; font-size: 9.5px; font-weight: 600; background: #3b82f6; color: white; cursor: default; }
.mk-subghost{ padding: 3px 9px; border-radius: 4px; font-size: 9.5px; font-weight: 500; background: #f8fafc; color: #94a3b8; border: 1px solid #e2e8f0; cursor: default; }
.mk-search  { display: flex; align-items: center; gap: 4px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 3px 8px; margin-left: auto; font-size: 9.5px; color: #94a3b8; }

.mk-board { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; padding: 12px; background: #f8fafc; }
.mk-col-hd { display: flex; align-items: center; gap: 5px; margin-bottom: 7px; }
.mk-col-dot  { width: 7px; height: 7px; border-radius: 50%; }
.mk-col-name { font-size: 9.5px; font-weight: 700; color: #0f172a; }
.mk-col-count{ font-size: 8.5px; color: #94a3b8; background: #e2e8f0; border-radius: 8px; padding: 1px 5px; }

.mcard {
  background: white; border: 1px solid #f1f5f9; border-radius: 6px;
  padding: 7px 8px; margin-bottom: 5px;
  position: relative; overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  animation: cardIn .5s ease both;
}
@keyframes cardIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }
.mcard:nth-child(1){animation-delay:.1s}.mcard:nth-child(2){animation-delay:.25s}
.mcard:nth-child(3){animation-delay:.4s}.mcard:nth-child(4){animation-delay:.55s}

.mcard::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; }
.pri-high::after { background: #ef4444; }
.pri-med::after  { background: #f59e0b; }
.pri-low::after  { background: #22c55e; }

.active-card { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
.done-card   { opacity: .6; }

.mcard-tag {
  display: inline-block; font-size: 7.5px; font-weight: 600;
  padding: 2px 5px; border-radius: 3px; margin-bottom: 4px;
}
.tag-purple { background: #ede9fe; color: #7c3aed; }
.tag-blue   { background: #dbeafe; color: #1d4ed8; }
.tag-green  { background: #dcfce7; color: #15803d; }
.tag-rose   { background: #ffe4e6; color: #be123c; }

.mcard-title { font-size: 9px; color: #0f172a; font-weight: 500; line-height: 1.4; margin-bottom: 6px; }
.done-title  { text-decoration: line-through; color: #94a3b8; }
.mcard-ft    { display: flex; align-items: center; justify-content: space-between; }
.mcard-date  { font-size: 7.5px; font-weight: 600; padding: 2px 5px; border-radius: 3px; }
.date-red    { background: #fde7e9; color: #d13438; }
.date-gray   { background: #f1f5f9; color: #94a3b8; }
.date-amber  { background: #fff4ce; color: #c7700a; }
.mcard-av    { width: 14px; height: 14px; border-radius: 50%; display: grid; place-items: center; font-size: 6px; font-weight: 700; color: white; }

@media (max-width: 900px) {
  .wrap { grid-template-columns: 1fr; }
  .right { display: none; }
  .left  { padding: 40px 28px; }
}
</style>