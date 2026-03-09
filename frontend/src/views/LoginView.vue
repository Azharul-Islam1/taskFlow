 <template>
  <div class="login">
    <div class="ll">
      <div class="aurora"></div>
      <div class="ll-grid"></div>
      <div class="gl g1"></div>
      <div class="gl g2"></div>
      <div class="gl g3"></div>
      <div class="fdots">
        <div class="fd"></div><div class="fd"></div><div class="fd"></div>
        <div class="fd"></div><div class="fd"></div><div class="fd"></div>
      </div>
      <div class="ll-c">
        <div class="badge"><span class="bdot"></span>Now in Public Beta</div>
        <h1 class="h1">Ship work faster<br>with <span class="gr">TaskFlow</span></h1>
        <p class="sub">A clean, powerful Kanban board for modern teams. Drag, drop, and ship — without the complexity.</p>
        <div class="features">
          <div class="feat"><div class="fi">⚡</div>Drag & drop with optimistic updates</div>
          <div class="feat"><div class="fi">🔐</div>JWT secured authentication</div>
          <div class="feat"><div class="fi">📊</div>Real-time activity log</div>
          <div class="feat"><div class="fi">🏷️</div>Priority tags & due dates</div>
        </div>
      </div>
    </div>

    <div class="lr">
      <div class="fb">
        <div class="logo">
          <div class="lmark">T</div>
          <span class="ltxt">TaskFlow</span>
        </div>
        <div class="fhd">Welcome back</div>
        <div class="fsd">
          No account?
          <router-link to="/register">Create one free →</router-link>
        </div>

        <transition name="slide-down">
          <div v-if="authStore.error" class="err-box">⚠ {{ authStore.error }}</div>
        </transition>

        <div class="fg">
          <label class="flb">Email</label>
          <div class="fw">
            <span class="fic">✉</span>
            <input class="fin" v-model="email" type="email"
              placeholder="you@example.com"
              @keyup.enter="handleLogin"
              :disabled="authStore.loading"/>
          </div>
        </div>
        <div class="fg">
          <label class="flb">Password</label>
          <div class="fw">
            <span class="fic">🔒</span>
            <input class="fin" v-model="password" type="password"
              placeholder="Your password"
              @keyup.enter="handleLogin"
              :disabled="authStore.loading"/>
          </div>
        </div>

        <button class="fbtn" @click="handleLogin" :disabled="authStore.loading">
          <span v-if="!authStore.loading">Sign in →</span>
          <span v-else class="spin"></span>
        </button>

        <div class="ftrust">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          256-bit SSL encrypted
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')

async function handleLogin() {
  if (!email.value || !password.value) return
  const ok = await authStore.login(email.value, password.value)
  if (ok) router.push('/')
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}

/* ── LEFT ── */
.ll {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 64px;
  background: #09091a;
  border-right: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
}

.aurora {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 100% 80% at 50% -10%, rgba(91,95,239,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 70%  60% at -10% 60%, rgba(6,182,212,0.12)  0%, transparent 50%),
    radial-gradient(ellipse 60%  60% at 110% 80%, rgba(139,92,246,0.12) 0%, transparent 50%),
    radial-gradient(ellipse 50%  50% at 50%  50%, rgba(91,95,239,0.05)  0%, transparent 60%);
  animation: auroraShift 14s ease-in-out infinite alternate;
}
@keyframes auroraShift {
  0%   { opacity: 0.85; filter: blur(0px);  transform: scale(1); }
  100% { opacity: 1;    filter: blur(2px);  transform: scale(1.05) translate(-8px,-6px); }
}

.ll-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(91,95,239,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(91,95,239,0.06) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 90% 90% at 50% 40%, black 20%, transparent 75%);
  animation: gridScroll 24s linear infinite;
}
@keyframes gridScroll {
  0%   { background-position: 0 0, 0 0; }
  100% { background-position: 56px 56px, 56px 56px; }
}

