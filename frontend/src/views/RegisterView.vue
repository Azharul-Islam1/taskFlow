 <template>
  <div class="auth-page">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="grid-overlay"></div>

    <div class="auth-card">
      <div class="logo">
        <span class="logo-icon">⬡</span>
        <span class="logo-text">TaskFlow</span>
      </div>

      <h1 class="auth-title">Create account</h1>
      <p class="auth-sub">Start managing your tasks today</p>

      <transition name="slide-down">
        <div v-if="authStore.error" class="error-banner">
          ⚠ {{ authStore.error }}
        </div>
      </transition>

      <div class="form">
        <div class="field">
          <label>Full Name</label>
          <input v-model="name" type="text" placeholder="John Doe" :disabled="authStore.loading" />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="you@example.com" :disabled="authStore.loading" />
        </div>
        <div class="field">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Min. 6 characters"
            @keyup.enter="handleRegister"
            :disabled="authStore.loading"
          />
        </div>
        <button class="btn-primary" @click="handleRegister" :disabled="authStore.loading">
          <span v-if="!authStore.loading">Create Account →</span>
          <span v-else class="spinner"></span>
        </button>
      </div>

      <p class="switch-link">
        Already have an account?
        <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')

async function handleRegister() {
  if (!name.value || !email.value || !password.value) return
  const success = await authStore.register(name.value, email.value, password.value)
  if (success) router.push('/')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(108,99,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(108,99,255,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
  animation: float 8s ease-in-out infinite;
}
.blob-1 {
  width: 450px; height: 450px;
  background: var(--accent-green);
  top: -80px; right: -80px;
}
.blob-2 {
  width: 350px; height: 350px;
  background: var(--accent-primary);
  bottom: -60px; left: -60px;
  animation-delay: -4s;
}
.auth-card {
  position: relative;
  z-index: 1;
  background: rgba(22, 22, 31, 0.8);
  backdrop-filter: blur(24px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 48px 44px;
  width: 100%; max-width: 420px;
  box-shadow: var(--shadow-card), var(--shadow-glow);
  animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.logo {
  display: flex; align-items: center;
  gap: 10px; margin-bottom: 32px;
}
.logo-icon {
  font-size: 28px;
  filter: drop-shadow(0 0 12px var(--accent-primary));
  animation: pulse-glow 3s ease-in-out infinite;
}
.logo-text {
  font-family: var(--font-display);
  font-size: 20px; font-weight: 700;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-green));
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.auth-title {
  font-family: var(--font-display);
  font-size: 28px; font-weight: 700; margin-bottom: 6px;
}
.auth-sub { color: var(--text-secondary); margin-bottom: 28px; }
.error-banner {
  background: rgba(255,101,132,0.1);
  border: 1px solid rgba(255,101,132,0.3);
  color: var(--accent-secondary);
  border-radius: var(--radius-sm);
  padding: 10px 14px; margin-bottom: 16px; font-size: 13px;
}
.slide-down-enter-active { transition: all 0.25s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-8px); }
.form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label {
  font-size: 12px; font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.field input {
  background: rgba(17,17,24,0.8);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  color: var(--text-primary);
  font-family: var(--font-body); font-size: 14px; outline: none;
  transition: all var(--transition-fast);
}
.field input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(108,99,255,0.15);
  background: rgba(17,17,24,1);
}
.field input:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary {
  background: linear-gradient(135deg, var(--accent-green), #2ecc71);
  background-size: 200% 200%;
  border: none; border-radius: var(--radius-sm);
  padding: 14px; color: #0a0a0f;
  font-family: var(--font-display); font-size: 14px; font-weight: 700;
  cursor: pointer; margin-top: 4px;
  display: flex; align-items: center; justify-content: center;
  min-height: 46px; transition: all var(--transition-smooth);
  letter-spacing: 0.03em;
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(67,233,123,0.3);
}
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: #0a0a0f; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.switch-link {
  margin-top: 24px; text-align: center;
  color: var(--text-secondary); font-size: 13px;
}
.switch-link a {
  color: var(--accent-primary); text-decoration: none; font-weight: 500;
  transition: color var(--transition-fast);
}
.switch-link a:hover { color: #8b85ff; text-decoration: underline; }
</style>