.gl {
  position: absolute; border-radius: 50%;
  filter: blur(60px); pointer-events: none;
  animation: glowPulse ease-in-out infinite alternate;
}
.g1 { width:360px; height:360px; top:-80px; left:-60px; background:rgba(91,95,239,0.18); animation-duration:8s; }
.g2 { width:260px; height:260px; bottom:-40px; right:-40px; background:rgba(6,182,212,0.13); animation-duration:11s; animation-delay:-4s; }
.g3 { width:180px; height:180px; top:40%; right:10%; background:rgba(139,92,246,0.1); animation-duration:7s; animation-delay:-2s; }
@keyframes glowPulse {
  0%   { transform: scale(1) translate(0,0); opacity: .7; }
  100% { transform: scale(1.15) translate(12px,-12px); opacity: 1; }
}

.fdots { position: absolute; inset: 0; overflow: hidden; }
.fd {
  position: absolute; width: 2px; height: 2px; border-radius: 50%;
  animation: fdRise linear infinite;
}
.fd:nth-child(1) { left:15%; top:95%; width:3px; height:3px; background:rgba(91,95,239,0.6);  animation-duration:9s;  animation-delay:0s; }
.fd:nth-child(2) { left:35%; top:90%; background:rgba(6,182,212,0.5);   animation-duration:12s; animation-delay:-3s; }
.fd:nth-child(3) { left:55%; top:88%; width:3px; height:3px; background:rgba(91,95,239,0.5);  animation-duration:10s; animation-delay:-6s; }
.fd:nth-child(4) { left:70%; top:92%; background:rgba(139,92,246,0.5);  animation-duration:14s; animation-delay:-1s; }
.fd:nth-child(5) { left:82%; top:85%; background:rgba(6,182,212,0.4);   animation-duration:11s; animation-delay:-8s; }
.fd:nth-child(6) { left:25%; top:85%; background:rgba(139,92,246,0.4);  animation-duration:13s; animation-delay:-5s; }
@keyframes fdRise {
  0%   { opacity: 0; transform: translateY(0) scale(1); }
  10%  { opacity: 1; }
  90%  { opacity: .4; }
  100% { opacity: 0; transform: translateY(-700px) scale(0.3); }
}

.ll-c { position: relative; z-index: 2; }

.badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 14px; border-radius: 20px;
  background: rgba(91,95,239,0.1);
  border: 1px solid rgba(91,95,239,0.24);
  font-size: 11px; font-weight: 600; color: #a5b4fc;
  letter-spacing: .06em; text-transform: uppercase;
  margin-bottom: 28px;
  animation: stgIn .6s ease both;
}
.bdot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #22d3a5;
  animation: bdotPing 2.5s ease-in-out infinite;
}
@keyframes bdotPing {
  0%,100% { box-shadow: 0 0 0 0 rgba(34,211,165,.6); }
  50%     { box-shadow: 0 0 0 6px rgba(34,211,165,0); }
}

.h1 {
  font-size: 46px; font-weight: 700;
  line-height: 1.1; letter-spacing: -.035em;
  color: #ededff; margin-bottom: 18px;
  animation: stgIn .6s ease .07s both;
}
.gr {
  background: linear-gradient(125deg, #a5b4fc 0%, #67e8f9 50%, #c4b5fd 100%);
  background-size: 200%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  animation: gradFlow 6s ease infinite;
}
@keyframes gradFlow { 0%,100%{background-position:0%} 50%{background-position:100%} }

.sub {
  font-size: 15px; color: #8080a8; line-height: 1.72;
  max-width: 400px; margin-bottom: 44px;
  animation: stgIn .6s ease .14s both;
}

.features {
  display: flex; flex-direction: column; gap: 10px;
  animation: stgIn .6s ease .21s both;
}
.feat {
  display: flex; align-items: center; gap: 12px;
  font-size: 13px; color: #8080a8;
  transition: color .18s;
}
.feat:hover { color: #ededff; }
.fi {
  width: 30px; height: 30px; flex-shrink: 0;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px; display: grid; place-items: center;
  font-size: 14px;
  transition: all .18s;
  filter: brightness(1.3);
}
.feat:hover .fi {
  background: rgba(91,95,239,0.15);
  border-color: rgba(91,95,239,0.3);
}

@keyframes stgIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }

/* ── RIGHT ── */
.lr {
  display: flex; align-items: center; justify-content: center;
  padding: 60px 72px;
  background: #05050e;
}
.fb {
  width: 100%; max-width: 344px;
  animation: stgIn .4s ease .1s both;
}
.logo { display: flex; align-items: center; gap: 9px; margin-bottom: 40px; }
.lmark {
  width: 32px; height: 32px; border-radius: 8px;
  background: #5b5fef;
  display: grid; place-items: center;
  font-size: 14px; font-weight: 700; color: white;
  box-shadow: 0 0 20px rgba(91,95,239,.35);
  position: relative; overflow: hidden;
}
.lmark::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 55%);
}
.ltxt { font-size: 16px; font-weight: 700; color: #ededff; letter-spacing: -.01em; }

.fhd { font-size: 21px; font-weight: 700; letter-spacing: -.02em; margin-bottom: 4px; }
.fsd { font-size: 13px; color: #484868; margin-bottom: 28px; line-height: 1.5; }
.fsd a { color: #7679f5; text-decoration: none; font-weight: 500; }
.fsd a:hover { text-decoration: underline; }

.err-box {
  background: rgba(244,63,94,0.08);
  border: 1px solid rgba(244,63,94,0.2);
  color: #fb7185; border-radius: 9px;
  padding: 10px 13px; margin-bottom: 14px; font-size: 13px;
}
.slide-down-enter-active { transition: all .2s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-6px); }

.fg { margin-bottom: 14px; }
.flb { display: block; font-size: 10px; font-weight: 600; color: #484868; text-transform: uppercase; letter-spacing: .09em; margin-bottom: 7px; }
.fw { position: relative; }
.fic { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 13px; color: #484868; pointer-events: none; }
.fin {
  width: 100%; background: #0e0e22;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 9px; padding: 11px 13px 11px 36px;
  color: #ededff; font-family: inherit; font-size: 14px; outline: none;
  transition: border-color .15s, box-shadow .15s, background .15s;
}
.fin:hover { border-color: rgba(255,255,255,0.11); background: #13132b; }
.fin:focus { border-color: #5b5fef; box-shadow: 0 0 0 3px rgba(91,95,239,0.16); background: #13132b; }
.fin::placeholder { color: #222238; }
.fin:disabled { opacity: 0.4; cursor: not-allowed; }

.fbtn {
  width: 100%; padding: 12px; margin-top: 6px;
  background: #5b5fef; border: none; border-radius: 9px;
  color: white; font-family: inherit; font-size: 14px; font-weight: 600;
  cursor: pointer; letter-spacing: .01em;
  transition: all .18s; position: relative; overflow: hidden;
}
.fbtn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.1) 0%,transparent 55%); }
.fbtn:hover:not(:disabled) { background: #4a4edf; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(91,95,239,.4); }
.fbtn:disabled { opacity: .5; cursor: not-allowed; }

.spin {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: white; border-radius: 50%;
  animation: spinR .7s linear infinite; display: inline-block;
}
@keyframes spinR { to { transform: rotate(360deg); } }

.ftrust {
  display: flex; align-items: center; justify-content: center; gap: 5px;
  margin-top: 16px; font-size: 11px; color: #222238;
}
.fsw { margin-top: 20px; text-align: center; font-size: 13px; color: #484868; }
.fsw a { color: #7679f5; text-decoration: none; font-weight: 500; }

@media (max-width: 860px) {
  .login { grid-template-columns: 1fr; }
  .ll { display: none; }
  .lr { padding: 40px 24px; }
}
</style>